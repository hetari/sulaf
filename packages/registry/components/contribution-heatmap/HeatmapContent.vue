<script setup lang="ts">
import { CardContent } from '@sulaf/ui/components/card'
import { ScrollArea, ScrollBar } from '@sulaf/ui/components/scroll-area'
import { cn } from '@sulaf/ui/lib/utils'
import { ref, onMounted } from 'vue'
import type { HTMLAttributes } from 'vue'
import { useHeatmapDataRootContext } from './context'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { isLoading, isError, cells } = useHeatmapDataRootContext()
const scrollAreaRef = ref<any>(null)

onMounted(() => {
  // Select the viewport element directly to remove it from tab order
  const el = scrollAreaRef.value?.$el as HTMLElement | undefined
  const viewport =
    el?.querySelector('[data-slot="scroll-area-viewport"]') ||
    el?.querySelector('[data-reka-scroll-area-viewport]')

  if (viewport instanceof HTMLElement) {
    viewport.tabIndex = -1
  }
})
</script>

<template>
  <CardContent :class="cn(props.class)">
    <ScrollArea ref="scrollAreaRef" type="glimpse" tabindex="-1">
      <slot :is-loading="isLoading" :is-error="isError" :cells="cells" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </CardContent>
</template>
