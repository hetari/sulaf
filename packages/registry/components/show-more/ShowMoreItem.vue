<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { useForwardProps, AccordionItem } from 'reka-ui'
import type { ShowMoreItemProps } from './types'
import { cn } from '@sulaf/ui/lib/utils'
import { provideShowMoreItemContext } from './context'

const props = defineProps<ShowMoreItemProps & { class?: HTMLAttributes['class'] }>()
const forwarded = useForwardProps(props)

const isTruncated = ref(false)
provideShowMoreItemContext({ value: props.value, isTruncated })
</script>

<template>
  <AccordionItem v-bind="forwarded" :class="cn(props.class)">
    <slot :is-truncated="isTruncated" />
  </AccordionItem>
</template>
