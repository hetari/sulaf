<script setup lang="ts">
import { ComboboxRoot, useForwardPropsEmits } from 'reka-ui'
import { provideAutocompleteContext } from './context'
import type { AutocompleteEmits, AutocompleteProps } from './types'

const props = withDefaults(defineProps<AutocompleteProps>(), {
  highlightOnHover: true,
})
const emits = defineEmits<AutocompleteEmits>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })
provideAutocompleteContext({ searchTerm })

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ComboboxRoot v-bind="forwarded" v-model:search-term="searchTerm" class="relative">
    <slot />
  </ComboboxRoot>
</template>
