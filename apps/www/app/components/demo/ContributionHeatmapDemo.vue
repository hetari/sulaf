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
  Indigo: [
    'bg-muted',
    'bg-indigo-100 dark:bg-indigo-950',
    'bg-indigo-300 dark:bg-indigo-800',
    'bg-indigo-500 dark:bg-indigo-600',
    'bg-indigo-700 dark:bg-indigo-400',
  ],
  Rose: [
    'bg-muted',
    'bg-rose-100 dark:bg-rose-950',
    'bg-rose-300 dark:bg-rose-800',
    'bg-rose-500 dark:bg-rose-600',
    'bg-rose-700 dark:bg-rose-400',
  ],
  Amber: [
    'bg-muted',
    'bg-amber-100 dark:bg-amber-950',
    'bg-amber-300 dark:bg-amber-800',
    'bg-amber-500 dark:bg-amber-600',
    'bg-amber-700 dark:bg-amber-400',
  ],
  Slate: [
    'bg-muted',
    'bg-slate-200 dark:bg-slate-800',
    'bg-slate-400 dark:bg-slate-600',
    'bg-slate-600 dark:bg-slate-400',
    'bg-slate-800 dark:bg-slate-200',
  ],
}

const selectedPaletteName = ref<keyof typeof palettes>('default')
const activePalette = computed(() => palettes[selectedPaletteName.value])

const mockData = ref<Record<string, number>>({})
const today = new Date()
const startDate = new Date(today)
startDate.setFullYear(today.getFullYear() - 1)

// Deterministic pseudo-random function to ensure identical data on server and client in nuxt.
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 100000
  return x - Math.floor(x)
}

const newMockData: Record<string, number> = {}
for (let i = 0; i < 365; i++) {
  const d = new Date(today)
  d.setDate(d.getDate() - i)
  const key = d.toISOString().split('T')[0] as string

  if (pseudoRandom(i) > 0.4) {
    newMockData[key] = Math.floor(pseudoRandom(i + 1) * 10)
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
          <HeatmapWeekdays />

          <HeatmapGrid v-slot="{ cellGrid }">
            <HeatmapRow v-for="(row, rowIdx) in cellGrid" :key="rowIdx">
              <HeatmapCell
                v-for="cell in row"
                :key="`${cell.key}-${cell.contributions}`"
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
