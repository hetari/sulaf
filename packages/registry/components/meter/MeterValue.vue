<script setup lang="ts">
import { Primitive, useForwardProps, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { useMeterRootContext } from './context'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    as: 'span',
  },
)

const forwarded = useForwardProps(props)

const { percentage } = useMeterRootContext()
</script>

<template>
  <Primitive
    v-bind="forwarded"
    :class="cn('text-sm text-muted-foreground', props.class)"
    data-slot="meter-value"
    :data-value="percentage"
  >
    <slot>{{ percentage }}</slot>
  </Primitive>
</template>
