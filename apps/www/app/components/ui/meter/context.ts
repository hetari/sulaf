import { createContext } from 'reka-ui'
import type { MeterRootContext } from './types'

export const [injectMeterRootContext, provideMeterRootContext] =
  createContext<MeterRootContext>('MeterRootContext')

export const useMeterRootContext = () => {
  const requiredKeys: (keyof MeterRootContext)[] = [
    'variant',
    'size',
    'value',
    'max',
    'min',
    'percentage',
    'meterId',
  ]

  const ctx = injectMeterRootContext()
  if (!ctx) {
    throw new Error('[Meter] useMeterRootContext must be used within a MeterRoot')
  }

  const missingKeys = requiredKeys.filter(key => ctx[key] === undefined)
  if (missingKeys.length > 0) {
    throw new Error(
      `[Meter] Missing required context ${missingKeys.length === 1 ? 'property' : 'properties'}: ${missingKeys.map(k => `"${k}"`).join(', ')}.`,
    )
  }

  return ctx
}
