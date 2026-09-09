<script setup lang="ts">
import {
  computed,
  ref,
  toRef,
  useId,
  type ComponentPublicInstance,
  type HTMLAttributes,
  type Ref,
} from 'vue'
import type { CountryCode } from 'libphonenumber-js'
import { useNavigatorLanguage } from '@vueuse/core'
import { InputGroup } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { providePhoneInputContext } from './context'
import { buildCountryOptions, formatPhoneNumber, parsePhone } from './utils'
import { getPhoneValidationState } from './validation'
import type { PhoneInputEmits, PhoneInputProps } from './types'
import { phoneInputVariants } from './index'

const elementId = useId()

const props = withDefaults(
  defineProps<
    PhoneInputProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    defaultCountry: 'YE',
    variant: 'default',
    placeholder: 'Phone number',
    format: 'national',
    name: 'phone',
    disabled: false,
    required: false,
    autocomplete: 'tel',
    autoDetectCountry: true,
  },
)

const emits = defineEmits<PhoneInputEmits>()

const rootRef = ref<HTMLElement | null>(null)

function setRootRef(instance: Element | ComponentPublicInstance | null) {
  rootRef.value =
    instance instanceof HTMLElement
      ? instance
      : (((instance as ComponentPublicInstance | null)?.$el as HTMLElement | null) ?? null)
}

const modelValue = defineModel<string>()
const country = defineModel<CountryCode>('country')

if (!country.value) {
  country.value = props.defaultCountry ?? 'YE'
}

const disabled = toRef(props, 'disabled')
const variant = toRef(props, 'variant')
const format = toRef(props, 'format')
const placeholder = toRef(props, 'placeholder')
const name = toRef(props, 'name')
const required = toRef(props, 'required')
const autocomplete = toRef(props, 'autocomplete')
const autoDetectCountry = toRef(props, 'autoDetectCountry')

const browserLanguage = useNavigatorLanguage()
const locale = computed(() => {
  const explicitLocale = props.locale?.trim()
  if (explicitLocale) {
    return explicitLocale
  }

  const browserLocale = browserLanguage.language.value?.trim()
  return browserLocale || 'en'
})

const countries = computed(() => props.countries ?? buildCountryOptions(locale.value))
const validationState = computed(() =>
  getPhoneValidationState(modelValue.value ?? '', country.value),
)
const isEmpty = computed(() => validationState.value === 'empty')
const isValid = computed(() => validationState.value === 'valid')
const isInvalid = computed(() => !isEmpty.value && !isValid.value)

function formatCurrentValue(nextCountry: CountryCode = country.value!) {
  const currentValue = modelValue.value ?? ''
  const parsed = parsePhone(currentValue, nextCountry)
  if (!parsed) {
    return currentValue || undefined
  }

  return formatPhoneNumber(parsed, nextCountry, format.value) ?? currentValue
}

const onCountryChange = (code: CountryCode) => {
  country.value = code
  const formatted = formatCurrentValue(code)
  if (formatted !== undefined) {
    modelValue.value = formatted
  }
  emits('onCountryChange', code)
}

const onValueChange = (val: string | undefined) => {
  modelValue.value = val
}

const onClear = () => {
  modelValue.value = ''
  emits('onClear')
}

providePhoneInputContext({
  rootRef,
  value: modelValue,
  country: country as Ref<CountryCode>,
  variant,
  countries,
  disabled,
  format,
  locale,
  name,
  required,
  autocomplete,
  autoDetectCountry,
  placeholder,
  onCountryChange,
  onValueChange,
  onClear,
})
</script>

<template>
  <InputGroup
    :ref="setRootRef"
    :id="elementId"
    data-slot="phone-input"
    :data-country="country"
    :data-variant="variant"
    :data-format="format"
    :data-validation-state="validationState"
    :data-empty="isEmpty ? 'true' : 'false'"
    :data-valid="isValid ? 'true' : 'false'"
    :data-invalid="isInvalid ? 'true' : 'false'"
    :data-disabled="disabled ? 'true' : 'false'"
    :class="cn(phoneInputVariants({ variant }), props.class)"
  >
    <slot />
  </InputGroup>
</template>
