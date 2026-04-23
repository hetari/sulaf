import type { meterIndicatorVariants, meterTrackVariants } from './index'
import type { VariantProps } from 'class-variance-authority'

export type MeterVariantProps = VariantProps<typeof meterIndicatorVariants>
export type MeterSizeProps = VariantProps<typeof meterTrackVariants>

export type MeterProps = {
  /**
   * The variant of the meter.
   * @default default
   */
  variant?: MeterVariantProps['variant']

  /**
   * The size of the meter.
   * @default default
   */
  size?: MeterSizeProps['size']

  /**
   * The value of the meter.
   * @default 0
   */
  value?: number

  /**
   * The maximum value of the meter.
   * @default 100
   */
  max?: number

  /**
   * The minimum value of the meter.
   * @default 0
   */
  min?: number

  /**
   * The label of the meter.
   * @default undefined
   */
  label?: string
}

export type MeterRootContext = {
  variant: MeterVariantProps['variant']
  size: MeterSizeProps['size']
  value: number
  max: number
  min: number
  label: string | undefined
  percentage: `${number}%`
  meterId: string
}
