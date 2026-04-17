import { cva } from 'class-variance-authority'

export const meterVariants = cva('relative flex flex-col w-full gap-2')

export const meterTrackVariants = cva(
  'relative w-full overflow-hidden bg-secondary will-change-transform transition-all duration-300 ease-in-out',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        default: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)
export const meterIndicatorVariants = cva(
  'absolute h-full left-0 top-0 will-change-[color] transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const meterHeaderVariants = cva('flex w-full items-center justify-between')

export { default as Meter } from './Meter.vue'
export { default as MeterHeader } from './MeterHeader.vue'
export { default as MeterIndicator } from './MeterIndicator.vue'
export { default as MeterLabel } from './MeterLabel.vue'
export { default as MeterTrack } from './MeterTrack.vue'
export { default as MeterValue } from './MeterValue.vue'

export type { MeterProps, MeterRootContext } from './types'
export { useMeterRootContext } from './context'
