<script setup lang="ts">
import { CardContent } from '@sulaf/ui/components/card'
import { ScrollArea, ScrollBar } from '@sulaf/ui/components/scroll-area'
import { cn } from '@sulaf/ui/lib/utils'
import type { HTMLAttributes } from 'vue'
import { useHeatmapDataRootContext } from './context'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { isLoading, isError, cells } = useHeatmapDataRootContext()
</script>

<template>
  <CardContent :class="cn(props.class)">
    <ScrollArea>
      <slot :is-loading="isLoading" :is-error="isError" :cells="cells" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </CardContent>
</template>
