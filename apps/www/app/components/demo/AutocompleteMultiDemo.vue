<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFilter } from 'reka-ui'
import { ChevronDownIcon, SearchIcon, XIcon } from 'lucide-vue-next'
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
  AutocompleteGroup,
} from '~/components/ui/autocomplete'
import { Badge } from '~/components/ui/badge'

const items = ['Vue', 'React', 'Svelte', 'Angular', 'Solid', 'Nuxt', 'Next.js']

const searchTerm = ref('')
const value = ref<string[]>([])

const { contains } = useFilter({ sensitivity: 'base' })

const filteredItems = computed(() => {
  if (!searchTerm.value) return items
  return items.filter(item => contains(item, searchTerm.value))
})

function removeItem(item: string) {
  value.value = value.value.filter(v => v !== item)
}
</script>

<template>
  <div class="w-full max-w-md space-y-4">
    <div v-if="value.length > 0" class="flex flex-wrap gap-2">
      <Badge v-for="v in value" :key="v" variant="secondary" class="gap-1">
        {{ v }}
        <button class="outline-none" @click="removeItem(v)">
          <XIcon class="size-3" />
        </button>
      </Badge>
    </div>

    <Autocomplete v-model="value" v-model:search-term="searchTerm" multiple>
      <AutocompleteControl>
        <SearchIcon class="size-4 ms-2" />
        <AutocompleteInput placeholder="Select frameworks..." />

        <AutocompleteClear />

        <AutocompleteTrigger as-child>
          <div class="flex items-center pl-2">
            <ChevronDownIcon class="size-4 me-2" />
          </div>
        </AutocompleteTrigger>
      </AutocompleteControl>

      <AutocompleteContent>
        <AutocompleteEmpty>No framework found.</AutocompleteEmpty>

        <AutocompleteList>
          <AutocompleteGroup>
            <AutocompleteLabel>Frameworks</AutocompleteLabel>
            <AutocompleteItem v-for="item in filteredItems" :key="item" :value="item">
              {{ item }}
            </AutocompleteItem>
          </AutocompleteGroup>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>
