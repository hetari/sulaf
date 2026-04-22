<script setup lang="ts">
import { CardFooter } from '@sulaf/ui/components/card'
import { cn } from '@sulaf/ui/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <CardFooter :class="cn('flex items-center justify-between border-t', props.class)">
    <slot />
  </CardFooter>
</template>
