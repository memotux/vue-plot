# Feature: issue close-out trio + nuxt config deferred items

## Context
Closes GitHub issues #9, #11, #12 and the two deferred items from Judgment Day
(Engram obs 631, `todo/nuxt-vue-plot`). Read-only exploration done 2026-09-21.

## Tasks
- [x] T1 — Text VNode coverage for createText/setText (issue #9): DONE,
  commit 32182a3 (branch fix/issue-closeout-nuxt-deferred). tests/textVNode.test.ts
  7 tests. Discovery: raw text children in VPlot are created by createText but
  never attached to the plot container (insert() early-returns for ctx.root).
  Accepted as designed behavior; potential src fix left as a separate decision.
- [x] T2 — Nuxt module test coverage (issue #11): DONE, commit 2005830.
  nuxt/test/module.test.ts (10 unit tests via runWithNuxtContext). Findings:
  prev hook returning strict false vetoes Plot tags; setup() itself is not
  idempotent (guarded at module boundary). Vitest globals are NOT enabled in
  nuxt/ — imports required.
- [x] T3 — Nuxt quick setup in root README (issue #12): DONE, commit 80ae17a.
- [x] T4 — configKey/defaults decision: DONE, commit e622366. Removed both;
  @nuxt/kit defaults configKey to the module name (configKey ||= name), meta
  test updated to document that. Silent-ignore residual: setup() still ignores
  all user options — module reserves no documented options surface.
- [x] T5 — ClientOnly test: DONE, commit 5daa456. nuxt/test/clientonly.test.ts
  + fixtures/clientonly/; SSR half only (placeholder span, no chart markup);
  negative assertions proven non-vacuous by sensitivity check.
- [x] T6 — Final verification: DONE. Root: 65/65 + vue-tsc clean. Nuxt:
  12/12 + vue-tsc clean.
