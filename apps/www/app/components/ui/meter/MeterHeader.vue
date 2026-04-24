<script setup lang="ts">
import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { meterHeaderVariants } from '.'

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
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :class="cn(meterHeaderVariants(), props.class)"
    data-slot="meter-header"
  >
    <slot />
  </Primitive>
</template>
