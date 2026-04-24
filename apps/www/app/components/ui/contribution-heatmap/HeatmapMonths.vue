<script setup lang="ts">
import { useHeatmapDataRootContext } from './context'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { getMonthMarkers } from './utils'
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

const { cells, cols } = useHeatmapDataRootContext()
const monthMarkers = computed(() => getMonthMarkers(cells.value, cols.value))
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :class="cn('col-start-2 mb-2 grid text-[10px] text-muted-foreground', props.class)"
    :style="{
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
    }"
  >
    <div
      v-for="(label, i) in monthMarkers"
      :key="i"
      :style="{
        gridColumnStart: i + 1,
      }"
      class="relative"
    >
      <span v-if="label" aria-hidden="true" class="absolute left-0 bottom-0 whitespace-nowrap">
        {{ label }}
      </span>
    </div>
  </Primitive>
</template>
