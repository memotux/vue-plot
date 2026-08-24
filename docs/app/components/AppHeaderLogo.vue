<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <AppIcon :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
    :class="['h-14 w-auto shrink-0', appConfig.header?.logo?.class]" />
  <span class="text-2xl">
    {{ appConfig.header?.title || '{appConfig.header.title}' }}
  </span>
</template>
