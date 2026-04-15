import type { Easing } from 'motion-v'
import type { AccordionRootProps, AccordionRootEmits, AccordionItemProps } from 'reka-ui'

export type ShowMoreRootContext = {
  threshold: number
  truncationType: 'lines' | 'chars'
  forceMount: boolean
  fade?: boolean
  showToggle: boolean
  modelValue?: any
  open: boolean
  lineHeight: string
  animation?: {
    /**
     * Motion duration in seconds
     * @default 0.35
     */
    duration?: number

    /**
     * Easing function
     * @default 'easeInOut'
     */
    ease?: Easing
  }
}

export interface ShowMoreProps extends AccordionRootProps {
  /**
   * The number of lines or characters to show before truncating.
   * @default 3
   */
  threshold?: number

  /**
   * The type of truncation to apply. Currently only 'lines' is fully supported out of the box with motion.
   * @default 'lines'
   */
  truncationType?: 'lines' | 'chars'

  /**
   * Whether to fade out the content when collapsed.
   * @default false
   */
  fade?: boolean

  /**
   * Whether to force mount the component for calculate the height and width of the content.
   * @default true
   */
  forceMount?: boolean

  /**
   * Whether to show the toggle button.
   * @default true
   */
  showToggle?: boolean

  /**
   * Whether the component is open.
   * @default false
   */
  open?: boolean

  /**
   * The CSS line-height of the text. Used to calculate the collapsed height precisely without DOM measurements.
   * Format must be a valid CSS value (e.g., '1.5rem', '24px').
   * @default '1.5rem'
   */
  lineHeight?: string

  /**
   * Animation configuration
   * @default {
   * duration: 0.35,
   * ease: 'easeInOut',
   * initial: { height: 'auto' },
   * animate: { height: 'auto' },
   * }
   */
  animation?: {
    /**
     * Motion duration in seconds
     * @default 0.35
     */
    duration?: number

    /**
     * Easing function
     * @default 'easeInOut'
     */
    ease?: Easing
  }
}

export interface ShowMoreEmits extends AccordionRootEmits {}
export interface ShowMoreItemProps extends AccordionItemProps {}
