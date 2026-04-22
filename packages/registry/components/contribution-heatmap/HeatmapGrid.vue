<script setup lang="ts">
import { useHeatmapDataRootContext } from './context'
import HeatmapCell from './HeatmapCell.vue'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { groupCellsByRow } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { cells, rows, cols } = useHeatmapDataRootContext()
const cellGrid = computed(() => groupCellsByRow(cells.value, rows.value))
</script>

<template>
  <div role="grid" :class="cn('flex flex-col gap-0.5 sm:gap-0.75', props.class)">
    <slot :cells="cells" :cell-grid="cellGrid" :rows="rows" :cols="cols" />
  </div>
</template>
