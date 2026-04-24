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

// Generate mock data (0 or 1)
for (let i = 0; i < 365; i++) {
  const d = new Date(today)
  d.setDate(d.getDate() - i)
  const key = d.toISOString().split('T')[0]
  if (Math.random() > 0.7) {
    mockData.value[key!] = 1
  }
}

// Binary: Level 0 for 0, Level 4 for anything else
const binaryGetLevel = (count: number) => (count > 0 ? 4 : 0)
const binaryGetContributionsForLevel = (level: number) => (level === 0 ? 0 : 1)
</script>

<template>
  <Heatmap
    :data="mockData"
    :start-date="startDate"
    :end-date="today"
    :get-level="binaryGetLevel"
    :get-contributions-for-level="binaryGetContributionsForLevel"
    :palette="['bg-muted', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary']"
    :max-level="4"
  >
    <HeatmapHeader>
      <div class="flex flex-col">
        <span class="text-sm font-semibold">Binary Activity</span>
        <span class="text-xs text-muted-foreground">Showing simple active/inactive states</span>
      </div>
    </HeatmapHeader>

    <HeatmapContent>
      <HeatmapMain>
        <HeatmapMonths />
        <HeatmapWeekdays class="row-start-2" />

        <HeatmapGrid v-slot="{ cellGrid }">
          <HeatmapRow v-for="(row, rowIdx) in cellGrid" :key="rowIdx">
            <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell">
              <template #tooltip="{ cell: targetCell }">
                <div class="p-1 text-xs">
                  {{ targetCell.contributions > 0 ? 'Active' : 'No activity' }}
                  on
                  {{ targetCell.dateLabel }}
                </div>
              </template>
            </HeatmapCell>
          </HeatmapRow>
        </HeatmapGrid>
      </HeatmapMain>
    </HeatmapContent>

    <HeatmapFooter>
      <HeatmapLegend :levels="[0, 4]">
        <template #before>
          <span class="mr-1 text-[10px]">Inactive</span>
        </template>
        <template #after>
          <span class="ml-1 text-[10px]">Active</span>
        </template>
      </HeatmapLegend>
    </HeatmapFooter>
  </Heatmap>
</template>
