<script setup lang="ts">
import { useHeatmapDataRootContext } from './context'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { getWeekdayLabels } from './utils'
import type { HeatmapWeekdaysProps } from './types'
import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'

const props = withDefaults(
  defineProps<
    PrimitiveProps &
      HeatmapWeekdaysProps & {
        class?: HTMLAttributes['class']
      }
  >(),
  {
    showAll: false,
    as: 'div',
  },
)

const forwarded = useForwardProps(props)

const { rows } = useHeatmapDataRootContext()
const displayDays = computed(() => getWeekdayLabels(rows.value, props.showAll))
</script>

<template>
  <Primitive v-bind="forwarded" :class="cn('flex flex-col gap-0.5 pt-px sm:gap-0.75', props.class)">
    <span
      v-for="(day, i) in displayDays"
      :key="i"
      v-memo="[day]"
      aria-hidden="true"
      class="flex h-3.5 items-center justify-start pr-1 text-[9px] leading-none text-muted-foreground sm:h-4 sm:text-[10px]"
    >
      {{ day }}
    </span>
  </Primitive>
</template>
