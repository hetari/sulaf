<script setup lang="ts">
import { ref, onMounted, shallowRef, onUnmounted } from 'vue'
import {
  Meter,
  MeterHeader,
  MeterLabel,
  MeterTrack,
  MeterIndicator,
  MeterValue,
} from '@/components/ui/meter'
import { Button } from '@/components/ui/button'

const dynamicValue = ref(0)
const interval = shallowRef<ReturnType<typeof setInterval> | null>(null)

const startProgress = () => {
  if (interval.value) clearInterval(interval.value)
  dynamicValue.value = 0
  interval.value = setInterval(() => {
    if (dynamicValue.value < 100) {
      dynamicValue.value += 10
    } else {
      if (interval.value) clearInterval(interval.value)
      interval.value = null
    }
  }, 500)
}

onMounted(() => {
  startProgress()
})

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value)
})

const getMeterVariant = (value: number) => {
  if (value < 40) return 'danger'
  if (value < 70) return 'warning'
  if (value < 100) return 'default'
  return 'success'
}
</script>

<template>
  <div class="w-full max-w-lg space-y-6">
    <Meter :value="dynamicValue" :variant="getMeterVariant(dynamicValue)">
      <MeterHeader>
        <MeterLabel>Dynamic Progress</MeterLabel>
        <MeterValue />
      </MeterHeader>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>

    <Button `@click`="startProgress" :disabled="dynamicValue < 100 && interval !== null">
      +
      {{ dynamicValue < 100 && interval !== null ? 'In Progress...' : 'Restart Progress' }}
    </Button>

    <p class="text-sm text-muted-foreground">
      This meter updates its value and variant dynamically to reflect progress.
    </p>
  </div>
</template>
