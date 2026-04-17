<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { useMeterRootContext } from './context'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { percentage } = useMeterRootContext()
</script>

<template>
  <span
    :class="cn('text-sm text-muted-foreground', props.class)"
    data-slot="meter-value"
    :data-value="percentage"
  >
    <slot>{{ percentage }}</slot>
  </span>
</template>
