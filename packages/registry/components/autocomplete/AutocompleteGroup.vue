<script setup lang="ts">
import type { ComboboxGroupProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxGroup, useForwardProps } from 'reka-ui'
import { cn } from '@sulaf/ui/lib/utils'

const props = defineProps<
  ComboboxGroupProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxGroup
    v-bind="forwarded"
    :class="cn('overflow-hidden p-1 text-foreground', props.class)"
    data-slot="autocomplete-group"
  >
    <slot />
  </ComboboxGroup>
</template>
