<script setup lang="ts">
import { CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
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
  <CardContent :class="cn('p-0', props.class)">
    <ScrollArea ref="scrollAreaRef" type="hover" class="w-full">
      <div class="p-6 w-max min-w-full">
        <slot :is-loading="isLoading" :is-error="isError" :cells="cells" />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </CardContent>
</template>
