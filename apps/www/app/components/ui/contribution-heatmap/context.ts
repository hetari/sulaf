import { createContext } from 'reka-ui'
import type { HeatmapDataRootContext } from './types'

export const [injectHeatmapDataRootContext, provideHeatmapDataRootContext] =
  createContext<HeatmapDataRootContext>('HeatmapDataRootContext')

export const useHeatmapDataRootContext = () => {
  const ctx = injectHeatmapDataRootContext()

  if (!ctx) {
    throw new Error(
      '[Heatmap] Missing required context. Ensure this component is used within <Heatmap />',
    )
  }

  return ctx
}
