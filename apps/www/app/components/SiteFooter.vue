<script setup lang="ts">
import { siteConfig } from '~/lib/siteConfig'
</script>
<template>
  <footer
    class="group-has-[.section-soft]/body:bg-surface/40 dark:bg-transparent 3xl:fixed:bg-transparent"
  >
    <div class="container-wrapper px-4 xl:px-6">
      <div class="flex h-(--footer-height) items-center justify-between">
        <div class="w-full text-center text-xs/loose text-muted-foreground sm:text-sm">
          <span>
            &copy; {{ new Date().getFullYear() }} - Built with
            <a
              href="https://shadcn-vue.com"
              target="_blank"
              rel="noopener noreferrer"
              class="underline underline-offset-4"
              >shadcn-vue</a
            >
            . The source code is available on
            <a
              :href="siteConfig.links.github"
              target="_blank"
              rel="noopener noreferrer"
              class="underline underline-offset-4"
              >GitHub</a
            >.
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
