import parsePhoneNumber, {
  type CountryCode,
  ParseError,
  parsePhoneNumberWithError,
} from 'libphonenumber-js'

export type PhoneValidationError =
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'INVALID_COUNTRY'
  | 'INVALID_NUMBER'
  | 'INVALID_FORMAT'

export type PhoneValidationResult =
  | {
      success: true
    }
  | {
      success: false
      error: PhoneValidationError
    }

export type PhoneValidationState = 'empty' | 'valid' | PhoneValidationError

export function getPhoneValidationState(
  phone: string,
  country?: CountryCode,
): PhoneValidationState {
  if (!phone.trim()) {
    return 'empty'
  }

  const result = validatePhoneNumber(phone, country)
  return result.success ? 'valid' : result.error
}

export function validatePhoneNumber(phone: string, country?: CountryCode): PhoneValidationResult {
  const trimmed = phone.trim()
  if (!trimmed) {
    return { success: true }
  }

  try {
    const parsed = parsePhoneNumberWithError(trimmed, country)
    return parsed.isValid() ? { success: true } : { success: false, error: 'INVALID_NUMBER' }
  } catch (error) {
    if (error instanceof ParseError) {
      switch (error.message) {
        case 'TOO_SHORT':
          return { success: false, error: 'TOO_SHORT' }
        case 'TOO_LONG':
          return { success: false, error: 'TOO_LONG' }
        case 'INVALID_COUNTRY':
          return { success: false, error: 'INVALID_COUNTRY' }
        case 'NOT_A_NUMBER':
          return { success: false, error: 'INVALID_FORMAT' }
        default:
          return { success: false, error: 'INVALID_NUMBER' }
      }
    }

    return { success: false, error: 'INVALID_NUMBER' }
  }
}

export function isValidPhoneNumber(phone: string): boolean {
  const trimmed = phone.trim()
  if (!trimmed) {
    return false
  }

  const parsed = parsePhoneNumber(trimmed)
  return parsed?.isValid() ?? false
}

export function isValidPhoneNumberForCountry(phone: string, country: string): boolean {
  const trimmed = phone.trim()
  if (!trimmed) {
    return false
  }

  const parsed = parsePhoneNumber(trimmed, country as CountryCode)
  return parsed?.isValid() ?? false
}
