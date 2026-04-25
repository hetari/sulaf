<script setup lang="ts">
import { cn } from '@sulaf/ui/lib/utils'
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
  <Primitive
    v-bind="forwarded"
    :class="
      cn('grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-x-3 sm:gap-x-4 gap-y-2', props.class)
    "
  >
    <slot />
  </Primitive>
</template>
