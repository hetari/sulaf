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
</script>

<template>
  <div
    :class="cn(meterIndicatorVariants(), props.class)"
    :style="{
      width: meterCtx.percentage,
    }"
    :data-variant="meterCtx.variant"
    data-slot="meter-indicator"
  >
    <slot />
  </div>
</template>
