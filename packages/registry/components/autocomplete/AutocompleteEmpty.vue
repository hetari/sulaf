<script setup lang="ts">
import type { ComboboxEmptyProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { useForwardProps } from 'reka-ui'
import { ComboboxEmpty } from '@sulaf/ui/components/combobox'
import { cn } from '@sulaf/ui/lib/utils'

const props = defineProps<
  ComboboxEmptyProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxEmpty
    v-bind="forwarded"
    :class="cn('py-6 text-center text-sm text-muted-foreground', props.class)"
    data-slot="autocomplete-empty"
  >
    <slot />
  </ComboboxEmpty>
</template>
