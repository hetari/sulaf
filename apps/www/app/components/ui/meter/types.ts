import type { meterIndicatorVariants, meterTrackVariants } from './index'
import type { VariantProps } from 'class-variance-authority'

export type MeterVariantProps = VariantProps<typeof meterIndicatorVariants>
export type MeterSizeProps = VariantProps<typeof meterTrackVariants>

import type { Ref, ComputedRef } from 'vue'

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
  variant: Ref<MeterVariantProps['variant']>
  size: Ref<MeterSizeProps['size']>
  value: Ref<number>
  max: Ref<number>
  min: Ref<number>
  label: Ref<string | undefined>
  percentage: ComputedRef<`${number}%`>
  meterId: ComputedRef<string>
}
