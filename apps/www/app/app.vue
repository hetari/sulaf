<script setup lang="ts">
import { ConfigProvider, TooltipProvider } from 'reka-ui'
import { siteConfig } from '~/lib/siteConfig'

const projectName = 'Sulaf UI'
const title = `${projectName} - Beautiful Vue Components Built for shadcn-vue`
const description = `Beautiful, accessible Vue components built for shadcn-vue. Copy, paste, and customize to create stunning applications with ease. A modern component library for Vue.js developers.`

useHead({
  title,
  titleTemplate: '%s | Sulaf UI',
  meta: [
    // Basic SEO
    {
      name: 'description',
      content: description,
    },
    {
      name: 'keywords',
      content:
        'vue, vuejs, shadcn-vue, ui components, vue components, tailwindcss, accessible components, vue ui library, sulaf, sulaf ui',
    },
    { name: 'author', content: 'Ebraheem Alhetrai' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'googlebot', content: 'index, follow' },

    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteConfig.url },
    { property: 'og:title', content: title },
    {
      property: 'og:description',
      content: description,
    },
    { property: 'og:image', content: siteConfig.ogImage },
    {
      property: 'og:image:alt',
      content: 'Sulaf UI Components Preview',
    },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: 'Sulaf UI' },
    { property: 'og:locale', content: 'en_US' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: siteConfig.url || 'https://sulaf-ui.com' },
    { name: 'twitter:title', content: 'Sulaf UI - Beautiful Vue Components Built for shadcn-vue' },
    {
      name: 'twitter:description',
      content: description,
    },
    { name: 'twitter:image', content: siteConfig.ogImage },
    { name: 'twitter:image:alt', content: 'Sulaf UI Components Preview' },
    { name: 'twitter:site', content: '@sulafui' },
    { name: 'twitter:creator', content: '@sulafui' },

    // Additional SEO & Mobile
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'Sulaf UI' },
    { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#0a0a0a', media: '(prefers-color-scheme: dark)' },

    // Canonical URL (as meta)
    { name: 'canonical', content: siteConfig.url || 'https://sulaf-ui.com' },

    // Additional Open Graph
    { property: 'og:email', content: 'hello@sulaf-ui.com' },
    { property: 'og:phone_number', content: '' },
    { property: 'og:country-name', content: 'USA' },
  ],
  link: [
    { rel: 'canonical', href: siteConfig.url || 'https://sulaf-ui.com' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  ],
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr',
  },
})

defineOgImage('Custom', {
  title,
  description,
})

const colorMode = useColorMode()

// Optional: Add analytics or tracking
// useAnalytics()
</script>

<template>
  <SiteBody>
    <ConfigProvider>
      <TooltipProvider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </TooltipProvider>
    </ConfigProvider>

    <ClientOnly>
      <Toaster
        class="pointer-events-auto"
        :theme="(colorMode.preference as any) || 'system'"
        position="top-center"
      />
    </ClientOnly>
  </SiteBody>
</template>
