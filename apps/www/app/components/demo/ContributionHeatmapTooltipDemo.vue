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
  type HeatmapCellProp,
} from '~/components/ui/contribution-heatmap'
import { Badge } from '~/components/ui/badge'

const mockData = ref<Record<string, number>>({})
const today = new Date()
const startDate = new Date(today)
startDate.setFullYear(today.getFullYear() - 1)

// Generate mock data
for (let i = 0; i < 365; i++) {
  const d = new Date(today)
  d.setDate(d.getDate() - i)
  const key = d.toISOString().split('T')[0]
  if (Math.random() > 0.5) {
    mockData.value[key!] = Math.floor(Math.random() * 15)
  }
}

// Emoji mappings based on contribution levels
const getEmoji = (count: number): string => {
  if (count === 0) return '😴'
  if (count <= 2) return '🌱'
  if (count <= 5) return '🔥'
  if (count <= 9) return '⚡'
  if (count <= 12) return '🚀'
  return '👑'
}

const getAchievement = (count: number): string => {
  if (count === 0) return 'Taking a break'
  if (count <= 2) return 'Getting started'
  if (count <= 5) return 'Building momentum'
  if (count <= 9) return 'On fire'
  if (count <= 12) return 'Unstoppable'
  return 'Legendary'
}

const lastClicked = ref<HeatmapCellProp | null>(null)

const onCellClick = (cell: HeatmapCellProp) => {
  lastClicked.value = cell
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <Heatmap :data="mockData" :start-date="startDate" :end-date="today" @click:cell="onCellClick">
      <HeatmapHeader>
        <div class="flex flex-col">
          <span class="text-sm font-semibold">Interaction Demo</span>
          <span class="text-xs text-muted-foreground">Custom tooltips and click events</span>
        </div>
      </HeatmapHeader>

      <HeatmapContent>
        <HeatmapMain>
          <template #months>
            <HeatmapMonths />
          </template>
          <template #weekdays>
            <HeatmapWeekdays />
          </template>

          <HeatmapGrid v-slot="{ cellGrid }">
            <div v-for="(row, rowIdx) in cellGrid" :key="rowIdx" class="flex gap-0.5 sm:gap-0.75">
              <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell">
                <!-- Custom Tooltip Slot -->
                <template #tooltip="{ cell: targetCell }">
                  <div class="flex flex-col gap-2 p-2">
                    <!-- Status Badge -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <span class="text-lg">{{ getEmoji(targetCell.contributions) }}</span>
                        <span class="font-bold text-xs capitalize">
                          {{ getAchievement(targetCell.contributions) }} |
                          <span class="text-xs font-mono font-semibold">
                            {{ targetCell.contributions }}
                          </span>
                        </span>
                      </div>
                    </div>

                    <!-- Date Display -->
                    <div class="flex items-center gap-1.5 px-1">
                      <span class="text-[10px] opacity-60">📅</span>
                      <span class="text-xs font-medium opacity-80">{{ targetCell.dateLabel }}</span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full"
                        :class="{
                          'bg-linear-to-r from-primary/60 to-primary': targetCell.contributions > 0,
                          'bg-muted': targetCell.contributions === 0,
                        }"
                        :style="{
                          width: `${Math.min((targetCell.contributions / 15) * 100, 100)}%`,
                        }"
                      />
                    </div>
                  </div>
                </template>
              </HeatmapCell>
            </div>
          </HeatmapGrid>
        </HeatmapMain>
      </HeatmapContent>

      <HeatmapFooter>
        <HeatmapLegend label="Tasks completed" />
      </HeatmapFooter>
    </Heatmap>

    <!-- Display click result -->
    <div
      v-if="lastClicked"
      class="flex items-center gap-3 p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div class="text-2xl">{{ getEmoji(lastClicked.contributions) }}</div>
      <div class="flex flex-col gap-1">
        <span class="text-xs font-medium uppercase text-muted-foreground tracking-wider">
          Last Selected
        </span>
        <div class="flex items-center gap-2">
          <span class="font-semibold">{{ lastClicked.dateLabel }}</span>
          <Badge variant="secondary">{{ lastClicked.contributions }} contributions</Badge>
        </div>
      </div>
    </div>
    <div v-else class="text-sm text-muted-foreground italic px-4 flex items-center gap-2">
      <span class="text-base">👆</span>
      Click a cell to see details here...
    </div>
  </div>
</template>
