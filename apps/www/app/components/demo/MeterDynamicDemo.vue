<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
let interval: ReturnType<typeof setInterval> | null = null

const startProgress = () => {
  if (interval) clearInterval(interval)
  dynamicValue.value = 0
  interval = setInterval(() => {
    if (dynamicValue.value < 100) {
      dynamicValue.value += 10
    } else {
      clearInterval(interval as ReturnType<typeof setInterval>)
      interval = null
    }
  }, 500)
}

onMounted(() => {
  startProgress()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
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

    <Button @click="startProgress" :disabled="dynamicValue < 100 && interval !== null">
      {{ dynamicValue < 100 && interval !== null ? 'In Progress...' : 'Restart Progress' }}
    </Button>

    <p class="text-sm text-muted-foreground">
      This meter updates its value and variant dynamically to reflect progress.
    </p>
  </div>
</template>
