import type { ShowMoreRootContext } from './types'
import { createContext } from 'reka-ui'

export const [injectShowMoreRootContext, provideShowMoreRootContext] =
  createContext<ShowMoreRootContext>('ShowMoreRootContext')

export const [injectShowMoreItemContext, provideShowMoreItemContext] = createContext<{
  value: string
  isTruncated: boolean
}>('ShowMoreItemContext')

const requiredKeys: (keyof ShowMoreRootContext)[] = [
  'threshold',
  'truncationType',
  'fade',
  'forceMount',
  'showToggle',
  'open',
  'lineHeight',
]

export function useShowMoreRootContext(): ShowMoreRootContext {
  const ctx = injectShowMoreRootContext()

  if (!ctx) {
    throw new Error('[ShowMore] useShowMoreRootContext() was called outside of <ShowMore>.')
  }

  const missingKeys = requiredKeys.filter(key => ctx[key] === undefined)
  if (missingKeys.length > 0) {
    throw new Error(`[ShowMore] Missing required context property: "${missingKeys.join(', ')}".`)
  }

  return ctx
}

export function useShowMoreItemContext() {
  const ctx = injectShowMoreItemContext()
  if (!ctx) {
    throw new Error('[ShowMore] useShowMoreItemContext() was called outside of <ShowMoreItem>.')
  }

  if (!ctx.value) {
    throw new Error('[ShowMore] Missing required context property: "value" from <ShowMoreItem>.')
  }

  if (ctx.isTruncated === undefined) {
    throw new Error(
      '[ShowMore] Missing required context property: "isTruncated" from <ShowMoreItem>.',
    )
  }

  return ctx
}
