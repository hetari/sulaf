<script setup lang="ts">
import { Label } from '@sulaf/ui/components/label'
import type { LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { useMeterRootContext } from './context'
import { reactiveOmit } from '@vueuse/core'

const props = defineProps<
  LabelProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')

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
