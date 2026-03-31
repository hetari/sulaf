<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteControl,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteLoading,
  AutocompleteTrigger,
} from '@sulaf/registry/ui/autocomplete'
import { useFilter } from 'reka-ui'

import { computed, ref, watch } from 'vue'

const items = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape']

// ── Search State ───────────────────────────────────────────────
const searchTerm = ref('')
const value = ref<string>()
const isLoading = ref(false)

const { contains } = useFilter({ sensitivity: 'base' })

const filteredItems = computed(() => {
  if (!searchTerm.value) return items
  return items.filter(item => contains(item, searchTerm.value))
})

/**
 * Simulate a brief loading delay for demo/video recording purposes.
 * This makes the loading spinner visible and realistic during search.
 */
let timer: ReturnType<typeof setTimeout>
watch(searchTerm, newVal => {
  if (newVal) {
    isLoading.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      isLoading.value = false
    }, 250)
  } else {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <Autocomplete v-model="value" v-model:search-term="searchTerm">
      <AutocompleteControl>
        <SearchIcon />

        <AutocompleteInput placeholder="Search fruits..." />

        <AutocompleteClear />

        <AutocompleteTrigger as-child>
          <div class="flex items-center pl-2">
            <ChevronDownIcon />
          </div>
        </AutocompleteTrigger>
      </AutocompleteControl>

      <AutocompleteContent>
        <AutocompleteLoading v-if="isLoading" />

        <template v-else>
          <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>

          <AutocompleteList>
            <AutocompleteGroup>
              <AutocompleteLabel>Fruits</AutocompleteLabel>
              <AutocompleteItem v-for="item in filteredItems" :key="item" :value="item">
                {{ item }}
              </AutocompleteItem>
            </AutocompleteGroup>
          </AutocompleteList>
        </template>
      </AutocompleteContent>
    </Autocomplete>

    <div class="text-center animate-in fade-in slide-in-from-bottom-1 blur-0">
      <p class="text-sm font-medium">
        Selected: <span class="text-primary font-bold">{{ value ?? 'null' }}</span>
      </p>
    </div>
  </section>
</template>
