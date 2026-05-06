<script setup lang="ts">
import { ref } from 'vue'
import {
  PhoneInput,
  PhoneInputClear,
  PhoneInputCountrySelect,
  PhoneInputField,
  type CountryCode,
} from '@/components/ui/phone-input'

const phone = ref('')
const country = ref<CountryCode>('US')
</script>

<template>
  <div class="w-full max-w-sm">
    <PhoneInput v-model="phone" v-model:country="country">
      <PhoneInputCountrySelect />
      <PhoneInputField placeholder="Phone number" />
      <PhoneInputClear />
    </PhoneInput>
  </div>
</template>
