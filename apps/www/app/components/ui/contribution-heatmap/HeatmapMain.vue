<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('relative w-full', props.class)">
    <div class="flex flex-col gap-1 sm:gap-1.5">
      <slot name="months" />
      <div class="flex items-start gap-0.5 sm:gap-0.75 py-0.5">
        <slot name="weekdays" />
        <slot />
      </div>
    </div>
  </div>
</template>
