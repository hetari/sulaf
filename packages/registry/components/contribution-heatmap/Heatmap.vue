<script setup lang="ts">
import { provideHeatmapDataRootContext } from './context'
import type { HeatmapProps, HeatmapEmits, HeatmapPalette } from './types'
import { computed, useId } from 'vue'
import { useHeatmap } from './useHeatmap'
import { Card } from '@sulaf/ui/components/card'
import { TooltipProvider } from '@sulaf/ui/components/tooltip'
import { cn } from '@sulaf/ui/lib/utils'
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { GitHubProfile } from '@/hooks/use-github-profile'

const props = withDefaults(
  defineProps<
    HeatmapProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    rows: 7,
    cols: 52,
    maxLevel: 4,
    githubUsername: undefined,
    data: () => ({}),
    getLevel: (count: number) => Math.min(Math.floor(count / 2), 4),
    getContributionsForLevel: (level: number) => level * 2,
    palette: (): HeatmapPalette => [
      'bg-muted',
      'bg-emerald-200',
      'bg-emerald-400',
      'bg-emerald-600',
      'bg-emerald-800',
    ],
  },
)

defineSlots<{
  default(props: { githubProfile: GitHubProfile | null }): any
}>()

const emits = defineEmits<HeatmapEmits>()
const DAYMS = 86400000

const {
  actualStartDate,
  actualEndDate,
  contributionData,
  totalContributions,
  isLoading,
  isError,
  profile,
  cells: heatmapCells,
} = useHeatmap({
  githubUsername: () => props.githubUsername,
  data: () => props.data,
  startDate: () => props.startDate,
  endDate: () => props.endDate,
  rows: () => props.rows,
  cols: () => props.cols,
  maxLevel: () => props.maxLevel,
  getLevel: () => props.getLevel,
  dayMs: DAYMS,
})

const id = useId()
provideHeatmapDataRootContext({
  id,
  startDate: actualStartDate,
  endDate: actualEndDate,
  cells: heatmapCells,
  data: contributionData,
  totalContributions,
  isLoading,
  isError,
  profile,
  dayMs: DAYMS,
  rows: computed(() => props.rows),
  cols: computed(() => props.cols),
  maxLevel: computed(() => props.maxLevel),
  getLevel: computed(() => props.getLevel),
  getContributionsForLevel: computed(() => props.getContributionsForLevel),
  palette: computed(() => props.palette),
  onCellClick: cell => {
    emits('click:cell', cell)
  },
})

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <Card
    :id="id"
    role="region"
    :aria-labelledby="id"
    :class="cn('overflow-hidden max-w-fit', props.class)"
    v-bind="forwarded"
  >
    <TooltipProvider>
      <slot :githubProfile="profile" />
    </TooltipProvider>
  </Card>
</template>
