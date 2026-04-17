<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { useMeterRootContext } from './context'
import { meterTrackVariants } from '.'
import { computed } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const meterCtx = useMeterRootContext()
const trackClass = computed(() =>
  meterTrackVariants({
    size: meterCtx.size.value ?? 'default',
  }),
)
</script>

<template>
  <div :class="cn(trackClass, props.class)" data-slot="meter-track">
    <slot />
  </div>
</template>
