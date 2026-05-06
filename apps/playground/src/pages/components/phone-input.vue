<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PhoneInput,
  PhoneInputClear,
  PhoneInputCountrySelect,
  PhoneInputField,
  validatePhoneNumber,
  type CountryCode,
  type PhoneFormat,
} from '@sulaf/registry/ui/phone-input'
import { Button } from '@sulaf/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sulaf/ui/components/select'

const phone = ref('+1 415 555 2671')
const country = ref<CountryCode>('US')
const format = ref<PhoneFormat>('international')
const locale = ref<string>(navigator.language || 'en')

const validation = computed(() => {
  const result = validatePhoneNumber(phone.value, country.value)
  return result.success ? 'valid' : result.error
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col gap-3 p-6">
    <PhoneInput v-model="phone" v-model:country="country" :format="format" :locale>
      <PhoneInputCountrySelect :showCountryName="false" />
      <PhoneInputField placeholder="Phone number" />
      <PhoneInputClear />
    </PhoneInput>

    <div class="flex flex-col gap-2 rounded-2xl border border-border bg-background/80 p-4 text-sm">
      <div class="flex items-center justify-between gap-3">
        <span class="text-muted-foreground">Value</span>
        <span class="font-mono">{{ phone || 'empty' }}</span>
      </div>
      <div class="flex items-center justify-between gap-3">
        <span class="text-muted-foreground">Country</span>
        <span class="font-mono">{{ country }}</span>
      </div>
      <div class="flex items-center justify-between gap-3">
        <span class="text-muted-foreground">Validation</span>
        <span class="font-mono">{{ validation }}</span>
      </div>
      <div class="flex items-center justify-between gap-3">
        <span class="text-muted-foreground">Format</span>
        <div class="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            :class="format === 'international' ? 'bg-primary text-primary-foreground' : ''"
            @click="format = 'international'"
          >
            international
          </Button>
          <Button
            size="sm"
            variant="outline"
            :class="format === 'national' ? 'bg-primary text-primary-foreground' : ''"
            @click="format = 'national'"
          >
            national
          </Button>
          <Button
            size="sm"
            variant="outline"
            :class="format === 'e164' ? 'bg-primary text-primary-foreground' : ''"
            @click="format = 'e164'"
          >
            e164
          </Button>
        </div>
      </div>
      <!-- local language -->
      <div class="flex items-center justify-between gap-3">
        <span class="text-muted-foreground">Local language </span>
        <Select v-model="locale">
          <SelectTrigger class="w-45">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>
