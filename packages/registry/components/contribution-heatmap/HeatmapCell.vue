<script setup lang="ts">
import type { HeatmapCellProps } from './types'
import { useHeatmapDataRootContext } from './context'
import { cn } from '@sulaf/ui/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@sulaf/ui/components/tooltip'
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { onKeyStroke } from '@vueuse/core'

const props = defineProps<
  HeatmapCellProps & {
    class?: HTMLAttributes['class']
  }
>()

const { onCellClick, rows, cols } = useHeatmapDataRootContext()
const cellRef = ref<HTMLElement | null>(null)

function handleClick() {
  onCellClick?.(props.cell)
}

// Keyboard navigation using VueUse
onKeyStroke(
  ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  e => {
    e.preventDefault()
    const { row, col } = props.cell
    let nextRow = row
    let nextCol = col

    if (e.key === 'ArrowUp') nextRow = Math.max(0, row - 1)
    else if (e.key === 'ArrowDown') nextRow = Math.min(rows.value - 1, row + 1)
    else if (e.key === 'ArrowLeft') nextCol = Math.max(0, col - 1)
    else if (e.key === 'ArrowRight') nextCol = Math.min(cols.value - 1, col + 1)

    // Using a more scoped selector to find the next cell within the same grid
    const parentGrid = cellRef.value?.closest('[role="grid"]')
    const nextCell = parentGrid?.querySelector<HTMLElement>(
      `[data-row="${nextRow}"][data-col="${nextCol}"]`,
    )
    nextCell?.focus()
  },
  { target: cellRef },
)
onKeyStroke(
  ['Enter', ' '],
  e => {
    e.preventDefault()
    handleClick()
  },
  { target: cellRef },
)
</script>

<template>
  <Tooltip v-if="cell">
    <TooltipTrigger as-child>
      <div
        ref="cellRef"
        :data-level="cell.level"
        :data-date="cell.key"
        :data-row="cell.row"
        :data-col="cell.col"
        role="gridcell"
        tabindex="0"
        :aria-label="`${cell.contributions} contributions on ${cell.dateLabel}`"
        @click="handleClick"
        :class="
          cn(
            'h-3.5 w-3.5 rounded-[2px] transition-all duration-200 ease-out sm:h-4 sm:w-4 cursor-pointer',
            'hover:scale-[1.05] hover:ring-1 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'bg-muted',
            // TODO: fix the colors
            `data-[level='1']:bg-[var(--heatmap-level-1,theme(colors.emerald.200))]`,
            `data-[level='2']:bg-[var(--heatmap-level-2,theme(colors.emerald.400))]`,
            `data-[level='3']:bg-[var(--heatmap-level-3,theme(colors.emerald.600))]`,
            `data-[level='4']:bg-[var(--heatmap-level-4,theme(colors.emerald.800))]`,
            // dark mode
            `dark:data-[level='1']:bg-[var(--heatmap-level-1,theme(colors.emerald.300))]`,
            `dark:data-[level='2']:bg-[var(--heatmap-level-2,theme(colors.emerald.500))]`,
            `dark:data-[level='3']:bg-[var(--heatmap-level-3,theme(colors.emerald.700))]`,
            `dark:data-[level='4']:bg-[var(--heatmap-level-4,theme(colors.emerald.900))]`,
            props.class,
          )
        "
      >
        <slot :cell="cell" />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <slot name="tooltip" :cell="cell">
        <div class="flex flex-col gap-1">
          <span class="font-medium">{{ cell.contributions }} contributions</span>
          <span class="text-[10px] text-muted-foreground">{{ cell.dateLabel }}</span>
        </div>
      </slot>
    </TooltipContent>
  </Tooltip>
</template>
