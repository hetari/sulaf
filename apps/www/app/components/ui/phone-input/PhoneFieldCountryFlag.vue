<script setup lang="ts">
import { getFlagUnicode } from './utils'
import type { PhoneFieldCountryFlagProps } from './types'

const props = withDefaults(defineProps<PhoneFieldCountryFlagProps>(), {
  type: 'cdn',
})
</script>

<template>
  <div v-if="props.type === 'cdn'" class="w-5 h-3.5 overflow-hidden rounded-xs">
    <img
      :src="`https://flagcdn.com/w20/${props.countryCode.toLowerCase()}.png`"
      :srcset="`https://flagcdn.com/w40/${props.countryCode.toLowerCase()}.png 2x`"
      class="h-full w-full"
      :alt="props.alt"
    />
  </div>
  <div v-else-if="props.type === 'unicode'" class="text-xl leading-none">
    {{ getFlagUnicode(props.countryCode) }}
  </div>
</template>
