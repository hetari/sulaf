<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

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
  <Primitive v-bind="forwarded" role="row" :class="cn('flex gap-0.5 sm:gap-0.75', props.class)">
    <slot />
  </Primitive>
</template>
