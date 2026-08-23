# AGENTS.md

> Context for AI coding agents working in this repo. Keep it in sync with reality. If you change architecture, commands, or standards, update this file.

## Project

`@memotux/vue-plot` — a Vue 3 component library that wraps [Observable Plot](https://observablehq.com/plot/) through a **custom Vue renderer**. Declarative `<PlotXxx>` components are compiled into Observable Plot marks. It is the same pattern TresJS uses to expose a 3D engine as Vue components.

## Stack

- Vue `^3.5`, TypeScript in strict mode (`noUnusedLocals`, `noUnusedParameters`)
- Vite 8 library mode (Rolldown)
- `@observablehq/plot` (`^0.6.17`) — peer dependency, the actual plotting engine
- pnpm workspaces: root library (`.`), Nuxt module (`nuxt/`), docs (`docs/`)
  - The `docs/` workspace has its own operating rules in [`docs/AGENTS.md`](docs/AGENTS.md).

## Setup & commands

```bash
pnpm install          # install deps (CI uses --frozen-lockfile)
pnpm test             # run vitest in watch mode (also "pnpm dev")
pnpm test run         # run tests once (what CI runs)
pnpm exec vue-tsc --noEmit   # type check (strict)
pnpm build            # build the library to dist/
pnpm nuxt <script>    # run scripts in the @memotux/nuxt-vue-plot workspace
pnpm --filter vue-plot-docs dev   # run the documentation site locally (Docus / Nuxt 4)
```

## Architecture (read before touching `src/core/`)

The library does **not** render SVG directly. It builds a custom Vue renderer that maps Vue's virtual DOM to Observable Plot marks.

- `src/core/context.ts` — `createPlotApp()` singleton, renderer creation, per-plot `PlotContext`
- `src/core/nodeOps.ts` — custom node operations (`createElement` / `insert` / `patchProp` / `remove`) that drive `Plot.plot()`
- `src/components/Plot.vue` — main component, uses `useTemplateRef` + the custom renderer
- `src/types/index.d.ts` — type mapping from Observable Plot marks to Vue components

**Batching (important):** `patchProp` and `remove` set a `_renderQueued` flag and flush via `nextTick`. Do **not** call `Plot.plot()` synchronously on every prop change — multiple reactive updates in one tick must coalesce into a single render.

## Coding Standards

Follow the project's agent skills instead of improvising style — load them before any Vue/TS work:

- `.agents/skills/vue-best-practices/SKILL.md` — Vue 3 Composition API is the standard
- `.agents/skills/vue/SKILL.md` — `<script setup>` macros, reactivity, built-in components
- `.agents/skills/vue-testing-best-practices/SKILL.md` — component testing patterns
- `.agents/skills/vitest/SKILL.md` — test runner behavior
- `.agents/skills/antfu/SKILL.md` — TS / file-organization conventions

Hard rules that must not be broken in this repo:

- **Composition API only**: `<script setup lang="ts">`. Never Options API.
- **TS strict is the lint**: `strict`, `noUnusedLocals`, `noUnusedParameters` are on. Do not weaken `tsconfig` to make code compile.
- No ESLint/Prettier configured — do **not** add them without asking.
- `Plot*` tags are custom elements (`isCustomElement`) — never import/register them as components.
- The build externalizes `vue` and `@observablehq/plot` — never bundle them.
- Conventional Commits (drives releases via `changelogen`).

## Code Review Rules

### TypeScript

- `const` / `let` only — never `var`.
- No `any`. Use proper types or `unknown` + narrowing.
- Prefer `interface` for object/prop shapes; `type` for unions, mapped, and utility types.
- Don't widen types to satisfy the compiler (cast chains, `as any`).

### Vue

- Composition API only: `<script setup lang="ts">`.
- `Plot*` tags are custom elements — do not treat them as unknown components or register them.
- Props down / events up; `v-model` only for true two-way contracts.
- Keep source state minimal; derive with `computed`.
- Full checklist: see `.agents/skills/vue-best-practices` and `.agents/skills/vue`.

### Tests & CI

- Vitest globals enabled — do not import `describe` / `it` / `expect`.
- New behavior needs a test in `tests/`; reuse `tests/basic.ts` helpers.
- `pnpm exec vue-tsc --noEmit` must pass; CI runs `pnpm test run` on push to `main`.

## Testing

- Vitest, **globals enabled** (do not import `describe`/`it`/`expect`), `happy-dom` environment.
- Tests live in `tests/`; prefer the shared `tests/basic.ts` helpers.
- Renderer timing: use `await nextTick()` / `flushPromises()` around render assertions.
- CI: GitHub Actions runs `pnpm test run` on push to `main` (Node 22, corepack).

## Contribution workflow

- PRs must link an **approved** issue; branch name `^(feat|fix|chore|docs|...)/[a-z0-9._-]+$`.
- One deliverable per PR. Keep tests with the code they verify and docs with the user-visible change.
- **Never run `git push` or `git push --tags` without explicit confirmation.**

## Releasing

`pnpm release` builds, runs `changelogen --release`, publishes, and pushes tags. Use only if user explicit ask for it and when intentionally cutting a version.
