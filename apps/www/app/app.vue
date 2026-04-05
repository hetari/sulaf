<script setup lang="ts">
import { ConfigProvider, TooltipProvider } from 'reka-ui'
import { siteConfig } from '~/lib/siteConfig'

const projectName = 'Sulaf'
const title = `${projectName} - shadcn-vue registry`
const description = `Discover beautiful, accessible, and customizable Vue components built with shadcn-vue. Build modern and stunning applications with ease using Sulaf.`

useHead({
  title,
  titleTemplate: `%s | ${projectName}`,
  meta: [
    // Basic SEO
    {
      name: 'description',
      content: description,
    },
    {
      name: 'keywords',
      content: `vue, vuejs, shadcn-vue, ui components, vue components, tailwindcss, accessible components, vue ui library, ${projectName.toLowerCase()}, ${projectName.toLowerCase()}`,
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
    // { property: 'og:image', content: siteConfig.ogImage },
    {
      property: 'og:image:alt',
      content: `${projectName} Components Preview`,
    },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: `${projectName}` },
    { property: 'og:locale', content: 'en_US' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: siteConfig.url },
    {
      name: 'twitter:title',
      content: `${projectName} - Beautiful Vue Components Built for shadcn-vue`,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    // { name: 'twitter:image', content: siteConfig.ogImage },
    { name: 'twitter:image:alt', content: `${projectName} Components Preview` },
    { name: 'twitter:site', content: `@${projectName.toLowerCase()}ui` },
    { name: 'twitter:creator', content: `@${projectName.toLowerCase()}ui` },

    // Additional SEO & Mobile
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: `${projectName}` },
    { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#0a0a0a', media: '(prefers-color-scheme: dark)' },

    // Canonical URL (as meta)
    { name: 'canonical', content: siteConfig.url },

    // Additional Open Graph
    { property: 'og:email', content: `hello@${projectName.toLowerCase()}-ui.com` },
    { property: 'og:phone_number', content: '' },
    { property: 'og:country-name', content: 'USA' },
  ],
  link: [
    { rel: 'canonical', href: siteConfig.url },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-touch-icon-57x57.png' },
    { rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-touch-icon-72x72.png' },
    { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-touch-icon-76x76.png' },
    { rel: 'apple-touch-icon', sizes: '114x114', href: '/apple-touch-icon-114x114.png' },
    { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-touch-icon-120x120.png' },
    { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-touch-icon-144x144.png' },
    { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-touch-icon-152x152.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' },
  ],
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr',
  },
})

defineOgImage('Custom.takumi', {
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
