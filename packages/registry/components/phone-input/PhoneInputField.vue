<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch, type HTMLAttributes } from 'vue'
import { cn } from '@sulaf/ui/lib/utils'
import { usePhoneInputContext } from './context'
import {
  commitPhoneInputValue,
  countDigitsAfter,
  countDigitsBefore,
  detectCountryFromPhoneInput,
  formatPhoneNumber,
  formatPhoneInputAsYouType,
  parsePhone,
  sanitizePhoneInput,
  findPositionBeforeNthLastDigit,
  findPositionAfterNthDigit,
} from './utils'
import { phoneInputFieldVariants } from './index'
import { getPhoneValidationState } from './validation'
import { reactiveOmit } from '@vueuse/core'
import { useForwardProps } from 'reka-ui'

type InputMode = 'search' | 'text' | 'none' | 'numeric' | 'tel' | 'email' | 'url' | 'decimal'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement | null>(null)
const {
  value,
  country,
  variant,
  disabled,
  placeholder,
  format,
  name,
  required,
  autocomplete,
  autoDetectCountry,
  countries,
  onValueChange,
  onCountryChange,
} = usePhoneInputContext()

const displayValue = computed(() => value.value ?? '')
const validationState = computed(() => getPhoneValidationState(displayValue.value, country.value))
const isEmpty = computed(() => validationState.value === 'empty')
const isValid = computed(() => validationState.value === 'valid')
const isInvalid = computed(() => !isEmpty.value && !isValid.value)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const rawValue = target.value
  const caret = target.selectionStart ?? target.value.length

  const digitsBefore = countDigitsBefore(rawValue, caret)
  const digitsAfter = countDigitsAfter(rawValue, caret)
  const isAtEnd = caret === rawValue.length

  const sanitized = sanitizePhoneInput(rawValue)
  if (!sanitized) {
    commitPhoneInputValue(onValueChange, '')
    return
  }

  // Auto-detect country even without explicit prefix if enabled
  if (autoDetectCountry.value) {
    const detectedCountry = detectCountryFromPhoneInput(rawValue, countries.value)
    if (detectedCountry && detectedCountry !== country.value) {
      onCountryChange(detectedCountry)
    }
  }

  const formatted = formatPhoneInputAsYouType(rawValue, country.value)
  commitPhoneInputValue(onValueChange, formatted)

  nextTick(() => {
    if (!inputRef.value) return

    let nextPosition: number
    if (isAtEnd) {
      nextPosition = inputRef.value.value.length
    } else if (digitsAfter > 0) {
      nextPosition = findPositionBeforeNthLastDigit(inputRef.value.value, digitsAfter)
    } else {
      nextPosition = findPositionAfterNthDigit(inputRef.value.value, digitsBefore)
    }

    inputRef.value.setSelectionRange(nextPosition, nextPosition)
  })
}

function handleBlur() {
  const currentValue = value.value ?? ''
  const parsed = parsePhone(currentValue, country.value)
  const formatted = formatPhoneNumber(parsed, country.value, format.value)
  if (formatted) {
    commitPhoneInputValue(onValueChange, formatted)
  }
}

watch([country, format], () => {
  handleBlur()
})

const delegatedProps = reactiveOmit(props, 'class')
const delegatedAttrs = reactiveOmit(attrs, 'class')
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <input
    ref="inputRef"
    v-bind="{ ...forwarded, ...delegatedAttrs }"
    :disabled="disabled"
    :placeholder="placeholder"
    :name="name"
    :required="required"
    :autocomplete="autocomplete"
    data-slot="input-group-control"
    :value="displayValue"
    :aria-invalid="isInvalid"
    :data-country="country"
    :data-variant="variant"
    :data-format="format"
    :data-validation-state="validationState"
    :data-empty="isEmpty ? 'true' : 'false'"
    :data-valid="isValid ? 'true' : 'false'"
    :data-invalid="isInvalid ? 'true' : 'false'"
    type="tel"
    @input="handleInput"
    @blur="handleBlur"
    :class="
      cn(phoneInputFieldVariants({ variant }), props.class, attrs.class as HTMLAttributes['class'])
    "
  />
</template>
