<template>
  <div class="button-wrapper">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { Primitive, type PrimitiveProps } from 'reka-ui'

interface Props extends PrimitiveProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
})

const buttonVariants = cva('inline-flex items-center', {
  variants: {
    variant: { default: 'bg-primary', outline: 'border', ghost: 'hover:bg-accent' },
    size: { default: 'h-10', sm: 'h-8', lg: 'h-12' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

const classes = computed(() => buttonVariants({ variant: props.variant, size: props.size }))
</script>
