<script setup lang="ts">
import { cn } from '@sulaf/ui/lib/utils'
import { ComboboxTrigger } from '@sulaf/ui/components/combobox'
import type { ComboboxTriggerProps } from 'reka-ui'
import { useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<ComboboxTriggerProps & { class?: HTMLAttributes['class'] }>()

const forwarded = useForwardProps(props)
</script>

<template>
  <ComboboxTrigger
    v-bind="forwarded"
    aria-label="Toggle menu"
    :class="cn('outline-none cursor-pointer', props.class)"
    data-slot="autocomplete-trigger"
  >
    <slot />
  </ComboboxTrigger>
</template>
