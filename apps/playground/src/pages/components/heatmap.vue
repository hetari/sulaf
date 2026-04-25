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

    <div class="p-10 flex flex-col gap-16 bg-background min-h-screen">
      <!-- Test Case 1: Flex Row -->
      <section>
        <h2 class="mb-4 text-xl font-bold border-b pb-2">1. Flex Row (with sibling)</h2>
        <div class="flex items-start gap-6 border p-6 rounded-xl bg-card/50">
          <div
            class="h-40 w-40 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 shrink-0"
          >
            <span class="text-primary font-medium">Sibling</span>
          </div>
          <Heatmap :data="mockData">
            <HeatmapHeader v-slot="{ totalContributions }">
              <CardTitle>Row Layout</CardTitle>
              <CardDescription
                >{{ totalContributions }} contributions in the last year</CardDescription
              >
            </HeatmapHeader>
            <HeatmapContent>
              <HeatmapMain>
                <HeatmapWeekdays />
                <HeatmapMonths />
                <HeatmapGrid v-slot="{ cellGrid }">
                  <HeatmapRow v-for="(row, i) in cellGrid" :key="i">
                    <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
                  </HeatmapRow>
                </HeatmapGrid>
              </HeatmapMain>
            </HeatmapContent>
            <HeatmapFooter>
              <HeatmapLegend label="Contribution Levels" />
            </HeatmapFooter>
          </Heatmap>
        </div>
      </section>

      <!-- Test Case 2: Narrow Flex Col -->
      <section>
        <h2 class="mb-4 text-xl font-bold border-b pb-2">2. Narrow Flex Column (Scrollable)</h2>
        <div class="flex flex-col w-72 border p-6 rounded-xl bg-card/50 gap-4">
          <div class="h-10 bg-muted rounded animate-pulse" />
          <Heatmap :data="mockData">
            <HeatmapHeader>
              <CardTitle class="text-sm">Compact View</CardTitle>
            </HeatmapHeader>
            <HeatmapContent>
              <HeatmapMain>
                <HeatmapWeekdays />
                <HeatmapMonths />
                <HeatmapGrid v-slot="{ cellGrid }">
                  <HeatmapRow v-for="(row, i) in cellGrid" :key="i">
                    <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
                  </HeatmapRow>
                </HeatmapGrid>
              </HeatmapMain>
            </HeatmapContent>
            <HeatmapFooter>
              <HeatmapLegend />
            </HeatmapFooter>
          </Heatmap>
        </div>
      </section>

      <!-- Test Case 3: Grid Layout -->
      <section>
        <h2 class="mb-4 text-xl font-bold border-b pb-2">3. Grid Layout</h2>
        <div class="grid grid-cols-2 gap-6 border p-6 rounded-xl bg-card/50">
          <div class="border p-4 rounded bg-muted/20">Grid Item 1</div>
          <Heatmap :data="mockData">
            <HeatmapHeader>
              <CardTitle>Grid Item 2</CardTitle>
            </HeatmapHeader>
            <HeatmapContent>
              <HeatmapMain>
                <HeatmapWeekdays />
                <HeatmapMonths />
                <HeatmapGrid v-slot="{ cellGrid }">
                  <HeatmapRow v-for="(row, i) in cellGrid" :key="i">
                    <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
                  </HeatmapRow>
                </HeatmapGrid>
              </HeatmapMain>
            </HeatmapContent>
            <HeatmapFooter>
              <HeatmapLegend />
            </HeatmapFooter>
          </Heatmap>
        </div>
      </section>

      <!-- Test Case 4: Absolute Positioning -->
      <section class="relative h-64 border p-6 rounded-xl bg-card/50">
        <h2 class="mb-4 text-xl font-bold border-b pb-2">4. Absolute Positioned (Bottom Right)</h2>
        <div class="absolute bottom-6 right-6 w-[400px]">
          <Heatmap :data="mockData">
            <HeatmapHeader>
              <CardTitle class="text-xs">Pinned Heatmap</CardTitle>
            </HeatmapHeader>
            <HeatmapContent>
              <HeatmapMain>
                <HeatmapWeekdays />
                <HeatmapMonths />
                <HeatmapGrid v-slot="{ cellGrid }">
                  <HeatmapRow v-for="(row, i) in cellGrid" :key="i">
                    <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
                  </HeatmapRow>
                </HeatmapGrid>
              </HeatmapMain>
            </HeatmapContent>
            <HeatmapFooter>
              <HeatmapLegend />
            </HeatmapFooter>
          </Heatmap>
        </div>
      </section>

      <!-- Test Case 5: Fixed Positioning (Overlay) -->
      <section>
        <h2 class="mb-4 text-xl font-bold border-b pb-2">5. Fixed Positioning (Corner Overlay)</h2>
        <p class="text-muted-foreground italic">Look at the bottom left of your screen.</p>
        <div
          class="fixed bottom-6 left-6 z-50 w-80 shadow-2xl scale-75 origin-bottom-left hover:scale-100 transition-transform duration-300"
        >
          <Heatmap :data="mockData">
            <HeatmapHeader>
              <CardTitle class="text-xs">Floating Activity</CardTitle>
            </HeatmapHeader>
            <HeatmapContent class="p-0">
              <HeatmapMain class="p-4 scale-90 origin-top-left">
                <HeatmapWeekdays />
                <HeatmapMonths />
                <HeatmapGrid v-slot="{ cellGrid }">
                  <HeatmapRow v-for="(row, i) in cellGrid" :key="i">
                    <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
                  </HeatmapRow>
                </HeatmapGrid>
              </HeatmapMain>
            </HeatmapContent>
            <HeatmapFooter class="py-2">
              <HeatmapLegend />
            </HeatmapFooter>
          </Heatmap>
        </div>
      </section>
    </div>
  </div>
</template>
