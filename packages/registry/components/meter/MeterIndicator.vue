<script setup lang="ts">
import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { useMeterRootContext } from './context'
import { meterIndicatorVariants } from '.'

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

const meterCtx = useMeterRootContext()
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :class="cn(meterIndicatorVariants(), props.class)"
    :style="{
      width: meterCtx.percentage,
    }"
    :data-variant="meterCtx.variant"
    data-slot="meter-indicator"
  >
    <slot />
  </Primitive>
</template>
