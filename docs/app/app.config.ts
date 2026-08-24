export default defineAppConfig({
  seo: {
    titleTemplate: '%s | Vue Plot',
    title: "Vue Plot",
    description:
      "Vue components for building data visualizations with Observable Plot. Declarative, reactive, and fully type-safe — works with Nuxt too.",
  },
  header: {
    title: "Vue Plot",
  },
  socials: {
    github: "https://github.com/memotux/vue-plot",
    npm: "https://www.npmjs.com/package/@memotux/vue-plot",
  },
  github: {
    url: "https://github.com/memotux/vue-plot",
    branch: "main",
    rootDir: "docs",
  },
  ui: {
    colors: {
      primary: "dragon-yellow",
      secondary: "dragon-blue-2",
      success: "spring-green",
      info: "dragon-blue",
      warning: "ronin-yellow",
      error: "samurai-red",
      neutral: "dragon-black-6",
    },
  },
});
