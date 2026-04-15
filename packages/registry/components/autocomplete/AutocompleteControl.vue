<script setup lang="ts">
import type { ComboboxAnchorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxAnchor, useForwardProps } from 'reka-ui'
import { InputGroup } from '@sulaf/ui/components/input-group'
import { cn } from '@sulaf/ui/lib/utils'

const props = defineProps<
  ComboboxAnchorProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <ComboboxAnchor v-bind="forwarded" data-slot="autocomplete-control">
    <InputGroup :class="cn(props.class)">
      <slot />
    </InputGroup>
  </ComboboxAnchor>
</template>
