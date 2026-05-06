<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from 'vue'
import { ChevronDown, Search } from 'lucide-vue-next'
import { cn } from '@sulaf/ui/lib/utils'
import { Button } from '@sulaf/ui/components/button'
import { Popover, PopoverContent, PopoverTrigger } from '@sulaf/ui/components/popover'
import { ScrollArea } from '@sulaf/ui/components/scroll-area'
import { usePhoneInputContext } from './context'
import PhoneFieldCountryFlag from './PhoneFieldCountryFlag.vue'
import { phoneInputCountrySelectVariants } from './index'
import type { PhoneInputCountrySelectProps } from './types'

const props = withDefaults(
  defineProps<
    PhoneInputCountrySelectProps & {
      class?: HTMLAttributes['class']
    }
  >(),
  {
    showCountryName: false,
  },
)

const open = ref(false)
const searchTerm = ref('')
const { country, countries, disabled, onCountryChange, variant } = usePhoneInputContext()

const selectedCountry = computed(
  () => countries.value.find(option => option.code === country.value) ?? countries.value[0] ?? null,
)

const filteredCountries = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()
  if (!query) {
    return countries.value
  }

  return countries.value.filter(option =>
    [option.label, option.code, option.callingCode, option.searchText].some(field =>
      field?.toLowerCase().includes(query),
    ),
  )
})

function selectCountry(code: typeof country.value) {
  onCountryChange(code)
  open.value = false
  searchTerm.value = ''
}

watch(open, isOpen => {
  if (!isOpen) {
    searchTerm.value = ''
  }
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        :aria-label="
          selectedCountry
            ? `Select country ${selectedCountry.label} +${selectedCountry.callingCode}`
            : 'Select country'
        "
        :disabled="disabled"
        :class="cn(phoneInputCountrySelectVariants({ variant }), props.class)"
      >
        <span class="flex min-w-0 flex-1 items-center gap-2">
          <PhoneFieldCountryFlag
            v-if="selectedCountry"
            type="unicode"
            :country-code="selectedCountry.code"
            :alt="selectedCountry.label"
          />
          <span v-if="props.showCountryName" class="truncate text-sm font-medium">
            {{ selectedCountry?.label ?? country }}
          </span>
          <span class="text-muted-foreground text-xs">
            +{{ selectedCountry?.callingCode ?? '' }}
          </span>
        </span>
        <ChevronDown class="text-muted-foreground size-4 shrink-0" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80 p-0" align="start">
      <div class="border-border border-b p-3">
        <div class="relative">
          <Search
            class="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
          />
          <input
            v-model="searchTerm"
            class="border-input bg-background placeholder:text-muted-foreground flex h-9 w-full rounded-md border pl-9 pr-3 text-sm shadow-none outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            placeholder="Search countries"
            type="text"
            autocomplete="off"
            autofocus
          />
        </div>
      </div>
      <ScrollArea class="h-72">
        <div class="p-1">
          <button
            v-for="option in filteredCountries"
            :key="option.code"
            type="button"
            class="flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="option.code === country ? 'bg-accent text-accent-foreground' : ''"
            @click="selectCountry(option.code)"
          >
            <PhoneFieldCountryFlag
              type="unicode"
              :country-code="option.code"
              :alt="option.label"
              class="shrink-0"
            />
            <span v-if="props.showCountryName" class="min-w-0 flex-1 truncate">
              {{ option.label }}
            </span>
            <span class="text-muted-foreground text-xs">+{{ option.callingCode }}</span>
          </button>
          <div
            v-if="filteredCountries.length === 0"
            class="text-muted-foreground px-2 py-6 text-center text-sm"
          >
            No countries found.
          </div>
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
</template>
