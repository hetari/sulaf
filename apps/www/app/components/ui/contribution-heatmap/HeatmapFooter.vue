<script setup lang="ts">
import { CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
