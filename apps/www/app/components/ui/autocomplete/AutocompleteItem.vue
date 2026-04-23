<script setup lang="ts">
import type { ComboboxItemEmits, ComboboxItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { CheckIcon } from 'lucide-vue-next'
import { ComboboxItemIndicator, useForwardPropsEmits } from 'reka-ui'
import { ComboboxItem } from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

const props = defineProps<
  ComboboxItemProps & {
    class?: HTMLAttributes['class']
  }
>()

const emits = defineEmits<ComboboxItemEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxItem v-bind="forwarded" :class="cn(props.class)" data-slot="autocomplete-item">
    <slot />

    <ComboboxItemIndicator class="ms-auto">
      <CheckIcon class="size-4" />
    </ComboboxItemIndicator>
  </ComboboxItem>
</template>
