export default defineNuxtConfig({
  extends: ["docus"],
  routeRules: {
    "/getting-started": { prerender: true },
    "/guide": { prerender: true },
    "/api": { prerender: true },
  },
  mdc: {
    highlight: {
      theme: { dark: 'kanagawa-dragon', light: 'kanagawa-lotus' },
    }
  }
});
