<script setup lang="ts">
import { ref, computed } from 'vue'
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
  HeatmapRow,
  type HeatmapCellProp,
  type HeatmapPalette,
} from '@sulaf/registry/ui/contribution-heatmap'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ---------- Palette definitions ----------
const palettes: Record<string, HeatmapPalette | undefined> = {
  default: undefined,
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

// ---------- State ----------
const useGithub = ref(false)
const githubUsername = ref('hetari')
const selectedPaletteName = ref<keyof typeof palettes>('default')
const activePalette = computed(() => palettes[selectedPaletteName.value])

// ---------- Mock data ----------
const today = new Date()
const startDate = ref(new Date())

const mockData = ref<Record<string, number>>({})
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
  <div class="w-full max-w-4xl mx-auto p-4">
    <!-- Controls -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-2">
        <Checkbox id="use-github" v-model="useGithub" />
        <Label for="use-github" class="text-sm font-medium cursor-pointer">
          Fetch from GitHub
        </Label>
      </div>

      <div class="flex items-center gap-2">
        <Input
          v-if="useGithub"
          v-model="githubUsername"
          placeholder="GitHub username"
          class="h-8 w-40"
        />
        <Select v-model="selectedPaletteName">
          <SelectTrigger class="h-8 w-32">
            <SelectValue placeholder="Palette" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="name in Object.keys(palettes)" :key="name" :value="name">
              {{ name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Heatmap: GitHub mode -->
    <Heatmap
      v-if="useGithub"
      :github-username="githubUsername"
      :palette="activePalette"
      v-slot="{ githubProfile }"
    >
      <HeatmapHeader v-slot="{ totalContributions }">
        <div class="flex items-center gap-2 sm:gap-3">
          <template v-if="githubProfile">
            <img
              :src="githubProfile.avatar_url"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border"
            />
          </template>
          <div class="flex flex-col">
            <span class="text-xs font-semibold sm:text-sm">
              GitHub activity for {{ githubProfile?.name || githubUsername }}
            </span>
            <span class="text-[10px] text-muted-foreground sm:text-xs">
              {{ totalContributions?.toLocaleString() }} contributions in the last year
            </span>
          </div>
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
        <HeatmapLegend label="Data fetched from GitHub API" />
      </HeatmapFooter>
    </Heatmap>

    <!-- Heatmap: Mock data mode -->
    <Heatmap
      v-else
      :data="mockData"
      :start-date="startDate"
      :end-date="today"
      :palette="activePalette"
    >
      <HeatmapHeader v-slot="{ totalContributions }">
        <span class="text-xs font-semibold sm:text-sm">Contribution Activity</span>
        <span class="text-[10px] text-muted-foreground sm:text-xs">
          {{ totalContributions?.toLocaleString() }} contributions in the last year
        </span>
      </HeatmapHeader>

      <HeatmapContent>
        <HeatmapMain>
          <HeatmapMonths />
          <HeatmapWeekdays class="row-start-2" />

          <HeatmapGrid v-slot="{ cellGrid }">
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
        <HeatmapLegend label="Mock data" />
      </HeatmapFooter>
    </Heatmap>
  </div>
</template>
