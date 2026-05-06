import type { CountryCode } from 'libphonenumber-js'
import type { Ref, ComputedRef } from 'vue'

export type PhoneFieldCountryFlagProps = {
  type: 'cdn' | 'unicode'
  countryCode: CountryCode
  alt: string
}

export interface PhoneInputCountrySelectProps {
  /**
   * Display the country name in the dropdown items.
   * Disabled by default.
   * @default false
   */
  showCountryName?: boolean
}

export type PhoneFormat = 'international' | 'national' | 'e164'
export type PhoneInputVariant = 'default' | 'success' | 'warning' | 'danger'

export interface CountryOption {
  /**
   * Country code
   * @example
   * "US"
   */
  code: CountryCode
  /**
   * Country name
   * @example
   * "United States"
   */
  label: string
  /**
   * Country calling code
   * @example
   * "1"
   */
  callingCode: string
  /**
   * Country flag
   * @example
   * "🇺🇸"
   */
  flag: string
  searchText: string
}

export interface PhoneInputProps {
  /**
   * Phone number
   * @example
   * "1234567890"
   */
  modelValue?: string
  /**
   * Country code
   * @example
   * "US"
   */
  country?: CountryCode
  /**
   * Default country
   * @example
   * "US"
   */
  defaultCountry?: CountryCode
  /**
   * List of countries to display in the dropdown
   * If not provided, all countries will be displayed
   * @example
   * [
   *  { code: "US", label: "United States", callingCode: "1", flag: "🇺🇸", searchText: "United States" },
   *  { code: "CA", label: "Canada", callingCode: "1", flag: "🇨🇦", searchText: "Canada" },
   * ]
   */
  countries?: CountryOption[]
  /**
   * Disable the phone input
   * @example
   * true
   */
  disabled?: boolean
  /**
   * Visual variant for the phone input.
   * @default default
   */
  variant?: PhoneInputVariant
  /**
   * Placeholder for the phone input
   * @example
   * "Phone number"
   */
  placeholder?: string
  /**
   * Format of the phone number
   * @example
   * "international"
   */
  format?: PhoneFormat
  /**
   * Locale for the phone input.
   * Defaults to the browser language when not provided.
   * @example
   * "en"
   */
  locale?: string
  /**
   * Name for the phone input
   * @example
   * "phone"
   */
  name?: string
  /**
   * Required for the phone input
   * @example
   * true
   */
  required?: boolean
  /**
   * Autocomplete for the phone input
   * @example
   * "tel"
   */
  autocomplete?: string
  /**
   * Automatically switch the country when the entered number reveals a different country.
   * Enabled by default.
   * @example
   * true
   */
  autoDetectCountry?: boolean
}

export type PhoneInputEmits = {
  'update:modelValue': [payload: string | undefined]
  'update:country': [payload: CountryCode]
  'onCountryChange': [payload: CountryCode]
  'onClear': []
}

export type PhoneInputContext = {
  value: Ref<string | undefined>
  country: Ref<CountryCode>
  variant: Ref<PhoneInputVariant>
  disabled: Ref<boolean>
  placeholder: Ref<string>
  format: Ref<PhoneFormat>
  locale: Ref<string>
  name: Ref<string>
  required: Ref<boolean>
  autocomplete: Ref<string>
  autoDetectCountry: Ref<boolean>
  countries: ComputedRef<CountryOption[]>
  onCountryChange: (code: CountryCode) => void
  onValueChange: (value: string | undefined) => void
  onClear: () => void
}
