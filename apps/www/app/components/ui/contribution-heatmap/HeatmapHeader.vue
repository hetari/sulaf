<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useHeatmapDataRootContext } from './context'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { id, totalContributions } = useHeatmapDataRootContext()
</script>

<template>
  <CardHeader
    :id="id"
    :class="cn('flex flex-col sm:flex-row sm:items-center sm:justify-between', props.class)"
  >
    <slot :total-contributions="totalContributions" />
  </CardHeader>
</template>
