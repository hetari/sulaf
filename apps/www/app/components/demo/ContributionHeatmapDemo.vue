<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Heatmap,
  HeatmapHeader,
  HeatmapContent,
  HeatmapGrid,
  HeatmapCell,
  HeatmapFooter,
  HeatmapLegend,
  HeatmapMain,
  HeatmapRow,
  HeatmapMonths,
  HeatmapWeekdays,
  type HeatmapCellProp,
  type HeatmapPalette,
} from '~/components/ui/contribution-heatmap'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const palettes: Record<string, HeatmapPalette | undefined> = {
  default: undefined,
  rainbow: [
    'bg-muted',
    'bg-orange-200 dark:bg-amber-200',
    'bg-yellow-400 dark:bg-red-400',
    'bg-green-600 dark:bg-cyan-400',
    'bg-blue-800 dark:bg-purple-400',
  ],
  Blue: [
    'bg-muted',
    'bg-blue-200 dark:bg-blue-300',
    'bg-blue-400 dark:bg-blue-500',
    'bg-blue-600 dark:bg-blue-700',
    'bg-blue-800 dark:bg-blue-900',
  ],
  Purple: [
    'bg-muted',
    'bg-purple-200 dark:bg-purple-300',
    'bg-purple-400 dark:bg-purple-500',
    'bg-purple-600 dark:bg-purple-700',
    'bg-purple-800 dark:bg-purple-900',
  ],
  Rose: [
    'bg-muted',
    'bg-rose-200 dark:bg-rose-300',
    'bg-rose-400 dark:bg-rose-500',
    'bg-rose-600 dark:bg-rose-700',
    'bg-rose-800 dark:bg-rose-900',
  ],
  Amber: [
    'bg-muted',
    'bg-amber-200 dark:bg-amber-300',
    'bg-amber-400 dark:bg-amber-500',
    'bg-amber-600 dark:bg-amber-700',
    'bg-amber-800 dark:bg-amber-900',
  ],
}

const selectedPaletteName = ref<keyof typeof palettes>('default')
const activePalette = computed(() => palettes[selectedPaletteName.value])

const mockData = ref<Record<string, number>>({})
const today = new Date()
const startDate = new Date(today)
startDate.setFullYear(today.getFullYear() - 1)

const newMockData: Record<string, number> = {}
for (let i = 0; i < 365; i++) {
  const d = new Date(today)
  d.setDate(d.getDate() - i)
  const key = d.toISOString().split('T')[0] as string
  if (Math.random() > 0.4) {
    newMockData[key] = Math.floor(Math.random() * 10)
  }
}
mockData.value = newMockData

const onCellClick = (cell: HeatmapCellProp) => {
  alert(`${cell.dateLabel}: ${cell.contributions} contributions`)
}
</script>

<template>
  <div class="flex w-full flex-wrap items-start gap-2">
    <div class="me-2 text-sm">
      <SelectLabel>Palette {{ selectedPaletteName }}</SelectLabel>
      <Select v-model="selectedPaletteName">
        <SelectTrigger>
          <SelectValue placeholder="Select a palette" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="name in Object.keys(palettes)" :key="name" :value="name">
            {{ name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Heatmap :data="mockData" :start-date="startDate" :end-date="today" :palette="activePalette">
      <HeatmapHeader v-slot="{ totalContributions }">
        <span class="text-xs font-semibold sm:text-sm">Contribution Activity</span>
        <span class="text-[10px] text-muted-foreground sm:text-xs"
          >{{ totalContributions?.toLocaleString() }} contributions in the last year</span
        >
      </HeatmapHeader>

      <HeatmapContent>
        <HeatmapMain>
          <HeatmapMonths />
          <HeatmapWeekdays class="row-start-2" />

          <HeatmapGrid class="row-start-2" v-slot="{ cellGrid }">
            <HeatmapRow v-for="(row, rowIdx) in cellGrid" :key="rowIdx">
              <HeatmapCell
                v-for="cell in row"
                :key="cell.key"
                :cell="cell"
                @click="onCellClick(cell)"
              >
                <template #tooltip="{ cell: targetCell }">
                  <div class="flex flex-col gap-1 px-1 py-0.5 text-left">
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
            </HeatmapRow>
          </HeatmapGrid>
        </HeatmapMain>
      </HeatmapContent>

      <HeatmapFooter>
        <HeatmapLegend label="Learn how we count contributions" />
      </HeatmapFooter>
    </Heatmap>
  </div>
</template>
