<script setup lang="ts">
import { Label } from '@/components/ui/label'
import type { LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { useMeterRootContext } from './context'

const props = defineProps<
  LabelProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const { label, meterId } = useMeterRootContext()
</script>

<template>
  <Label
    v-bind="delegatedProps"
    :for="meterId"
    data-slot="meter-label"
    :class="cn('text-sm font-medium text-foreground tracking-tight', props.class)"
  >
    <slot>{{ label }}</slot>
  </Label>
</template>
