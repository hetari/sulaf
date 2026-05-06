import { cva } from 'class-variance-authority'

export const phoneInputVariants = cva(
  'group/phone-input relative flex w-full min-w-0 items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none',
  {
    variants: {
      variant: {
        default: 'border-input dark:bg-input/30',
        success: 'border-emerald-500/30 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08]',
        warning: 'border-amber-500/30 bg-amber-500/[0.04] dark:bg-amber-500/[0.08]',
        danger: 'border-red-500/30 bg-red-500/[0.04] dark:bg-red-500/[0.08]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const phoneInputFieldVariants = cva(
  'flex h-9 min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-1 text-base shadow-none outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-0 dark:bg-transparent md:text-sm disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        success:
          'text-emerald-700 placeholder:text-emerald-500/70 dark:text-emerald-200 dark:placeholder:text-emerald-300/60',
        warning:
          'text-amber-700 placeholder:text-amber-500/70 dark:text-amber-200 dark:placeholder:text-amber-300/60',
        danger:
          'text-red-700 placeholder:text-red-500/70 dark:text-red-200 dark:placeholder:text-red-300/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const phoneInputCountrySelectVariants = cva(
  'h-9 shrink-0 justify-between gap-2 overflow-hidden rounded-none border-0 bg-transparent px-3 shadow-none hover:bg-accent/60 focus-visible:ring-0',
  {
    variants: {
      variant: {
        default: '',
        success: 'text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-200',
        warning: 'text-amber-700 hover:bg-amber-500/10 dark:text-amber-200',
        danger: 'text-red-700 hover:bg-red-500/10 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const phoneInputClearVariants = cva(
  'rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0',
  {
    variants: {
      variant: {
        default: '',
        success: 'text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-200',
        warning: 'text-amber-600 hover:bg-amber-500/10 dark:text-amber-200',
        danger: 'text-red-600 hover:bg-red-500/10 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type { CountryCode } from 'libphonenumber-js'

export { default as PhoneInput } from './PhoneInput.vue'
export { default as PhoneInputField } from './PhoneInputField.vue'
export { default as PhoneInputCountrySelect } from './PhoneInputCountrySelect.vue'
export { default as PhoneFieldCountryFlag } from './PhoneFieldCountryFlag.vue'
export { default as PhoneInputClear } from './PhoneInputClear.vue'

export type { PhoneInputVariant } from './types'
export * from './validation'
export * from './utils'
