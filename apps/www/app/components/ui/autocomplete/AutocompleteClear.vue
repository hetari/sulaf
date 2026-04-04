<script setup lang="ts">
import type { ComboboxCancelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxCancel, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { X } from 'lucide-vue-next'
import { useAutocompleteContext } from './context'

const props = defineProps<
  ComboboxCancelProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)

const { searchTerm } = useAutocompleteContext()

function handleClear() {
  searchTerm.value = ''
}
</script>

<template>
  <ComboboxCancel
    v-bind="forwarded"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-sm',
        'text-muted-foreground hover:text-foreground',
        'outline-none cursor-pointer transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring',
        props.class,
      )
    "
    @click="handleClear"
  >
    <slot>
      <X class="size-4" />
    </slot>
  </ComboboxCancel>
</template>
