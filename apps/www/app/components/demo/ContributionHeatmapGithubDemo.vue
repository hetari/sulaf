<script setup lang="ts">
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

const githubUsername = ref('hetari')
</script>

<template>
  <Heatmap :github-username="githubUsername" v-slot="{ githubProfile }">
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
            GitHub activity for {{ githubProfile?.name || 'User' }}
          </span>
          <span class="text-[10px] text-muted-foreground sm:text-xs"
            >{{ totalContributions?.toLocaleString() }} contributions in the last year</span
          >
        </div>
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
          </div>
        </HeatmapGrid>
      </HeatmapMain>
    </HeatmapContent>

    <HeatmapFooter>
      <HeatmapLegend label="Data fetched from GitHub API" />
    </HeatmapFooter>
  </Heatmap>
</template>
