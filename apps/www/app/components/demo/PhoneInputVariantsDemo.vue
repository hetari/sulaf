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

const phone1 = ref('+1 415 555 2671')
const country1 = ref<CountryCode>('US')

const phone2 = ref('+1 415 555 2671')
const country2 = ref<CountryCode>('US')

const phone3 = ref('+1 415 555 2671')
const country3 = ref<CountryCode>('US')

const phone4 = ref('+1 415 555 2671')
const country4 = ref<CountryCode>('US')
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-6">
    <div class="flex flex-col gap-2">
      <Label>Default</Label>
      <PhoneInput v-model="phone1" v-model:country="country1" variant="default">
        <PhoneInputCountrySelect />
        <PhoneInputField placeholder="Phone number" />
        <PhoneInputClear />
      </PhoneInput>
    </div>

    <div class="flex flex-col gap-2">
      <Label>Success</Label>
      <PhoneInput v-model="phone2" v-model:country="country2" variant="success">
        <PhoneInputCountrySelect />
        <PhoneInputField placeholder="Phone number" />
        <PhoneInputClear />
      </PhoneInput>
    </div>

    <div class="flex flex-col gap-2">
      <Label>Warning</Label>
      <PhoneInput v-model="phone3" v-model:country="country3" variant="warning">
        <PhoneInputCountrySelect />
        <PhoneInputField placeholder="Phone number" />
        <PhoneInputClear />
      </PhoneInput>
    </div>

    <div class="flex flex-col gap-2">
      <Label>Danger</Label>
      <PhoneInput v-model="phone4" v-model:country="country4" variant="danger">
        <PhoneInputCountrySelect />
        <PhoneInputField placeholder="Phone number" />
        <PhoneInputClear />
      </PhoneInput>
    </div>
  </div>
</template>
