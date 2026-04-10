<script setup lang="ts">
import { AccordionTrigger, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { Button, type ButtonVariants } from '@/components/ui/button'
import type { HTMLAttributes } from 'vue'
import { useShowMoreItemContext } from './context'

// TODO
interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const forwarded = useForwardProps(props)

const itemContext = useShowMoreItemContext()
</script>

<template>
  <AccordionTrigger v-if="itemContext.isTruncated.value" v-bind="forwarded" as-child>
    <Button :variant="props.variant" :size="props.size" :class="cn(props.class)">
      <slot />
    </Button>
  </AccordionTrigger>
</template>
