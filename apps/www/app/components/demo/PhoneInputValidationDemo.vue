<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PhoneInput,
  PhoneInputClear,
  PhoneInputCountrySelect,
  PhoneInputField,
  validatePhoneNumber,
  type CountryCode,
} from '@/components/ui/phone-input'
import { Label } from '~/components/ui/label'

const phone = ref('')
const country = ref<CountryCode>('US')

const validation = computed(() => {
  if (!phone.value) return 'empty'
  const result = validatePhoneNumber(phone.value, country.value)
  return result.success ? 'valid' : result.error
})

const variant = computed(() => {
  if (validation.value === 'empty') return 'default'
  if (validation.value === 'valid') return 'success'
  return 'danger'
})
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Label>Validation State</Label>
      <PhoneInput v-model="phone" v-model:country="country" :variant="variant">
        <PhoneInputCountrySelect />
        <PhoneInputField placeholder="Enter a valid phone number" />
        <PhoneInputClear />
      </PhoneInput>
    </div>
    <div class="text-sm text-muted-foreground">
      Current state:
      <span class="font-medium text-foreground">{{ validation }}</span>
    </div>
  </div>
</template>
