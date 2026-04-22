<script setup lang="ts">
import { useHeatmapDataRootContext } from './context'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { getMonthMarkers } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { cells, cols } = useHeatmapDataRootContext()
const monthMarkers = computed(() => getMonthMarkers(cells.value, cols.value))
</script>

<template>
  <div :class="cn('mb-2 flex items-end', props.class)">
    <div class="w-8 shrink-0 sm:w-10" />
    <div class="flex gap-0.5 sm:gap-0.75">
      <div v-for="(label, i) in monthMarkers" :key="i" class="relative h-3.5 w-3.5 sm:h-4 sm:w-4">
        <span
          v-if="label"
          aria-hidden="true"
          class="absolute left-0 top-0 whitespace-nowrap text-[9px] leading-none text-muted-foreground sm:text-[10px]"
        >
          {{ label }}
        </span>
      </div>
    </div>
  </div>
</template>
