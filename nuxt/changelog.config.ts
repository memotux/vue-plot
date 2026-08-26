// nuxt/changelog.config.ts
//
// Consumed by scripts/changelog-by-project.mjs. Sets a distinct tag
// namespace so nuxt releases never collide with the root package's
// `v*` tags. Conventional-commit types inherit from changelogen defaults.

export default {
  output: 'CHANGELOG.md',
  templates: {
    tagMessage: 'nuxt-v{{newVersion}}',
    tagBody: 'nuxt-v{{newVersion}}',
    commitMessage: 'chore(release-nuxt): v{{newVersion}}',
  },
}
