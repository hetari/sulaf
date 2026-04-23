<script setup lang="ts">
import { ComboboxRoot, useForwardPropsEmits } from 'reka-ui'
import { provideAutocompleteContext } from './context'
import type { AutocompleteEmits, AutocompleteProps } from './types'
import { type HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    AutocompleteProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    highlightOnHover: true,
  },
)
const emits = defineEmits<AutocompleteEmits>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })
provideAutocompleteContext({ searchTerm })

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
    v-model:search-term="searchTerm"
    :class="cn('relative', props.class)"
    data-slot="autocomplete"
  >
    <slot />
  </ComboboxRoot>
</template>
