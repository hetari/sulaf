<script setup lang="ts">
import { AccordionTrigger, useForwardProps } from 'reka-ui'
import { cn } from '@sulaf/ui/lib/utils'
import { Button, type ButtonVariants } from '@sulaf/ui/components/button'
import type { HTMLAttributes } from 'vue'
import { useShowMoreItemContext, useShowMoreRootContext } from './context'

// TODO
interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const forwarded = useForwardProps(props)

const itemContext = useShowMoreItemContext()
const rootContext = useShowMoreRootContext()
</script>

<template>
  <AccordionTrigger
    v-if="itemContext.isTruncated && rootContext.showToggle"
    v-bind="forwarded"
    as-child
    data-slot="show-more-button"
  >
    <Button :variant="props.variant" :size="props.size" :class="cn(props.class)">
      <slot />
    </Button>
  </AccordionTrigger>
</template>
