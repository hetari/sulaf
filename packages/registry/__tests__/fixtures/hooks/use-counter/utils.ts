export function clampValue(val: number, min?: number, max?: number): number {
  if (min !== undefined && val < min) return min
  if (max !== undefined && val > max) return max
  return val
}
