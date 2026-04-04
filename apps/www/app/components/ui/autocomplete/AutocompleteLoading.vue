<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="cn('flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground', props.class)"
    aria-live="polite"
    aria-label="Loading options"
  >
    <slot>
      <Spinner class="size-3.5" />
      <span>Loading...</span>
    </slot>
  </div>
</template>
