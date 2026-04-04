<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFilter } from 'reka-ui'
import { ChevronDownIcon, SearchIcon } from 'lucide-vue-next'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteControl,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompleteLabel,
  AutocompleteLoading,
  AutocompleteGroup,
} from '~/components/ui/autocomplete'

const items = ['Vue', 'React', 'Svelte', 'Angular', 'Solid', 'Nuxt', 'Next.js']

const searchTerm = ref('')
const value = ref<string>()
const isLoading = ref(false)

const { contains } = useFilter({ sensitivity: 'base' })

const filteredItems = computed(() => {
  if (!searchTerm.value) return items
  return items.filter(item => contains(item, searchTerm.value))
})

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
  <Autocomplete v-model="value" v-model:search-term="searchTerm">
    <AutocompleteControl>
      <SearchIcon class="size-4 ms-2" />
      <AutocompleteInput placeholder="Search..." />

      <AutocompleteClear />

      <AutocompleteTrigger as-child>
        <div class="flex items-center pl-2">
          <ChevronDownIcon class="size-4 me-2" />
        </div>
      </AutocompleteTrigger>
    </AutocompleteControl>

    <AutocompleteContent>
      <AutocompleteLoading v-if="isLoading" />

      <template v-else>
        <AutocompleteEmpty>No framework found.</AutocompleteEmpty>

        <AutocompleteList>
          <AutocompleteGroup>
            <AutocompleteLabel>Framework</AutocompleteLabel>
            <AutocompleteItem v-for="item in filteredItems" :key="item" :value="item">
              {{ item }}
            </AutocompleteItem>
          </AutocompleteGroup>
        </AutocompleteList>
      </template>
    </AutocompleteContent>
  </Autocomplete>
</template>
