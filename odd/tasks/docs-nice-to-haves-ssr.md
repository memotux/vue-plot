# Feature: docs nice-to-haves + SSR closeout

## Context
Combo approved 2026-09-21: docs nice-to-haves (Engram obs 635, items 1-4) and
GitHub issue #2 (SSR compatibility close-out). Docs-only changes; exploration
done by scout subagent with exact targets.

## Tasks
- [x] T1 — Bun tabs: DONE, commit 6d73345 (incl. prerequisites line + frontmatter
  description follow-up the worker flagged).
- [x] T2 — Decision table: DONE, commit ea60992 ("Choosing a pattern" section).
- [x] T3 — Multi-mark example: DONE, commit 75a6cf2 ("Complete example",
  VPlot + PlotFrame + PlotBarY + PlotDot, scatterData).
- [x] T4 — code-preview: SKIPPED by design, documented in Engram obs 635.
- [x] T5 — SSR note: DONE, commit 685f41b in 3.setup.md. Closes #2.
- [x] T6 — Verification: nuxt generate PASS (61 routes prerendered, no new
  MDC errors; rendered-HTML spot checks passed); root 65/65, nuxt 12/12.

## Evidence
- 6d73345 docs: add bun tabs to install code-groups and prerequisites
- ea60992 docs(guide): add marks-as-children vs marks-as-props decision table
- 75a6cf2 docs(api): add complete multi-mark chart example to mark components
- 685f41b docs: add server-side rendering guidance outside Nuxt (Closes #2)
