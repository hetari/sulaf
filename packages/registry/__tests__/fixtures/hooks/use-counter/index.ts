import { ref } from 'vue'
import type { Ref } from 'vue'

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
  const count = ref(initial)

  const increment = () => {
    if (opts.max !== undefined && count.value >= opts.max) return
    count.value++
  }

  const decrement = () => {
    if (opts.min !== undefined && count.value <= opts.min) return
    count.value--
  }

  const reset = () => {
    count.value = initial
  }

  return { count, increment, decrement, reset }
}
