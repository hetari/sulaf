<script setup lang="ts">
import { Button } from '@sulaf/ui/components/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@sulaf/ui/components/sidebar'
import { Toaster } from '@sulaf/ui/components/sonner'
import { Moon, Sun } from 'lucide-vue-next'
import { useTheme } from './composables/useDark'
import { RouterLink } from 'vue-router'

const { isDark, toggleDark } = useTheme()

const navItems = [
  { label: 'autocomplete', to: '/components/autocomplete' },
  { label: 'heatmap', to: '/components/heatmap' },
  { label: 'show-more', to: '/components/show-more' },
  { label: 'meter', to: '/components/meter' },
]
</script>

<template>
  <RouterView />
</template>
