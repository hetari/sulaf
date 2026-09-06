import { ref } from 'vue'
import type { Ref } from 'vue'
import { clampValue } from './utils'

export interface UseCounterOptions {
  min?: number
  max?: number
}

export function useCounter(
  initial = 0,
  opts: UseCounterOptions = {},
): {
  count: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
} {
  const count = ref(clampValue(initial, opts.min, opts.max))

  const increment = () => {
    count.value = clampValue(count.value + 1, opts.min, opts.max)
  }

  const decrement = () => {
    count.value = clampValue(count.value - 1, opts.min, opts.max)
  }

  const reset = () => {
    count.value = clampValue(initial, opts.min, opts.max)
  }

  return { count, increment, decrement, reset }
}
