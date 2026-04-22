<script setup lang="ts">
import { useHeatmapDataRootContext } from './context'
import { computed, type HTMLAttributes } from 'vue'
import type { HeatmapLegendProps } from './types'
import { cn } from '@sulaf/ui/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@sulaf/ui/components/tooltip'
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
        <Tooltip v-for="item in levels" :key="item.level">
          <TooltipTrigger as-child>
            <div
              :class="
                cn(
                  'h-3 w-3 rounded-[2px] sm:h-3.5 sm:w-3.5',
                  'bg-muted',
                  `data-[level='1']:bg-[var(--heatmap-level-1,theme(colors.emerald.200))]`,
                  `data-[level='2']:bg-[var(--heatmap-level-2,theme(colors.emerald.400))]`,
                  `data-[level='3']:bg-[var(--heatmap-level-3,theme(colors.emerald.600))]`,
                  `data-[level='4']:bg-[var(--heatmap-level-4,theme(colors.emerald.800))]`,
                )
              "
              :data-level="item.level"
            />
          </TooltipTrigger>
          <TooltipContent>
            <span class="text-xs">{{ item.contributions }}+ contributions</span>
          </TooltipContent>
        </Tooltip>
      </div>
      <slot name="after">
        <span class="ml-0.5 text-[10px]">More</span>
      </slot>
    </div>

    <slot />
  </div>
</template>
