import { createContext } from 'reka-ui'
import type { PhoneInputContext } from './types'

export const [injectPhoneInputContext, providePhoneInputContext] =
  createContext<PhoneInputContext>('PhoneInputContext')

export const usePhoneInputContext = () => {
  const requiredKeys: (keyof PhoneInputContext)[] = [
    'autocomplete',
    'countries',
    'country',
    'disabled',
    'format',
    'locale',
    'name',
    'onClear',
    'onCountryChange',
    'onValueChange',
    'placeholder',
    'variant',
    'required',
    'value',
  ]

  const ctx = injectPhoneInputContext()
  if (!ctx) {
    throw new Error('[PhoneInput] usePhoneInputContext must be used within a PhoneInput')
  }

  const missingKeys = requiredKeys.filter(key => ctx[key] === undefined)
  if (missingKeys.length > 0) {
    throw new Error(
      `[PhoneInput] Missing required context ${missingKeys.length === 1 ? 'property' : 'properties'}: ${missingKeys.map(k => `"${k}"`).join(', ')}.`,
    )
  }

  return ctx
}
