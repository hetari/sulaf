<script setup lang="ts">
import { ref } from 'vue'
import {
  Heatmap,
  HeatmapHeader,
  HeatmapContent,
  HeatmapGrid,
  HeatmapCell,
  HeatmapFooter,
  HeatmapLegend,
  HeatmapMain,
  HeatmapMonths,
  HeatmapWeekdays,
} from '~/components/ui/contribution-heatmap'

const mockData = ref<Record<string, number>>({})
const today = new Date()
const startDate = new Date(today)
startDate.setFullYear(today.getFullYear() - 1)

// Generate some sparse data
for (let i = 0; i < 365; i++) {
  const d = new Date(today)
  d.setDate(d.getDate() - i)
  const key = d.toISOString().split('T')[0]
  if (Math.random() > 0.4) {
    mockData.value[key!] = Math.floor(Math.random() * 50)
  }
}

/**
 * Custom level logic:
 * 0: No activity
 * 1: 1-10 (Low)
 * 2: 11-20 (Medium)
 * 3: 21-40 (High)
 * 4: 41+ (Very High)
 */
const customGetLevel = (count: number) => {
  if (count === 0) return 0
  if (count <= 10) return 1
  if (count <= 20) return 2
  if (count <= 40) return 3
  return 4
}

/**
 * Custom legend labels:
 * Returns the minimum value to be displayed for each level in the legend
 */
const customGetContributionsForLevel = (level: number) => {
  return [0, 1, 11, 21, 41][level] ?? 0
}
</script>

<template>
  <Heatmap
    :data="mockData"
    :start-date="startDate"
    :end-date="today"
    :get-level="customGetLevel"
    :get-contributions-for-level="customGetContributionsForLevel"
  >
    <HeatmapHeader v-slot="{ totalContributions }">
      <div class="flex flex-col">
        <span class="text-sm font-semibold">Custom Thresholds</span>
        <span class="text-xs text-muted-foreground">
          Defining specific ranges for contribution levels
        </span>
      </div>
    </HeatmapHeader>

    <HeatmapContent>
      <HeatmapMain>
        <HeatmapMonths />
        <HeatmapWeekdays class="row-start-2" />

        <HeatmapGrid v-slot="{ cellGrid }">
          <HeatmapRow v-for="(row, rowIdx) in cellGrid" :key="rowIdx">
            <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
          </HeatmapRow>
        </HeatmapGrid>
      </HeatmapMain>
    </HeatmapContent>

    <HeatmapFooter>
      <HeatmapLegend label="Legend follows custom thresholds" />
    </HeatmapFooter>
  </Heatmap>
</template>
