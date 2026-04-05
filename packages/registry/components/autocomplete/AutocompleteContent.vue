<script setup lang="ts">
import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import { ComboboxList } from '@sulaf/ui/components/combobox'
import { cn } from '@sulaf/ui/lib/utils'

const props = withDefaults(
  defineProps<
    ComboboxContentProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    /** The preferred position for the content panel. */
    position: 'popper',
    /** The alignment of the content panel relative to the trigger. */
    align: 'start',
    /** The offset (in pixels) between the trigger and the content panel. */
    sideOffset: 8,
  },
)

const emits = defineEmits<ComboboxContentEmits>()
const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxList v-bind="forwarded" :class="cn('w-(--reka-combobox-trigger-width)', props.class)">
    <slot />
  </ComboboxList>
</template>
