# Feature: issue close-out trio + nuxt config deferred items

## Context
Closes GitHub issues #9, #11, #12 and the two deferred items from Judgment Day
(Engram obs 631, `todo/nuxt-vue-plot`). Read-only exploration done 2026-09-21.

## Tasks
- [ ] T1 — Text VNode coverage for createText/setText (issue #9): new tests in
  `tests/` covering text VNodes rendered through Plot; run `pnpm test run`.
- [ ] T2 — Nuxt module test coverage (issue #11): extend `nuxt/test/` with
  module-level assertions (module options, isCustomElement chain, addComponent
  registration) beyond the existing SSR e2e test.
- [ ] T3 — Nuxt quick setup section in root README (issue #12).
- [ ] T4 — configKey/defaults decision: `nuxt/src/module.ts` uses
  `configKey: 'plot'` + `defaults: {}` which silently ignores user config.
  Decide: remove configKey or wire real defaults consumed in `setup()`.
- [ ] T5 — ClientOnly test: `nuxt/test/` test wrapping VPlot in `<ClientOnly>`
  (SSR emits nothing inside, client renders chart).
- [ ] T6 — Final verification: `pnpm test run`, nuxt workspace tests,
  `pnpm exec vue-tsc --noEmit`.

## Evidence
- (commits recorded here as tasks close)
