import { getActualStartDate, getActualEndDate, createHeatmapCells } from './utils'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useGithubProfile } from '@/hooks/use-github-profile'

interface UseHeatmapOptions {
  githubUsername: MaybeRefOrGetter<string | undefined>
  data: MaybeRefOrGetter<Record<string, number>>
  startDate?: MaybeRefOrGetter<Date | undefined>
  endDate?: MaybeRefOrGetter<Date | undefined>
  rows: MaybeRefOrGetter<number>
  cols: MaybeRefOrGetter<number>
  maxLevel: MaybeRefOrGetter<number>
  getLevel: MaybeRefOrGetter<(count: number) => number>
  dayMs: number
}

/**
 * Main composable for the contribution heatmap.
 * Handles data fetching (GitHub or local), date range normalization, and cell generation.
 */
export function useHeatmap(options: UseHeatmapOptions) {
  const resolvedUsername = computed(() => toValue(options.githubUsername))
  const resolvedData = computed(() => toValue(options.data))
  const resolvedStartDate = computed(() => toValue(options.startDate))
  const resolvedEndDate = computed(() => toValue(options.endDate))
  const resolvedRows = computed(() => toValue(options.rows))
  const resolvedCols = computed(() => toValue(options.cols))
  const resolvedMaxLevel = computed(() => toValue(options.maxLevel))
  const resolvedGetLevel = computed(() => toValue(options.getLevel))

  const {
    profile,
    contributionData: githubContributionData,
    totalContributions: githubTotalContributions,
    isLoading: isGithubLoading,
    isError: isGithubError,
  } = useGithubProfile(resolvedUsername)

  const actualStartDate = computed(() => {
    if (resolvedStartDate.value) return resolvedStartDate.value
    if (resolvedUsername.value) {
      const d = new Date()
      d.setFullYear(d.getFullYear() - 1)
      d.setHours(0, 0, 0, 0)
      return d
    }
    return getActualStartDate(resolvedStartDate.value)
  })

  const actualEndDate = computed(() => {
    if (resolvedEndDate.value) return resolvedEndDate.value
    if (resolvedUsername.value) {
      const d = new Date()
      d.setHours(23, 59, 59, 999)
      return d
    }
    return getActualEndDate(resolvedEndDate.value)
  })

  const isLoading = computed(() => isGithubLoading.value)
  const isError = computed(() => isGithubError.value)

  const contributionData = computed(() => {
    if (resolvedUsername.value) {
      return githubContributionData.value
    }
    return resolvedData.value
  })

  const totalContributions = computed(() => {
    if (resolvedUsername.value) {
      return githubTotalContributions.value
    }
    return Object.values(contributionData.value).reduce((a, b) => a + b, 0)
  })

  const cells = computed(() =>
    createHeatmapCells({
      startDate: actualStartDate.value,
      endDate: actualEndDate.value,
      data: contributionData.value,
      rows: resolvedRows.value,
      cols: resolvedCols.value,
      dayMs: options.dayMs,
      maxLevel: resolvedMaxLevel.value,
      getLevel: resolvedGetLevel.value,
    }),
  )

  return {
    actualStartDate,
    actualEndDate,
    contributionData,
    totalContributions,
    isLoading,
    isError,
    profile,
    cells,
  }
}
