<script setup lang="ts">
import { ref, watch } from 'vue'
import { SearchIcon, Loader2Icon } from 'lucide-vue-next'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteControl,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteLoading,
} from '~/components/ui/autocomplete'

interface User {
  id: number
  firstName: string
  username: string
}

const searchTerm = ref('')
const value = ref<User>()
const items = ref<User[]>([])
const isLoading = ref(false)
const isOpen = ref(false)

// Store the current AbortController instance
let abortController: AbortController | null = null

async function fetchUsers(query: string) {
  // Cancel any ongoing request
  if (abortController) {
    abortController.abort()
  }

  if (!query) {
    items.value = []
    isLoading.value = false
    return
  }

  // Create a new AbortController for this request
  const controller = new AbortController()
  abortController = controller

  isLoading.value = true
  try {
    const response = await fetch(`https://dummyjson.com/users`, {
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data: User[] = (await response.json())?.users ?? []
    items.value = data.filter(
      user =>
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase()),
    )
  } catch (error) {
    // Ignore abort errors as they're intentional
    if (error instanceof Error && error.name === 'AbortError') {
      return
    }
    // eslint-disable-next-line no-console
    console.error('[Demo]: Failed to fetch users:', error)
  } finally {
    // Only clear state if we're still the active request
    if (abortController === controller) {
      isLoading.value = false
      abortController = null
    }
  }
}

watch(searchTerm, newVal => {
  fetchUsers(newVal)
})
</script>

<template>
  <div class="w-full max-w-md">
    <Autocomplete v-model="value" v-model:open="isOpen" v-model:search-term="searchTerm">
      <AutocompleteControl>
        <SearchIcon v-if="!isLoading" class="size-4 ms-2" />
        <Loader2Icon v-else class="size-4 ms-2 animate-spin" />

        <AutocompleteInput placeholder="Search users by name..." />
      </AutocompleteControl>

      <AutocompleteContent>
        <AutocompleteLoading v-if="isLoading"> Searching for users... </AutocompleteLoading>

        <template v-else>
          <AutocompleteEmpty v-if="searchTerm && items.length === 0">
            No users found for "{{ searchTerm }}".
          </AutocompleteEmpty>

          <AutocompleteList v-if="items.length > 0">
            <AutocompleteItem v-for="user in items" :key="user.id" :value="user">
              <div class="flex flex-col">
                <span>{{ user.firstName }}</span>
                <span class="text-xs text-muted-foreground">@{{ user.username }}</span>
              </div>
            </AutocompleteItem>
          </AutocompleteList>
        </template>
      </AutocompleteContent>
    </Autocomplete>

    <div v-if="value" class="mt-4 text-sm text-muted-foreground">
      Selected:
      <span class="font-medium text-foreground">{{ value.firstName }}</span>
    </div>
  </div>
</template>
