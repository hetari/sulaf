<script setup lang="ts">
import { showMcpDocs } from '~/lib/flag'
import {
  NAV_SECTIONS,
  SIDEBAR_EXCLUDED_PAGES,
  SIDEBAR_EXCLUDED_SECTIONS,
  type SidebarNavigationItem,
} from '~/lib/navigation'

const props = defineProps<{
  tree: SidebarNavigationItem
}>()

const { path } = toRefs(useRoute())

const filteredSections = computed(() =>
  NAV_SECTIONS.filter(section => showMcpDocs || !section.href.includes('/mcp')),
)

const rootPages = computed(() => {
  const res: SidebarNavigationItem[] = []
  filteredSections.value.forEach(section => {
    const treeItem = (props.tree.children || []).find(item => item.path === section.href)
    res.push({
      path: section.href,
      ...treeItem,
      title: section.name,
    })
  })
  return res
})

const folderGroups = computed(() => {
  return (props.tree.children || []).filter(
    (item: SidebarNavigationItem) =>
      (item.children || item.soon) &&
      !SIDEBAR_EXCLUDED_SECTIONS.includes(item.title.toLocaleLowerCase()),
  )
})

function isActive(href: string) {
  return href === '/docs' ? path.value === href : path.value.startsWith(href)
}
</script>

<template>
  <Sidebar
    class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] bg-transparent lg:flex"
    collapsible="none"
  >
    <SidebarContent class="no-scrollbar overflow-x-hidden px-2">
      <div
        class="sticky -top-1 z-10 h-8 shrink-0 bg-linear-to-b from-background via-background/80 to-background/50 blur-xs"
      />

      <!-- Sections (Root Pages natively ordered by Nuxt Content) -->
      <SidebarGroup v-if="rootPages.length > 0">
        <SidebarGroupLabel class="font-medium text-muted-foreground"> Sections </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in rootPages" :key="item.path">
              <SidebarMenuButton
                as-child
                :is-active="item.path === path"
                class="relative h-7.5 w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent"
              >
                <NuxtLink :to="item.path" prefetch-on="interaction">
                  <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                  <LucideIcon
                    v-if="item.navigation?.icon"
                    :name="item.navigation.icon"
                    class="mr-2 size-4 shrink-0"
                  />
                  {{ item.title }}
                  <Badge
                    v-if="item.new"
                    variant="outline"
                    class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none border-green-600 dark:border-green-500 bg-green-600/10 dark:bg-green-500/10 text-green-600 dark:text-green-500"
                  >
                    New
                  </Badge>
                  <Badge
                    v-else-if="item.beta"
                    variant="outline"
                    class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none border-amber-500 dark:border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 text-amber-500 dark:text-amber-500"
                  >
                    Beta
                  </Badge>
                  <Badge
                    v-else-if="item.soon"
                    variant="outline"
                    class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none"
                    >Soon</Badge
                  >
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Folder Groups -->
      <SidebarGroup v-for="group in folderGroups" :key="group.title">
        <SidebarGroupLabel class="flex items-center gap-2 font-medium text-muted-foreground">
          {{ group.title }}
          <Badge v-if="group.soon" variant="outline" class="h-4 px-1.5 text-[0.65rem] leading-none"
            >Soon</Badge
          >
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="gap-0.5">
            <template
              v-for="childItem in (group.children || []).filter(
                (child: SidebarNavigationItem) =>
                  !child.hide && !SIDEBAR_EXCLUDED_PAGES.includes(child.path),
              )"
              :key="childItem.path"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="childItem?.path === path"
                  class="relative h-7.5 w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent"
                >
                  <NuxtLink :to="childItem?.path" prefetch-on="interaction">
                    <span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent" />
                    <LucideIcon
                      v-if="childItem.navigation?.icon"
                      :name="childItem.navigation.icon"
                      class="mr-2 size-4 shrink-0"
                    />
                    {{ childItem.title }}
                    <Badge
                      v-if="childItem.new"
                      variant="outline"
                      class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none border-green-600 dark:border-green-500 bg-green-600/10 dark:bg-green-500/10 text-green-600 dark:text-green-500"
                    >
                      New
                    </Badge>
                    <Badge
                      v-else-if="childItem.beta"
                      variant="outline"
                      class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none border-amber-500 dark:border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 text-amber-500 dark:text-amber-500"
                    >
                      Beta
                    </Badge>
                    <Badge
                      v-else-if="childItem.soon"
                      variant="outline"
                      class="ms-auto h-4 px-1.5 text-[0.65rem] leading-none"
                      >Soon</Badge
                    >
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div
        class="sticky -bottom-1 z-10 h-16 shrink-0 bg-linear-to-t from-background via-background/80 to-background/50 blur-xs"
      />
    </SidebarContent>
  </Sidebar>
</template>
