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
  <div class="space-y-8">
    <!-- Horizontal Meters -->
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-semibold">Horizontal Meters</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Meter :value="value" variant="default">
          <MeterHeader>
            <MeterLabel>Default</MeterLabel>
            <MeterValue />
          </MeterHeader>
          <MeterTrack><MeterIndicator /></MeterTrack>
        </Meter>

        <Meter :value="value" variant="success">
          <MeterHeader>
            <MeterLabel>Success</MeterLabel>
            <MeterValue />
          </MeterHeader>
          <MeterTrack><MeterIndicator /></MeterTrack>
        </Meter>

        <Meter :value="value" variant="warning">
          <MeterHeader>
            <MeterLabel>Warning</MeterLabel>
            <MeterValue />
          </MeterHeader>
          <MeterTrack><MeterIndicator /></MeterTrack>
        </Meter>

        <Meter :value="value" variant="danger">
          <MeterHeader>
            <MeterLabel>Danger</MeterLabel>
            <MeterValue />
          </MeterHeader>
          <MeterTrack><MeterIndicator /></MeterTrack>
        </Meter>
      </div>
    </div>

    <!-- Vertical Meters -->
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-semibold">Vertical Meters</h3>
      <div class="flex gap-4 h-64">
        <Meter :value="value" orientation="vertical" variant="default">
          <MeterTrack><MeterIndicator /></MeterTrack>
          <MeterHeader>
            <MeterLabel>Default</MeterLabel>
            <MeterValue />
          </MeterHeader>
        </Meter>

        <Meter :value="value" orientation="vertical" variant="success">
          <MeterTrack><MeterIndicator /></MeterTrack>
          <MeterHeader>
            <MeterLabel>Success</MeterLabel>
            <MeterValue />
          </MeterHeader>
        </Meter>

        <Meter :value="value" orientation="vertical" variant="warning">
          <MeterTrack><MeterIndicator /></MeterTrack>
          <MeterHeader>
            <MeterLabel>Warning</MeterLabel>
            <MeterValue />
          </MeterHeader>
        </Meter>

        <Meter :value="value" orientation="vertical" variant="danger">
          <MeterTrack><MeterIndicator /></MeterTrack>
          <MeterHeader>
            <MeterLabel>Danger</MeterLabel>
            <MeterValue />
          </MeterHeader>
        </Meter>
      </div>
    </div>

    <!-- Different Sizes -->
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-semibold">Different Sizes (Horizontal)</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Meter :value="value" size="sm">
          <MeterHeader>
            <MeterLabel>Small</MeterLabel>
            <MeterValue />
          </MeterHeader>
          <MeterTrack><MeterIndicator /></MeterTrack>
        </Meter>

        <Meter :value="value" size="default">
          <MeterHeader>
            <MeterLabel>Default</MeterLabel>
            <MeterValue />
          </MeterHeader>
          <MeterTrack><MeterIndicator /></MeterTrack>
        </Meter>

        <Meter :value="value" size="lg">
          <MeterHeader>
            <MeterLabel>Large</MeterLabel>
            <MeterValue />
          </MeterHeader>
          <MeterTrack><MeterIndicator /></MeterTrack>
        </Meter>
      </div>
    </div>
  </div>
</template>
