<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

/* ============================= */
/* ShineBorder (Reusable Wrapper) */
/* ============================= */

interface Props {
  borderWidth?: number
  duration?: number
  gradient?: string
  className?: string
  borderRadius?: string // Optional custom radius
}

const props = withDefaults(defineProps<Props>(), {
  borderWidth: 2,
  duration: 3,
  gradient: 'from-blue-500 via-red-500 to-teal-400',
  className: '',
  borderRadius: '1rem', // Default 16px (rounded-2xl)
})

const styleVars = computed(() => ({
  '--border-width': `${props.borderWidth}px`,
  '--duration': `${props.duration}s`,
  '--border-radius': props.borderRadius,
  'padding': 'var(--border-width)',
}))
</script>

<template>
  <div
    :class="cn('relative', props.className)"
    :style="styleVars"
    style="border-radius: var(--border-radius)"
  >
    <!-- Animated Gradient Layer -->
    <div class="absolute inset-0 overflow-hidden" style="border-radius: inherit">
      <div
        :class="cn('absolute -inset-full blur-sm animate-spin bg-conic-glow', props.gradient)"
        :style="{ animationDuration: 'var(--duration)' }"
      />
    </div>

    <!-- Content Layer -->
    <div
      class="relative bg-background size-full"
      style="border-radius: calc(var(--border-radius) - var(--border-width))"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bg-conic-glow {
  background-image: conic-gradient(
    from 0deg,
    var(--tw-gradient-from, transparent),
    var(--tw-gradient-via, transparent),
    var(--tw-gradient-to, transparent),
    var(--tw-gradient-from, transparent)
  );
}
</style>
