import { startOfWeek, formatHeatmapDate, getActualStartDate, getActualEndDate } from './utils'
import type { HeatmapCellProp, GitHubProfile } from './types'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useFetch } from '@vueuse/core'

/**
 * Options for creating heatmap cells.
 */
interface CreateHeatmapCellsOptions {
  /** The start date for the heatmap range. */
  startDate: Date
  /** The end date for the heatmap range. */
  endDate: Date
  /** The contribution data mapping. */
  data: Record<string, number>
  /** Number of rows in the grid. */
  rows: number
  /** Number of columns in the grid. */
  cols: number
  /** Milliseconds in a day. */
  dayMs: number
  /** Maximum level of contributions. */
  maxLevel: number
  /** Function to determine the level for a count. */
  getLevel: (count: number) => number
}

/**
 * Composable for managing heatmap cell generation.
 */
export function useHeatmap() {
  /**
   * Generates a flat array of cell data for the heatmap grid.
   */
  const createHeatmapCells = (options: CreateHeatmapCellsOptions): HeatmapCellProp[] => {
    const { startDate, endDate, data, rows, cols, dayMs, getLevel } = options
    const cells: HeatmapCellProp[] = []

    const gridStart = startOfWeek(startDate)
    let currentCol = 0
    const currentDay = new Date(gridStart)
    currentDay.setHours(0, 0, 0, 0)

    const endTime = endDate.getTime()

    while (currentCol < cols) {
      const row = currentDay.getDay()

      if (row < rows) {
        const dateKey = formatHeatmapDate(currentDay, 'key')
        const count = data[dateKey] || 0

        cells.push({
          key: dateKey,
          date: new Date(currentDay),
          row,
          col: currentCol,
          contributions: count,
          level: getLevel(count),
          dateLabel: formatHeatmapDate(currentDay, 'label'),
          weekdayLabel: formatHeatmapDate(currentDay, 'weekday'),
        })
      }

      currentDay.setDate(currentDay.getDate() + 1)
      if (currentDay.getDay() === 0) {
        currentCol++
      }

      // Safety break to prevent infinite loops if misconfigured
      if (currentDay.getTime() > endTime + dayMs * 7) {
        break
      }
    }

    return cells
  }

  return {
    createHeatmapCells,
  }
}

interface UseContributionDataOptions {
  githubUsername: MaybeRefOrGetter<string | undefined>
  data: MaybeRefOrGetter<Record<string, number>>
  startDate?: MaybeRefOrGetter<Date | undefined>
  endDate?: MaybeRefOrGetter<Date | undefined>
}

export function useContributionData(options: UseContributionDataOptions) {
  const resolvedUsername = computed(() => toValue(options.githubUsername))
  const resolvedData = computed(() => toValue(options.data))
  const resolvedStartDate = computed(() => toValue(options.startDate))
  const resolvedEndDate = computed(() => toValue(options.endDate))

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

  const fetchUrl = computed(() =>
    resolvedUsername.value
      ? `https://github-contributions-api.deno.dev/${resolvedUsername.value}.json`
      : '',
  )

  const {
    data: fetchedData,
    isFetching,
    error: fetchError,
  } = useFetch(fetchUrl, { refetch: true }).get().json<{
    contributions: Array<
      Array<{ date: string; contributionCount: number; color?: string; contributionLevel?: string }>
    >
    total?: { lastYear?: number; [year: string]: number | undefined }
  }>()

  const profileUrl = computed(() =>
    resolvedUsername.value ? `https://api.github.com/users/${resolvedUsername.value}` : '',
  )

  const { data: profileData } = useFetch(profileUrl, { refetch: true }).get().json<GitHubProfile>()

  const isLoading = computed(() => isFetching.value)

  const isError = computed(() => !!fetchError.value)

  const contributionData = computed(() => {
    if (resolvedUsername.value && fetchedData.value?.contributions) {
      return fetchedData.value.contributions.flat().reduce(
        (acc, curr) => {
          acc[curr.date] = curr.contributionCount
          return acc
        },
        {} as Record<string, number>,
      )
    }
    return resolvedData.value
  })

  const totalContributions = computed(() => {
    if (resolvedUsername.value && fetchedData.value?.total) {
      return fetchedData.value.total.lastYear
    }
    return Object.values(contributionData.value).reduce((a, b) => a + b, 0)
  })

  return {
    actualStartDate,
    actualEndDate,
    contributionData,
    totalContributions,
    isLoading,
    isError,
    profile: profileData,
  }
}
