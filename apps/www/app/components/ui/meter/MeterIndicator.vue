<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useMeterRootContext } from './context'
import { meterIndicatorVariants } from '.'
import { computed } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const meterCtx = useMeterRootContext()
const indicatorClass = computed(() =>
  meterIndicatorVariants({
    variant: meterCtx.variant.value ?? 'default',
  }),
)
</script>

<template>
  <div
    :class="cn(indicatorClass, props.class)"
    :style="{
      width: meterCtx.percentage.value,
    }"
    :data-variant="meterCtx.variant.value"
    data-slot="meter-indicator"
  >
    <slot />
  </div>
</template>
