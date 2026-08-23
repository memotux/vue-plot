export default defineNuxtConfig({
  extends: ["docus"],
  modules: ["@memotux/nuxt-vue-plot"],
  imports: {
    dirs: ["data"],
  },
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
