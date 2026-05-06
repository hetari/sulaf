import parsePhoneNumber, {
  AsYouType,
  type CountryCode,
  type PhoneNumber,
  getCountries,
  getCountryCallingCode,
  parseIncompletePhoneNumber,
} from 'libphonenumber-js'
import type { CountryOption } from './types'

export type PhoneFormat = 'international' | 'national' | 'e164'

export function sanitizePhoneInput(value: string): string {
  return parseIncompletePhoneNumber(value)
}

export function normalizePhoneInput(value: string): string {
  const sanitized = sanitizePhoneInput(value)
  if (sanitized.startsWith('00')) {
    return `+${sanitized.slice(2)}`
  }

  return sanitized
}

export function normalizePhoneWithCountry(value: string, countryCode: CountryCode): string {
  const normalized = normalizePhoneInput(value)
  if (normalized.startsWith('+')) {
    return normalized
  }

  const callingCode = getCountryCallingCode(countryCode)
  if (normalized.startsWith(callingCode)) {
    return `+${normalized}`
  }

  return normalized
}

export function parsePhone(value: string, countryCode: CountryCode): PhoneNumber | null {
  const normalized = normalizePhoneWithCountry(value, countryCode)
  if (!normalized) {
    return null
  }

  try {
    return parsePhoneNumber(normalized, countryCode) ?? null
  } catch {
    return null
  }
}

export function formatPhoneNumber(
  phone: PhoneNumber | null,
  countryCode: CountryCode,
  format: PhoneFormat,
): string | null {
  if (!phone) {
    return null
  }

  switch (format) {
    case 'e164':
      return phone.number
    case 'national':
      return phone.formatNational()
    case 'international':
    default:
      return phone.formatInternational()
  }
}

export function countDigitsBefore(value: string, position: number): number {
  let count = 0
  for (let index = 0; index < Math.min(position, value.length); index += 1) {
    if (/\d/.test(value[index] ?? '')) {
      count += 1
    }
  }
  return count
}

export function countDigitsAfter(value: string, position: number): number {
  let count = 0
  for (let index = position; index < value.length; index += 1) {
    if (/\d/.test(value[index] ?? '')) {
      count += 1
    }
  }
  return count
}

export function countPrefixDigitsAdded(sanitized: string, formatted: string): number {
  const sanitizedPrefix = sanitized.match(/^\D*/)?.[0].length ?? 0
  const formattedPrefix = formatted.match(/^\D*/)?.[0].length ?? 0
  return formattedPrefix - sanitizedPrefix
}

export function findPositionAfterNthDigit(value: string, n: number): number {
  if (n <= 0) {
    return 0
  }

  let digitsSeen = 0
  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index] ?? '')) {
      digitsSeen += 1
      if (digitsSeen === n) {
        return index + 1
      }
    }
  }

  return value.length
}

export function findPositionBeforeNthLastDigit(value: string, n: number): number {
  if (n <= 0) {
    return value.length
  }

  let digitsSeen = 0
  for (let index = value.length - 1; index >= 0; index -= 1) {
    if (/\d/.test(value[index] ?? '')) {
      digitsSeen += 1
      if (digitsSeen === n) {
        return index
      }
    }
  }

  return 0
}

export function isFormattingCharacter(char: string): boolean {
  return char.length > 0 && !/\d/.test(char) && char !== '+'
}

export function findPreviousDigitIndex(value: string, position: number): number {
  for (let index = Math.min(position - 1, value.length - 1); index >= 0; index -= 1) {
    if (/\d/.test(value[index] ?? '')) {
      return index
    }
  }
  return -1
}

export function removeDigitAtIndex(value: string, digitIndex: number): string {
  if (digitIndex < 0 || digitIndex >= value.length) {
    return value
  }

  if (!/\d/.test(value[digitIndex] ?? '')) {
    return value
  }

  return value.slice(0, digitIndex) + value.slice(digitIndex + 1)
}

export function detectCountryFromPhoneInput(
  value: string,
  countryOptions?: Pick<CountryOption, 'code' | 'callingCode'>[],
): CountryCode | null {
  const sanitized = normalizePhoneInput(value)
  if (!sanitized) {
    return null
  }

  if (sanitized.startsWith('+')) {
    const formatter = new AsYouType()
    formatter.input(sanitized)
    return formatter.getCountry() ?? formatter.getNumber()?.country ?? null
  }

  const digits = sanitized.replace(/\D/g, '')
  if (digits.length < 2) {
    return null
  }

  const countries = countryOptions?.length
    ? countryOptions
    : getCountries().map(code => ({
        code,
        callingCode: getCountryCallingCode(code),
      }))

  const match = [...countries]
    .sort((a, b) => b.callingCode.length - a.callingCode.length)
    .find(
      option => digits.length >= option.callingCode.length && digits.startsWith(option.callingCode),
    )

  return match?.code ?? null
}

export function formatPhoneInputAsYouType(raw: string, countryCode: CountryCode): string {
  const normalized = normalizePhoneWithCountry(raw, countryCode)
  if (!normalized) {
    return ''
  }

  const formatter = new AsYouType(countryCode)
  return formatter.input(normalized)
}

export function commitPhoneInputValue(
  onValueChange: (value: string | undefined) => void,
  nextValue: string,
) {
  onValueChange(nextValue || undefined)
}

export function restoreCaretPosition(
  input: HTMLInputElement | null,
  digitsBefore: number,
  findPosition = findPositionAfterNthDigit,
) {
  if (!input) {
    return
  }

  const nextPosition = findPosition(input.value, digitsBefore)
  input.setSelectionRange(nextPosition, nextPosition)
}

export function buildCountryOptions(locale = 'en'): CountryOption[] {
  const displayNames =
    typeof Intl !== 'undefined' && 'DisplayNames' in Intl
      ? new Intl.DisplayNames([locale], { type: 'region' })
      : null

  return getCountries()
    .map(code => {
      const callingCode = getCountryCallingCode(code)
      const label = displayNames?.of(code) ?? code
      const flag = getFlagUnicode(code)
      return {
        code,
        label,
        callingCode,
        flag,
        searchText: [label, code, callingCode].join(' ').toLowerCase(),
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label, locale))
}

export function getFlagUnicode(countryCode: CountryCode): string {
  const codePoints = [...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
