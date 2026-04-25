<script setup lang="ts">
import { useHeatmapDataRootContext } from './context'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
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
  <div
    v-bind="forwarded"
    :class="
      cn(
        'col-start-2 row-start-1 flex items gap-0.5 text-[10px] text-muted-foreground sm:gap-0.75',
        props.class,
      )
    "
  >
    <div v-for="(label, i) in monthMarkers" :key="i" class="relative w-full flex-1">
      <span v-if="label" aria-hidden="true" class="absolute left-0 bottom-0 whitespace-nowrap">
        {{ label }}
      </span>
    </div>
  </div>
</template>
