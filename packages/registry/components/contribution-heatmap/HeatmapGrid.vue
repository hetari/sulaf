<script setup lang="ts">
import { useHeatmapDataRootContext } from './context'
import { computed, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { groupCellsByRow } from './utils'
import { useEventListener, unrefElement } from '@vueuse/core'
import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    as: 'div',
  },
)

const forwarded = useForwardProps(props)

const { cells, rows, cols } = useHeatmapDataRootContext()
const cellGrid = computed(() => groupCellsByRow(cells.value, rows.value))
const gridRef = useTemplateRef<HTMLElement | null>('gridRef')

// Cache for cell elements to ensure O(1) lookup during keyboard navigation
const cellCache = new Map<string, HTMLElement>()

const rebuildCellCache = () => {
  const el = unrefElement(gridRef)
  if (!el) return

  cellCache.clear()
  const cellElements = el.querySelectorAll('[role="gridcell"]')
  cellElements.forEach((element, idx) => {
    const cellEl = element as HTMLElement
    const r = cellEl.dataset.row
    const c = cellEl.dataset.col
    if (r !== undefined && c !== undefined) {
      cellCache.set(`${r}-${c}`, cellEl)
    }
    // Only the first cell is focusable via Tab by default
    cellEl.tabIndex = idx === 0 ? 0 : -1
  })
}

onMounted(rebuildCellCache)

// Rebuild cache when cells change (e.g. data loaded asynchronously)
watch(
  cells,
  () => {
    rebuildCellCache()
  },
  { flush: 'post' },
)

onUnmounted(() => {
  cellCache.clear()
})

// Event delegation for keyboard navigation
useEventListener(gridRef, 'keydown', e => {
  if (
    !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) ||
    !(e.target instanceof HTMLElement) ||
    !e.target.matches('[role="gridcell"]')
  ) {
    return
  }

  e.preventDefault()
  const currentCell = e.target
  const row = parseInt(currentCell.dataset.row || '0', 10)
  const col = parseInt(currentCell.dataset.col || '0', 10)

  let nextRow = row
  let nextCol = col

  if (e.key === 'ArrowUp') nextRow = Math.max(0, row - 1)
  else if (e.key === 'ArrowDown') nextRow = Math.min(rows.value - 1, row + 1)
  else if (e.key === 'ArrowLeft') nextCol = Math.max(0, col - 1)
  else if (e.key === 'ArrowRight') nextCol = Math.min(cols.value - 1, col + 1)

  const nextCell = cellCache.get(`${nextRow}-${nextCol}`)
  if (nextCell && nextCell !== currentCell) {
    // Roving tabindex: previous cell becomes unfocusable, next cell becomes focusable
    currentCell.tabIndex = -1
    nextCell.tabIndex = 0
    nextCell.focus()
  }
})
</script>

<template>
  <Primitive
    ref="gridRef"
    v-bind="forwarded"
    role="grid"
    :class="cn('col-start-2 flex flex-col gap-0.5 sm:gap-0.75', props.class)"
  >
    <slot :cells="cells" :cell-grid="cellGrid" :rows="rows" :cols="cols" />
  </Primitive>
</template>
