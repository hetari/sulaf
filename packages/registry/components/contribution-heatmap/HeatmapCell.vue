<script setup lang="ts">
import type { HeatmapCellProps } from './types'
import { useHeatmapDataRootContext } from './context'
import { cn } from '@sulaf/ui/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@sulaf/ui/components/tooltip'
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { refDebounced, useElementHover, useFocus } from '@vueuse/core'

const props = defineProps<
  HeatmapCellProps & {
    class?: HTMLAttributes['class']
  }
>()

const { onCellClick } = useHeatmapDataRootContext()
const cellRef = ref<HTMLElement | null>(null)

const isHovered = useElementHover(cellRef)
const { focused } = useFocus(cellRef)
const rawActive = computed(() => isHovered.value || focused.value)

// Use debounced state to make it smoother and avoid flickering during fast navigation
const isActive = refDebounced(rawActive, 250)

function handleClick() {
  onCellClick?.(props.cell)
}
</script>

<template>
  <Tooltip as-child>
    <TooltipTrigger as-child>
      <!-- v-memo: skip re-rendering if level, activity, or class haven't changed -->
      <div
        ref="cellRef"
        v-memo="[cell.level, isActive]"
        :data-level="cell.level"
        :data-date="cell.key"
        :data-row="cell.row"
        :data-col="cell.col"
        role="gridcell"
        tabindex="-1"
        :aria-label="`${cell.contributions} contributions on ${cell.dateLabel}`"
        :class="
          cn(
            'h-3.5 w-3.5 rounded-[2px] transition-all duration-200 ease-out sm:h-4 sm:w-4 cursor-pointer',
            'hover:scale-[1.05] hover:ring-1 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            'bg-muted',
            `data-[level='1']:bg-[var(--heatmap-level-1,theme(colors.emerald.200))]`,
            `data-[level='2']:bg-[var(--heatmap-level-2,theme(colors.emerald.400))]`,
            `data-[level='3']:bg-[var(--heatmap-level-3,theme(colors.emerald.600))]`,
            `data-[level='4']:bg-[var(--heatmap-level-4,theme(colors.emerald.800))]`,
            `dark:data-[level='1']:bg-[var(--heatmap-level-1,theme(colors.emerald.300))]`,
            `dark:data-[level='2']:bg-[var(--heatmap-level-2,theme(colors.emerald.500))]`,
            `dark:data-[level='3']:bg-[var(--heatmap-level-3,theme(colors.emerald.700))]`,
            `dark:data-[level='4']:bg-[var(--heatmap-level-4,theme(colors.emerald.900))]`,
            props.class,
          )
        "
        @click="handleClick"
      >
        <slot :cell="cell" />
      </div>
    </TooltipTrigger>

    <!-- v-if: lazily mount the tooltip portal only while the cell is active -->
    <TooltipContent v-if="isActive">
      <slot name="tooltip" :cell="cell">
        <div class="flex flex-col gap-1">
          <span class="font-medium">{{ cell.contributions }} contributions</span>
          <span class="text-[10px] text-muted-foreground">{{ cell.dateLabel }}</span>
        </div>
      </slot>
    </TooltipContent>
  </Tooltip>
</template>
