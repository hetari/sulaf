<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { meterHeaderVariants } from '.'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(meterHeaderVariants(), props.class)" data-slot="meter-header">
    <slot />
  </div>
</template>
