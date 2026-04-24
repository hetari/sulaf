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
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <div class="flex items-center gap-2 px-2 py-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <span class="text-sm font-semibold">S</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold">Sulaf</span>
            <span class="text-xs text-muted-foreground">Playground</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in navItems" :key="item.label">
                <SidebarMenuButton :as="RouterLink" :to="item.to">
                  <span>{{ item.label }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div class="px-2 py-2 text-xs text-muted-foreground">
          © {{ new Date().getFullYear() }}
          Sulaf
        </div>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center justify-between px-4">
        <SidebarTrigger />
        <Button variant="ghost" size="icon" @click="toggleDark()" aria-label="Toggle dark mode">
          <Sun v-if="isDark" class="size-4" />
          <Moon v-else class="size-4" />
        </Button>
      </header>
      <main class="flex flex-1 items-center justify-center p-6">
        <RouterView />
      </main>
    </SidebarInset>
    <Toaster class="pointer-events-auto" position="top-center" />
  </SidebarProvider>
</template>
