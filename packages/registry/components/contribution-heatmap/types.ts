export type HeatmapProps = {
  /**
   * The start date of the heatmap.
   * @default start of the current year
   */
  startDate?: Date
  /**
   * The end date of the heatmap.
   * @default end of the current year
   */
  endDate?: Date
  /**
   * Optional data to populate the heatmap cells. Key is ISO date string (YYYY-MM-DD), value is contribution count.
   * Example: `{ "2024-01-01": 5, "2024-01-02": 10 }`
   * @default {}
   */
  data?: Record<string, number>
  /**
   * Number of rows in the heatmap grid (typically 7 for days of the week).
   * @default 7
   */
  rows?: number
  /**
   * Number of columns in the heatmap grid.
   * @default 52
   */
  cols?: number
  /**
   * Maximum level of contributions (e.g., 4 for 0-4 levels).
   * @default 4
   */
  maxLevel?: number
  /**
   * Github username to fetch contributions for.
   * @default undefined
   */
  githubUsername?: string
  /**
   * Function to determine the contribution level for a given count.
   * @param count - The number of contributions.
   * @returns The level (0 to maxLevel).
   * @default (count) => Math.min(Math.floor(count / 2), maxLevel)
   */
  getLevel?: (count: number) => number
  /**
   * Function to determine the contribution count for a given level and index.
   * @param level - The contribution level.
   * @param index - The index of the level.
   * @returns The minimum contributions for this level.
   * @default (level) => level * 2
   */
  getContributionsForLevel?: (level: number, index: number) => number
}

export type HeatmapCellProps = {
  /**
   * The data for the individual heatmap cell.
   */
  cell: HeatmapCellProp
}

export type HeatmapLegendProps = {
  /**
   * Optional label text shown on the left (e.g. "Learn how we count contributions").
   */
  label?: string
}

export type HeatmapWeekdaysProps = {
  /**
   * Whether to show all weekday labels or just the standard ones (Mon, Wed, Fri).
   * @default false
   */
  showAll?: boolean
}

export type HeatmapEmits = {
  /**
   * Fired when a cell is clicked.
   * @property cell - The data of the clicked cell.
   */
  'click:cell': [cell: HeatmapCellProp]
}

export interface GitHubProfile {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  location: string | null
  blog: string | null
  company: string | null
  followers: number
  following: number
  public_repos: number
  public_gists: number
  twitter_username: string | null
  html_url: string
}

import type { ComputedRef, Ref, ShallowRef } from 'vue'

export type HeatmapDataRootContext = {
  /** The unique ID of the heatmap. */
  id: string
  /** The start date used for the grid. */
  startDate: ComputedRef<Date> | Ref<Date>
  /** The end date used for the grid. */
  endDate: ComputedRef<Date> | Ref<Date>
  /** The flat list of all cells in the heatmap. */
  cells: ComputedRef<HeatmapCellProp[]> | Ref<HeatmapCellProp[]>
  /** The contribution data mapping. */
  data: ComputedRef<Record<string, number>> | Ref<Record<string, number>>
  /** Total contributions count. */
  totalContributions: ComputedRef<number | undefined> | Ref<number | undefined>
  /** Whether the data is currently loading. */
  isLoading: ComputedRef<boolean> | Ref<boolean>
  /** Whether there was an error fetching data. */
  isError: ComputedRef<boolean> | Ref<boolean>
  /** The GitHub user profile data. */
  profile?: ShallowRef<GitHubProfile | null>
  /** Number of rows in the grid. */
  rows: ComputedRef<number> | Ref<number>
  /** Number of columns in the grid. */
  cols: ComputedRef<number> | Ref<number>
  /** Milliseconds in a day. */
  dayMs: number
  /** Maximum contribution level. */
  maxLevel: ComputedRef<number> | Ref<number>
  /** Function to calculate level from count. */
  getLevel: ComputedRef<(count: number) => number> | Ref<(count: number) => number>
  /** Function to calculate count from level. */
  getContributionsForLevel:
    | ComputedRef<(level: number, index: number) => number>
    | Ref<(level: number, index: number) => number>
  /** Optional click handler for cells. */
  onCellClick?: (cell: HeatmapCellProp) => void
}

export type HeatmapCellProp = {
  /** ISO date string key (YYYY-MM-DD). */
  key: string
  /** Row index in the grid. */
  row: number
  /** Column index in the grid. */
  col: number
  /** The actual Date object. */
  date: Date
  /** Formatted date label (e.g. "Jan 1, 2024"). */
  dateLabel: string
  /** Formatted weekday label (e.g. "Mon"). */
  weekdayLabel: string
  /** Number of contributions on this day. */
  contributions: number
  /** The calculated level for this day. */
  level: number
}
