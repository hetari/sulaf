<script setup lang="ts">
import {
  Meter,
  MeterHeader,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@sulaf/registry/ui/meter'
import { ref, onMounted, onUnmounted } from 'vue'

const currentValue = ref(50)
const currentVariant = ref<'default' | 'success' | 'warning' | 'danger'>('default')
const currentSize = ref<'sm' | 'default' | 'lg'>('sm')

const variants = ['default', 'success', 'warning', 'danger'] as const
const sizes = ['sm', 'default', 'lg'] as const

let variantIndex = 0
let sizeIndex = 0

const updateProperties = () => {
  // Update variant sequentially
  variantIndex = (variantIndex + 1) % variants.length
  currentVariant.value = variants[variantIndex] as 'default' | 'success' | 'warning' | 'danger'

  // Update size sequentially every 4 variants (one full variant cycle)
  if (variantIndex === 0) {
    sizeIndex = (sizeIndex + 1) % sizes.length
    currentSize.value = sizes[sizeIndex] as 'sm' | 'default' | 'lg'
  }

  // Update value with a smooth wave pattern
  currentValue.value = Math.floor(50 + 50 * Math.sin(Date.now() / 2000))
}

let intervalId: ReturnType<typeof setInterval>

onMounted(() => {
  intervalId = setInterval(updateProperties, 1500)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="max-w-xl w-full mx-auto p-6">
    <!-- state log -->
    <div class="flex items-center justify-center gap-3 pb-10">
      <div
        class="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-medium"
      >
        <span class="text-muted-foreground">Variant:</span>
        <span class="capitalize">{{ currentVariant }}</span>
      </div>
      <div
        class="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-medium"
      >
        <span class="text-muted-foreground">Size:</span>
        <span class="capitalize">{{ currentSize }}</span>
      </div>
      <div
        class="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-medium"
      >
        <span class="text-muted-foreground">Value:</span>
        <span>{{ currentValue }}%</span>
      </div>
    </div>
    <Meter
      class="w-full flex-1"
      :min="0"
      :max="100"
      :value="currentValue"
      :variant="currentVariant"
      :size="currentSize"
    >
      <MeterHeader>
        <MeterLabel>Storage Usage</MeterLabel>
        <MeterValue />
      </MeterHeader>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  </div>
</template>
