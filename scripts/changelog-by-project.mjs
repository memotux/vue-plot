#!/usr/bin/env node
// scripts/changelog-by-project.mjs
//
// Per-package changelog and version bump. Mirrors `changelogen --release`
// but filters commits by the package directory and uses per-package tags.
//
// Usage:
//   node scripts/changelog-by-project.mjs <packageDir> [--dry-run]
//   node ../../scripts/changelog-by-project.mjs .            (from inside the package)
//
// Each package must declare a `changelog.config.ts` (or a `changelog`
// field in package.json) that sets a unique tagMessage template, e.g.:
//
//   export default {
//     templates: { tagMessage: 'nuxt-v{{newVersion}}' },
//   }
//
// Without a unique prefix the script falls back to the default `v*` tags
// and will collide with the root package's tags.

import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import {
  bumpVersion,
  generateMarkDown,
  loadChangelogConfig,
  parseCommits,
} from 'changelogen'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

// ---------- args ----------
const rawArg = process.argv[2]
const dryRun = process.argv.includes('--dry-run')
const noTag = process.argv.includes('--no-tag')

if (!rawArg) {
  console.error('Usage: node scripts/changelog-by-project.mjs <packageDir> [--dry-run]')
  process.exit(1)
}

// `.` means "the directory I was invoked from" (e.g. when wired into
// the package's own `release` script).
const pkgAbsDir = rawArg === '.' ? process.cwd() : resolve(repoRoot, rawArg)
const pkgRelDir = relative(repoRoot, pkgAbsDir) || '.'

if (!existsSync(resolve(pkgAbsDir, 'package.json'))) {
  console.error(`No package.json in ${pkgAbsDir}`)
  process.exit(1)
}

const exec = (cmd) => {
  try {
    return execSync(cmd, { cwd: repoRoot, encoding: 'utf8', stdio: 'pipe' }).trim()
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString().trim() : err.message
    console.error(`[changelog-by-project] command failed: ${cmd}\n${stderr}`)
    process.exit(1)
  }
}

// ---------- helpers ----------

/** Most recent tag matching a glob, semver-sorted descending. */
function getLastPackageTag(pattern) {
  try {
    const out = exec(`git tag --list "${pattern}" --sort=-v:refname`)
    return out.split('\n').find(Boolean) ?? ''
  } catch {
    return ''
  }
}

/**
 * Commits in range that touched `pkgPath`, formatted like changelogen's
 * internal `getGitDiff` so `parseCommits` can consume them directly.
 */
function getPackageCommits(fromTag, pkgPath) {
  const range = fromTag ? `${fromTag}...HEAD` : 'HEAD'
  const out = exec(
    `git --no-pager log ${range} --pretty="----%n%s|%h|%an|%ae%n%b" --name-status -- ${pkgPath}`,
  )
  if (!out.trim()) return []
  return out
    .split('----\n')
    .splice(1)
    .map((block) => {
      const lines = block.split('\n')
      const [message, shortHash, authorName, authorEmail] = lines[0].split('|')
      return {
        message: message ?? '',
        shortHash: shortHash ?? '',
        author: { name: authorName ?? '', email: authorEmail ?? '' },
        body: lines.slice(1).join('\n').trim(),
      }
    })
    .filter((c) => c.message && c.shortHash)
}

// ---------- main ----------

// 1. Per-package config (changelog.config.ts or package.json#changelog).
const config = await loadChangelogConfig(pkgAbsDir, { cwd: pkgAbsDir })

// 2. Infer the tag prefix from the tagMessage template.
const tagTpl = config.templates?.tagMessage ?? 'v{{newVersion}}'
const tagPrefix = tagTpl.replace('{{newVersion}}', '')

// 3. Resolve the previous tag for THIS package only.
const fromTag = getLastPackageTag(`${tagPrefix}*`)
console.log(`[changelog-by-project] package: ${pkgRelDir}`)
console.log(`[changelog-by-project] from:    ${fromTag || '(none — first release)'}`)

// 4. Path-filtered commits.
const raw = getPackageCommits(fromTag, pkgRelDir)
const commits = parseCommits(raw, config)
console.log(`[changelog-by-project] commits: ${commits.length}`)

if (commits.length === 0) {
  console.log('[changelog-by-project] No commits to release. Exiting.')
  process.exit(0)
}

// 5. Bump version (breaking → major, feat → minor, fix → patch).
//    In dry-run mode, snapshot package.json first so the bump can be
//    reverted — changelogen's bumpVersion() writes the file regardless
//    of any flag we pass.
let pkgSnapshot
if (dryRun) {
  pkgSnapshot = await readFile(resolve(pkgAbsDir, 'package.json'), 'utf8')
}
const newVersion = await bumpVersion(commits, config)
if (!newVersion) {
  console.error('[changelog-by-project] Unable to determine new version.')
  process.exit(1)
}
if (dryRun) {
  await writeFile(resolve(pkgAbsDir, 'package.json'), pkgSnapshot)
  console.log(`[changelog-by-project] version: ${newVersion} (dry-run — package.json restored)`)
} else {
  console.log(`[changelog-by-project] version: ${newVersion}`)
}

// 6. Generate markdown.
config.newVersion = newVersion
const markdown = await generateMarkDown(commits, config)

// 7. Write CHANGELOG.md, preserving prior content above the new entry.
if (typeof config.output === 'string' && config.output) {
  const exists = existsSync(config.output)
  const prev = exists ? await readFile(config.output, 'utf8') : '# Changelog\n\n'
  const lastEntry = prev.match(/^#{2,}\s+.*$/m)
  const updated = lastEntry
    ? prev.slice(0, lastEntry.index) + markdown + '\n\n' + prev.slice(lastEntry.index)
    : prev + '\n' + markdown + '\n\n'
  if (!dryRun) {
    await writeFile(config.output, updated)
  }
  console.log(`[changelog-by-project] wrote:   ${relative(repoRoot, config.output)}`)
}

// 8. Commit + tag.
if (!dryRun) {
  const relOutput = relative(repoRoot, config.output)
  exec(`git add ${pkgRelDir}/package.json ${relOutput}`)
  const commitMsg = (config.templates?.commitMessage ?? 'chore(release): v{{newVersion}}')
    .replaceAll('{{newVersion}}', newVersion)
  exec(`git commit -m "${commitMsg}"`)
  if (!noTag) {
    const tagMsg = tagTpl.replaceAll('{{newVersion}}', newVersion)
    const tagBody = (config.templates?.tagBody ?? tagMsg).replaceAll('{{newVersion}}', newVersion)
    exec(`git tag ${config.signTags ? '-s' : ''} -am "${tagMsg}" "${tagBody}"`)
    console.log(`[changelog-by-project] tagged:  ${tagBody}`)
  } else {
    console.log('[changelog-by-project] tagged:  (skipped — --no-tag)')
  }
}

console.log('\n[changelog-by-project] Done.')
