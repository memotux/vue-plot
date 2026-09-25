# Feature: closeout-followups

Resolves the deferred follow-ups from the issue-closeout-nuxt-deferred feature
(Engram obs 753, topic `todo/vue-plot-closeout-followups`), approved 2026-09-25.

Branch: `fix/closeout-followups` (off master, which is 14 commits ahead of origin).

## Tasks

- [x] T1 — `createText` honors Vue's text argument (root renderer) — commit 2407828
  - `src/core/nodeOps/renderer.ts`: `createText = (text = '') => document.createTextNode(text)`.
    Vue's runtime-core never calls `setText` on initial mount, so ignoring the
    arg loses initial content (latent bug). Attach behavior stays as-is
    (documented drop; each render `replaceChildren()` the container anyway).
  - Tests: `tests/textVNode.test.ts` — drop-behavior test kept; added unit test
    for the honored arg and `toHaveBeenCalledWith('Hello')` in the spy test.
    Root suite 66/66, vue-tsc clean.
- [x] T2 — isCustomElement `||` semantics (nuxt) — commit 94959b7
  - `nuxt/src/module.ts`: `prev?.(tag) ?? plotMatcher(tag)` → `prev?.(tag) || plotMatcher(tag)`.
    A strict-false previous hook no longer vetoes Plot tags; prev wins only
    with `true`. Veto test updated to assert the new semantics. Nuxt 12/12,
    vue-tsc clean.
- [x] T3 — setup() idempotency guard (nuxt) — commit c91da15
  - `nuxt/src/module.ts`: push `'@observablehq/plot'` into
    `optimizeDeps.include` only when not already present.
  - Test: bypass `_requiredModules` (reset it) and assert no duplicate push.
    Nuxt 13/13, vue-tsc clean.
- [x] T4 — Document "no module options" surface — commit ffe39e0
  - README Nuxt section: NOTE stating the module takes no configuration
    options; comment in `nuxt/src/module.ts` setup(). The docs page
    (`docs/content/2.guide/4.nuxt-integration.md`) already documented it.
- [x] T5 — ClientOnly client-hydration browser test (nuxt) — commit ee0d788
  - `nuxt/test/clientonly.browser.test.ts` using `@nuxt/test-utils/e2e`
    `createPage('/')` (navigates + waits for hydration). Added `playwright`
    devDep to nuxt workspace (chromium binaries already cached locally).
  - Lockfile churn: pnpm consolidated peer variants (-426 lines);
    `pnpm install --frozen-lockfile` at root passes — lockfile valid.
  - CI impact flagged at close.
- [x] T6 — Full verification
  - Root: `pnpm test run` 66/66 + `pnpm exec vue-tsc --noEmit` clean.
  - Nuxt: `pnpm nuxt test` 14/14 + `test:types` (vue-tsc + playground) clean.
  - CI note: root vitest excludes `**/nuxt/**`, so the new browser test does
    not run in CI and needs no chromium install there. If nuxt tests ever
    join CI, add `npx playwright install chromium` first.

## Decisions (user, 2026-09-25)

- Raw text scope: honor text arg only; keep dropping attach. XSS ruled out —
  Text nodes are never parsed as HTML; slot text never reaches Plot options.
- Veto: switch to `||` (prev hook can only add custom elements, never remove
  Plot tags).
- Module options: none — document explicitly.
- Hydration: add browser test despite new playwright dependency.

## Outcome

Complete on branch `fix/closeout-followups` (5 commits, not merged, not pushed):

- 2407828 fix(core): honor Vue's text argument in createText
- 94959b7 fix(nuxt): stop strict-false isCustomElement hooks from vetoing Plot tags
- c91da15 fix(nuxt): make optimizeDeps include push idempotent in setup
- ffe39e0 docs(nuxt): state explicitly that the module takes no options
- ee0d788 test(nuxt): cover ClientOnly client-side hydration with a browser test

Engram obs 753 fully resolved (spy-ordering item deliberately left as
documented behavior). Raw-text attach remains dropped by design; a future
feature could revisit rendering slot text as a Plot text mark.
