<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useMeterRootContext } from './context'
import { meterHeaderVariants } from '.'
import { computed } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const headerClass = computed(() => meterHeaderVariants())
</script>

<template>
  <div :class="cn(headerClass, props.class)" data-slot="meter-header">
    <slot />
  </div>
</template>
