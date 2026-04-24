import type { HeatmapCellProp } from './types'
import { useDateFormat } from '@vueuse/core'

/**
 * Returns the date for the start of the week (Sunday) for a given date.
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

/**
 * Groups a flat list of heatmap cells into a 2D array [row][col].
 */
export function groupCellsByRow(cells: HeatmapCellProp[], rows: number): HeatmapCellProp[][] {
  const grid: HeatmapCellProp[][] = Array.from({ length: rows }, () => [])
  for (const cell of cells) {
    if (cell.row < rows) {
      grid[cell.row]!.push(cell)
    }
  }
  return grid
}

/**
 * Generates month markers based on the first cell of each column.
 */
export function getMonthMarkers(cells: HeatmapCellProp[], cols: number): (string | null)[] {
  const labels: (string | null)[] = Array.from({ length: cols }, () => null)
  let lastMonth = -1

  for (let col = 0; col < cols; col++) {
    const cell = cells.find(c => c.col === col && c.row === 0)
    if (cell) {
      const month = cell.date.getMonth()
      if (month !== lastMonth) {
        labels[col] = cell.date.toLocaleString('default', { month: 'short' })
        lastMonth = month
      }
    }
  }

  return labels
}

/**
 * Generates weekday labels based on the number of rows and display preference.
 */
export function getWeekdayLabels(rows: number, showAll: boolean): string[] {
  const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  if (rows !== 7) return []
  return WEEKDAY_LABELS.map((day, index) => {
    if (showAll) return day
    // Standard heatmap style: Mon, Wed, Fri
    return [1, 3, 5].includes(index) ? day : ''
  })
}

/**
 * Formats a date for heatmap keys and labels.
 */
export function formatHeatmapDate(date: Date, format: 'key' | 'label' | 'weekday' = 'key'): string {
  if (format === 'key') return useDateFormat(date, 'YYYY-MM-DD').value
  if (format === 'label') return useDateFormat(date, 'MMM D, YYYY').value
  return useDateFormat(date, 'ddd').value
}

/**
 * Calculates the actual start date for the heatmap, defaulting to the start of the current year.
 */
export function getActualStartDate(startDate?: Date): Date {
  if (startDate) return startDate
  const d = new Date()
  d.setMonth(0, 1)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Calculates the actual end date for the heatmap, defaulting to the end of the current year.
 */
export function getActualEndDate(endDate?: Date): Date {
  if (endDate) return endDate
  const d = new Date()
  d.setMonth(11, 31)
  d.setHours(23, 59, 59, 999)
  return d
}

export function getLevels(
  maxLevel: number,
  getContributionsForLevel: (level: number, index: number) => number,
) {
  return Array.from({ length: maxLevel + 1 }, (_, i) => ({
    level: i,
    contributions: getContributionsForLevel(i, 0),
  }))
}

/**
 * Options for creating heatmap cells.
 */
export interface CreateHeatmapCellsOptions {
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
 * Generates a flat array of cell data for the heatmap grid.
 */
export function createHeatmapCells(options: CreateHeatmapCellsOptions): HeatmapCellProp[] {
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
