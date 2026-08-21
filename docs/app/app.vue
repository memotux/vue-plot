<script setup lang="ts">
import type { ContentNavigationItem, PageCollections } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'

const { seo } = useAppConfig()
useDocusShortcuts()
const site = useSiteConfig()
const { locale, locales, isEnabled, switchLocalePath } = useDocusI18n()
const { isEnabled: isAssistantEnabled } = useAssistant()
const colorMode = useColorMode()

const nuxtUiLocale = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)
const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')
const iconTheme = computed(() => colorMode.value !== 'light' ? { dir: 'dark', color: '#393833' } : { dir: 'light', color: '#fffbe8' })

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: iconTheme.value.color },
    { name: 'msapplication-TileImage', content: `/icons/${iconTheme.value.dir}/ms-icon-144x144.png` },
    { name: 'msapplication-TileColor', content: iconTheme.value.color }
  ],
  link: [
    { rel: 'icon', type: 'image/icon', href: `/icons/${iconTheme.value.dir}/favicon.ico` },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '128x128',
      href: `/icons/${iconTheme.value.dir}/favicon-128x128.png`
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: `/icons/${iconTheme.value.dir}/favicon-96x96.png`
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: `/icons/${iconTheme.value.dir}/favicon-32x32.png`
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: `/icons/${iconTheme.value.dir}/favicon-16x16.png`
    },
    { rel: 'mask-icon', href: `/icons/${iconTheme.value.dir}/safari-pinned-tab.svg`, color: iconTheme.value.color },
    {
      rel: 'apple-touch-icon',
      sizes: '152x152',
      href: `/icons/${iconTheme.value.dir}/apple-icon-152x152.png`
    },
    {
      rel: 'apple-touch-icon',
      sizes: '167x167',
      href: `/icons/${iconTheme.value.dir}/apple-icon-167x167.png`
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: `/icons/${iconTheme.value.dir}/apple-icon-180x180.png`
    },
    { rel: 'apple-touch-icon', href: `/icons/${iconTheme.value.dir}/apple-icon-120x120.png` }
  ],
  htmlAttrs: {
    lang,
    dir,
  },
})

useSeoMeta({
  titleTemplate: seo.titleTemplate,
  title: seo.title,
  description: seo.description,
  ogSiteName: site.name,
  twitterCard: 'summary_large_image',
})

if (isEnabled.value) {
  const route = useRoute()
  const defaultLocale = useRuntimeConfig().public.i18n.defaultLocale!
  onMounted(() => {
    const currentLocale = route.path.split('/')[1]
    if (!locales.some(locale => locale.code === currentLocale)) {
      return navigateTo(switchLocalePath(defaultLocale) as string)
    }
  })
}

const { data: navigation } = await useAsyncData(() => `navigation_${collectionName.value}`, () => queryCollectionNavigation(collectionName.value as keyof PageCollections), {
  transform: (data: ContentNavigationItem[]) => transformNavigation(data, isEnabled.value, locale.value),
  watch: [locale],
})

provide('navigation', navigation)

const { subNavigationMode } = useSubNavigation(navigation)
</script>

<template>
  <UApp :locale="nuxtUiLocale">
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <div class="flex">
      <div class="flex-1 min-w-0" :class="{ 'docus-sub-header': subNavigationMode === 'header' }">
        <AppHeader v-if="$route.meta.header !== false" />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
        <AppFooter v-if="$route.meta.footer !== false" />

        <ClientOnly>
          <AppSearch :navigation="navigation" />
          <LazyAssistantFloatingInput v-if="isAssistantEnabled" />
        </ClientOnly>
      </div>

      <ClientOnly v-if="isAssistantEnabled">
        <LazyAssistantPanel />
      </ClientOnly>
    </div>
  </UApp>
</template>

<style>
@media (min-width: 1024px) {
  .docus-sub-header {
    /* 64px base header + 48px sub-navigation bar */
    --ui-header-height: 112px;
  }
}
</style>
