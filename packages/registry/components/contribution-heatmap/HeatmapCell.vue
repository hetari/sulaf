<script setup lang="ts">
import type { HeatmapCellProps } from './types'
import { useHeatmapDataRootContext } from './context'
import { cn } from '@sulaf/ui/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@sulaf/ui/components/tooltip'
import { computed, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { refDebounced, useElementHover, useFocus } from '@vueuse/core'

const props = defineProps<
  HeatmapCellProps & {
    class?: HTMLAttributes['class']
  }
>()

const { onCellClick, palette } = useHeatmapDataRootContext()
const cellRef = ref<HTMLElement | null>(null)

const isHovered = useElementHover(cellRef)
const { focused } = useFocus(cellRef)
const rawActive = computed(() => isHovered.value || focused.value)

// Use debounced state to make it smoother and avoid flickering during fast navigation
const isActive = refDebounced(rawActive, 250)

const emit = defineEmits<{
  click: [cell: HeatmapCellProps['cell']]
}>()

function handleClick() {
  onCellClick?.(props.cell)
  emit('click', props.cell)
}
</script>

<template>
  <Tooltip as-child>
    <TooltipTrigger as-child>
      <div
        v-bind="$attrs"
        ref="cellRef"
        :data-level="cell.level"
        :data-date="cell.key"
        :data-row="cell.row"
        :data-col="cell.col"
        role="gridcell"
        tabindex="-1"
        :aria-label="`${cell.contributions} contributions on ${cell.dateLabel}`"
        :style="{
          animationDelay: `${(cell.row + cell.col) * 5}ms`,
          animationFillMode: 'both',
        }"
        :class="
          cn(
            'h-3.5 w-3.5 rounded-[3px] border border-border/50 sm:h-4 sm:w-4 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            palette[cell.level as 0 | 1 | 2 | 3 | 4],
            props.class,
          )
        "
        @click="handleClick"
        @keyup.enter="handleClick"
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
