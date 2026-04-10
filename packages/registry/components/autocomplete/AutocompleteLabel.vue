<script setup lang="ts">
import type { ComboboxLabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxLabel, useForwardProps } from 'reka-ui'
import { cn } from '@sulaf/ui/lib/utils'

const props = defineProps<
  ComboboxLabelProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxLabel
    v-bind="forwarded"
    :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', props.class)"
  >
    <slot />
  </ComboboxLabel>
</template>
