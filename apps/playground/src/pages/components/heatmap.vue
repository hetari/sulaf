<script setup lang="ts">
import {
  Heatmap,
  HeatmapContent,
  HeatmapFooter,
  HeatmapHeader,
  HeatmapLegend,
  HeatmapMain,
  HeatmapCell,
  HeatmapGrid,
  HeatmapWeekdays,
  HeatmapMonths,
  type HeatmapCellProp,
} from '@sulaf/registry/ui/contribution-heatmap'
import { ref } from 'vue'

const mockData = ref<Record<string, number>>({})
const startDate = ref(new Date())
const today = new Date()

const newMockData: Record<string, number> = {}
for (let i = 0; i < 365; i++) {
  const d = new Date(today)
  d.setDate(d.getDate() - i)
  const key = d.toISOString().split('T')[0]!
  newMockData[key] = Math.floor(Math.random() * 10)
}
mockData.value = newMockData

const newStartDate = new Date(today)
newStartDate.setFullYear(today.getFullYear() - 1)
startDate.value = newStartDate

const onCellClick = (cell: HeatmapCellProp) => {
  alert(`${cell.dateLabel}: ${cell.contributions} contributions`)
}
</script>

<template>
  <div class="space-y-4">
    <Heatmap :data="mockData" :start-date="startDate" :end-date="today">
      <HeatmapHeader v-slot="{ totalContributions }">
        <span class="text-xs font-semibold sm:text-sm">Contribution Activity</span>
        <span class="text-[10px] text-muted-foreground sm:text-xs"
          >{{ totalContributions?.toLocaleString() }} contributions in the last year</span
        >
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
              <HeatmapCell
                v-for="cell in row"
                :key="cell.key"
                :cell="cell"
                @click="onCellClick(cell)"
              >
                <template #tooltip="{ cell: targetCell }">
                  <div class="flex flex-col gap-1 px-1 py-0.5">
                    <span class="font-medium text-xs">
                      {{ targetCell.contributions }}
                      {{ targetCell.contributions === 1 ? 'contribution' : 'contributions' }}
                    </span>
                    <span class="text-[10px] text-muted-foreground">
                      {{ targetCell.dateLabel }}
                    </span>
                  </div>
                </template>
              </HeatmapCell>
            </div>
          </HeatmapGrid>
        </HeatmapMain>
      </HeatmapContent>

      <HeatmapFooter>
        <HeatmapLegend label="Learn how we count contributions" />
      </HeatmapFooter>
    </Heatmap>

    <Heatmap github-username="hetari" v-slot="{ githubProfile }">
      <HeatmapHeader v-slot="{ totalContributions }">
        <span class="text-xs font-semibold sm:text-sm flex items-center gap-2">
          <template v-if="githubProfile">
            <img :src="githubProfile.avatar_url" class="w-10 h-10 rounded-full" />
          </template>
          Contribution Activity for {{ githubProfile?.name }}</span
        >
        <span class="text-[10px] text-muted-foreground sm:text-xs"
          >{{ totalContributions?.toLocaleString() }} contributions in the last year</span
        >
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
              <HeatmapCell
                v-for="cell in row"
                :key="cell.key"
                :cell="cell"
                @click="onCellClick(cell)"
              >
                <template #tooltip="{ cell: targetCell }">
                  <div class="flex flex-col gap-1 px-1 py-0.5">
                    <span class="font-medium text-xs">
                      {{ targetCell.contributions }}
                      {{ targetCell.contributions === 1 ? 'contribution' : 'contributions' }}
                    </span>
                    <span class="text-[10px] text-muted-foreground">
                      {{ targetCell.dateLabel }}
                    </span>
                  </div>
                </template>
              </HeatmapCell>
            </div>
          </HeatmapGrid>
        </HeatmapMain>
      </HeatmapContent>

      <HeatmapFooter>
        <HeatmapLegend label="Learn how we count contributions" />
      </HeatmapFooter>
    </Heatmap>
  </div>
</template>
