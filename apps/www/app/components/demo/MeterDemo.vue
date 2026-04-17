<script setup lang="ts">
import { ref } from 'vue'
import {
  Meter,
  MeterHeader,
  MeterLabel,
  MeterTrack,
  MeterIndicator,
  MeterValue,
} from '@/components/ui/meter'
const value = ref(75)
</script>

<template>
  <div class="flex gap-8 size-full min-h-64 items-center">
    <div class="size-full flex-1">
      <Meter :value="value" orientation="horizontal" size="lg">
        <MeterHeader>
          <MeterLabel>Completion</MeterLabel>
          <MeterValue />
        </MeterHeader>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>

    <div class="flex-1 size-full">
      <Meter :value="value" orientation="vertical" size="lg">
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
        <MeterHeader>
          <MeterLabel>Storage</MeterLabel>
          <MeterValue />
        </MeterHeader>
      </Meter>
    </div>
  </div>
</template>
