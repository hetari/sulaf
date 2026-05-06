<script setup lang="ts">
import { ref } from 'vue'
import {
  PhoneInput,
  PhoneInputClear,
  PhoneInputCountrySelect,
  PhoneInputField,
  type CountryCode,
} from '@/components/ui/phone-input'
import { Label } from '~/components/ui/label'

const phone = ref('+1 415 555 2671')
const country = ref<CountryCode>('US')
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <Label>Disabled</Label>
    <PhoneInput v-model="phone" v-model:country="country" disabled>
      <PhoneInputCountrySelect />
      <PhoneInputField placeholder="Phone number" />
      <PhoneInputClear />
    </PhoneInput>
  </div>
</template>
