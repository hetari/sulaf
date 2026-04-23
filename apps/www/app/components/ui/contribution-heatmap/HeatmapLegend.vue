<script setup lang="ts">
import HeatmapCell from './HeatmapCell.vue'
import { useHeatmapDataRootContext } from './context'
import { computed, type HTMLAttributes } from 'vue'
import type { HeatmapLegendProps } from './types'
import { cn } from '@/lib/utils'
import { getLevels } from './utils'

const props = defineProps<
  HeatmapLegendProps & {
    class?: HTMLAttributes['class']
  }
>()

const { maxLevel, getContributionsForLevel } = useHeatmapDataRootContext()
const levels = computed(() => getLevels(maxLevel.value, getContributionsForLevel.value))
</script>

<template>
  <div
    :class="
      cn(
        'flex w-full items-center justify-between gap-3 text-xs text-muted-foreground',
        props.class,
      )
    "
  >
    <span v-if="label" class="hidden sm:inline">
      {{ label }}
    </span>
    <slot name="label" />

    <div class="ml-auto flex items-center gap-1.5">
      <slot name="before">
        <span class="mr-0.5 text-[10px]">Less</span>
      </slot>
      <div class="flex items-center gap-1">
        <HeatmapCell
          v-for="item in levels"
          :key="item.level"
          :cell="{
            level: item.level,
            contributions: item.contributions,
            key: `legend-${item.level}`,
            date: new Date(),
            dateLabel: `${item.contributions}+ contributions`,
            weekdayLabel: '',
            row: 0,
            col: 0,
          }"
          class="h-3 w-3 cursor-default sm:h-3.5 sm:w-3.5"
        >
          <template #tooltip>
            <span class="text-xs">{{ item.contributions }}+ contributions</span>
          </template>
        </HeatmapCell>
      </div>
      <slot name="after">
        <span class="ml-0.5 text-[10px]">More</span>
      </slot>
    </div>

    <slot />
  </div>
</template>
