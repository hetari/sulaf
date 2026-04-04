<script setup lang="ts">
import type { ComboboxInputEmits, ComboboxInputProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxInput, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import { useAutocompleteContext } from './context'

const props = defineProps<
  ComboboxInputProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
const emits = defineEmits<ComboboxInputEmits>()
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const { searchTerm } = useAutocompleteContext()
</script>

<template>
  <ComboboxInput
    v-bind="forwarded"
    v-model="searchTerm"
    data-slot="input-group-control"
    :class="
      cn(
        'flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm',
        'placeholder:text-muted-foreground outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // When used inside AutocompleteControl or InputGroup, remove duplicate borders
        'flex-1 rounded-none border-0 shadow-none',
        'focus-visible:ring-0 focus-visible:ring-transparent',
        props.class,
      )
    "
  />
</template>
