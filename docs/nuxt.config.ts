export default defineNuxtConfig({
  extends: ["docus"],
  routeRules: {
    "/getting-started": { prerender: true },
    "/guide": { prerender: true },
    "/api": { prerender: true },
  },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'theme-color', name: 'theme-color', content: '#c4b28a' },
        { name: 'msapplication-TileImage', content: '/icons/dark/ms-icon-144x144.png' },
        { name: 'msapplication-TileColor', content: '#c4b28a' }
      ],
      link: [
        { rel: 'icon', type: 'image/icon', href: '/icons/dark/favicon.ico' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '128x128',
          href: '/icons/dark/favicon-128x128.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/icons/dark/favicon-96x96.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/icons/dark/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/icons/dark/favicon-16x16.png'
        },
        { rel: 'mask-icon', href: '/icons/dark/safari-pinned-tab.svg', color: '#c4b28a' },
        {
          rel: 'apple-touch-icon',
          sizes: '152x152',
          href: '/icons/dark/apple-icon-152x152.png'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '167x167',
          href: '/icons/dark/apple-icon-167x167.png'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/icons/dark/apple-icon-180x180.png'
        },
        { rel: 'apple-touch-icon', href: '/icons/dark/apple-icon-120x120.png' }
      ],
    }
  }
});
