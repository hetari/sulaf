<script setup lang="ts">
import type { MeterProps } from './types'
import type { HTMLAttributes } from 'vue'
import { provideMeterRootContext } from './context'
import { Primitive } from 'reka-ui'
import { meterVariants } from '.'
import { cn } from '@sulaf/ui/lib/utils'
import { computed, toRefs } from 'vue'

const props = withDefaults(
  defineProps<
    MeterProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    variant: 'default',
    size: 'default',
    min: 0,
    max: 100,
    value: 0,
  },
)

const meterId = computed(() => `meter-${Math.random().toString(36).slice(2, 9)}`)

const percentage = computed<`${number}%`>(() => {
  const min = props.min
  const max = props.max
  const value = props.value

  if (value == null) return '0%'
  const range = max - min
  if (range <= 0) return '0%'

  const clampedValue = Math.min(Math.max(value, min), max)
  const result = Math.round(((clampedValue - min) / range) * 100)
  return `${result}%`
})

provideMeterRootContext({
  ...toRefs(props),
  percentage,
  meterId,
})
</script>

<template>
  <Primitive
    v-bind="$attrs"
    :id="meterId"
    data-slot="meter"
    :class="cn(meterVariants(), props.class)"
    role="meter"
    :aria-valuenow="props.value"
    :aria-valuemin="props.min"
    :aria-valuemax="props.max"
    :aria-valuetext="percentage"
    :aria-label="props.label"
    :data-variant="props.variant"
    :data-size="props.size"
    :data-value="props.value"
    :data-max="props.max"
    :data-min="props.min"
    :data-percentage="percentage"
  >
    <slot />
  </Primitive>
</template>
