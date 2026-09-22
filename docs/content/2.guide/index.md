---
title: Guide
navigation: false
description: >
  Learn Vue Plot's core patterns for building charts: define marks as
  template components or functional props, bind reactive data, and set up
  Nuxt integration.
seo:
  title: Vue Plot Guide — Marks, Reactive Data, and Nuxt
  description: Learn Vue Plot's core patterns — define marks as template components or functional props, bind reactive data, and integrate with Nuxt.
---

Patterns for building charts with Vue Plot. Here you will learn the two core ways to declare marks — as template children or as functional props — how to wire reactive data into your plots, and how to integrate everything with Nuxt.

## Choosing a pattern

Both patterns produce the same chart, so pick by how you want to declare marks.

| Aspect | Marks as Children | Marks as Props |
|--------|-------------------|----------------|
| Vite custom-element config | Required, unless you use the [Nuxt module](/guide/nuxt-integration) | Not required |
| How marks are declared | `<Plot*>` components as template children | A `marks` prop holding Observable Plot mark functions |
| Priority when both are provided | Child marks win | `marks` prop is ignored |

See [Marks as Children](/guide/marks-as-children) and [Marks as Props](/guide/marks-as-props) for complete examples.

## In this section

- [Marks as Children](/guide/marks-as-children) — Define marks as `<Plot*>` template components
- [Marks as Props](/guide/marks-as-props) — Pass Observable Plot mark functions as props
- [Reactive Data](/guide/reactive-data) — Update plots automatically as data changes
- [Nuxt Integration](/guide/nuxt-integration) — Set up the Nuxt module
