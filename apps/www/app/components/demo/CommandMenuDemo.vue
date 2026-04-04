<script setup lang="ts">
const tree = {
  title: 'Docs',
  path: '/docs',
  children: [
    {
      title: 'Getting Started',
      path: '/docs',
      type: 'group' as const,
      children: [
        {
          title: 'Introduction',
          path: '/docs/introduction',
          type: 'page' as const,
        },
        {
          title: 'Installation',
          path: '/docs/installation',
          type: 'page' as const,
        },
      ],
    },
  ],
}

const navItems = [{ href: '/docs', name: 'Docs' }]
</script>

<template>
  <CommandMenu :tree="tree" :nav-items="navItems" />
</template>
