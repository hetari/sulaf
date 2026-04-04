<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ComboboxTrigger } from '@/components/ui/combobox'
import type { ComboboxTriggerProps } from 'reka-ui'
import { useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<ComboboxTriggerProps & { class?: HTMLAttributes['class'] }>()

const forwarded = useForwardProps(props)
</script>

<template>
  <ComboboxTrigger v-bind="forwarded" :class="cn('outline-none cursor-pointer', props.class)">
    <slot />
  </ComboboxTrigger>
</template>
