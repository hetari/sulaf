<script setup lang="ts">
import { useForwardPropsEmits, AccordionRoot } from 'reka-ui'
import type { ShowMoreEmits, ShowMoreProps } from './types'
import { toRef, type HTMLAttributes } from 'vue'
import { provideShowMoreRootContext } from './context'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<ShowMoreProps & { class?: HTMLAttributes['class'] }>(), {
  threshold: 3,
  truncationType: 'lines',
  fade: false,
  forceMount: true,
  showToggle: true,
  open: false,
  lineHeight: '1.5rem',
  animation: () => ({
    duration: 0.35,
    ease: 'easeInOut',
  }),
})
const emits = defineEmits<ShowMoreEmits>()
const forwarded = useForwardPropsEmits(props, emits)

provideShowMoreRootContext(props)
</script>

<template>
  <AccordionRoot v-bind="forwarded" :class="cn(props.class)">
    <slot />
  </AccordionRoot>
</template>
