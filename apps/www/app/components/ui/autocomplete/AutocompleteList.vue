<script setup lang="ts">
import type { ComboboxViewportProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { useForwardProps } from 'reka-ui'
import { ComboboxViewport } from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

const props = defineProps<
  ComboboxViewportProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxViewport v-bind="forwarded" :class="cn(props.class)">
    <slot />
  </ComboboxViewport>
</template>
