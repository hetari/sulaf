<script setup lang="ts">
import { ref } from 'vue'
import {
  PhoneInput,
  PhoneInputClear,
  PhoneInputCountrySelect,
  PhoneInputField,
  type CountryCode,
  type PhoneFormat,
} from '@/components/ui/phone-input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

const phone = ref('+1 415 555 2671')
const country = ref<CountryCode>('US')
const format = ref<PhoneFormat>('international')
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Label
        >Format: <span class="capitalize">{{ format }}</span></Label
      >
      <PhoneInput v-model="phone" v-model:country="country" :format="format">
        <PhoneInputCountrySelect />
        <PhoneInputField placeholder="Phone number" />
        <PhoneInputClear />
      </PhoneInput>
    </div>

    <div class="flex gap-2">
      <Button
        size="sm"
        :variant="format === 'international' ? 'default' : 'outline'"
        @click="format = 'international'"
      >
        International
      </Button>
      <Button
        size="sm"
        :variant="format === 'national' ? 'default' : 'outline'"
        @click="format = 'national'"
      >
        National
      </Button>
      <Button
        size="sm"
        :variant="format === 'e164' ? 'default' : 'outline'"
        @click="format = 'e164'"
      >
        E164
      </Button>
    </div>
  </div>
</template>
