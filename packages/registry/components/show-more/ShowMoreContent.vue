<script setup lang="ts">
import { computed, watchEffect, type HTMLAttributes, useTemplateRef } from 'vue'
import { AccordionContent } from 'reka-ui'
import { motion } from 'motion-v'
import { useElementSize } from '@vueuse/core'
import { cn } from '@sulaf/ui/lib/utils'
import { useShowMoreRootContext, useShowMoreItemContext } from './context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const rootContext = useShowMoreRootContext()
const itemContext = useShowMoreItemContext()

const contentRef = useTemplateRef<HTMLDivElement>('contentRef')
const lhRef = useTemplateRef<HTMLDivElement>('lhRef')

// Reactive line height measurement using a hidden element
const { height: detectedLineHeight } = useElementSize(lhRef)

const isOpen = computed(() => {
  const { modelValue, open } = rootContext
  if (modelValue === undefined) return open
  return Array.isArray(modelValue)
    ? modelValue.includes(itemContext.value)
    : modelValue === itemContext.value
})

const thresholdHeightPx = computed(() => detectedLineHeight.value * rootContext.threshold)

const collapsedHeight = computed(() => {
  if (thresholdHeightPx.value > 0) return `${thresholdHeightPx.value}px`
  return `calc(${rootContext.threshold} * ${rootContext.lineHeight})`
})

const animateTarget = computed(() =>
  isOpen.value ? { height: 'auto' } : { height: collapsedHeight.value },
)

const { height: contentHeight } = useElementSize(contentRef)

// Robust truncation detection using integer comparison to handle sub-pixel issues
watchEffect(() => {
  if (contentHeight.value > 0 && thresholdHeightPx.value > 0) {
    itemContext.isTruncated.value =
      Math.trunc(contentHeight.value) > Math.trunc(thresholdHeightPx.value)
  }
})
</script>

<template>
  <AccordionContent :force-mount="rootContext.forceMount" as-child>
    <motion.div
      :initial="{ height: collapsedHeight }"
      :animate="animateTarget"
      :transition="{ duration: 0.35, ease: 'easeInOut' }"
      :class="cn('overflow-hidden relative', props.class)"
      style="will-change: height"
    >
      <!-- Measurement element for reactive line height detection -->
      <div
        ref="lhRef"
        class="invisible absolute opacity-0 select-none pointer-events-none"
        aria-hidden="true"
      >
        M
      </div>

      <!-- Natural content wrap -->
      <div ref="contentRef">
        <slot />
      </div>

      <motion.div
        v-if="rootContext.fade && rootContext.showToggle"
        :initial="{ opacity: 1 }"
        :animate="{ opacity: isOpen || !itemContext.isTruncated.value ? 0 : 1 }"
        class="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-background to-transparent pointer-events-none"
      />
    </motion.div>
  </AccordionContent>
</template>
