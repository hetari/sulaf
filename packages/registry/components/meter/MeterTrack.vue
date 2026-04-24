<script setup lang="ts">
import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { useMeterRootContext } from './context'
import { meterTrackVariants } from '.'
import { computed } from 'vue'

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
const trackClass = computed(() =>
  meterTrackVariants({
    size: meterCtx.size ?? 'default',
  }),
)
</script>

<template>
  <Primitive v-bind="forwarded" :class="cn(trackClass, props.class)" data-slot="meter-track">
    <slot />
  </Primitive>
</template>
