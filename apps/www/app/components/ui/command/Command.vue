<script setup lang="ts">
import type { ListboxRootEmits, ListboxRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ListboxRoot, useFilter, useForwardPropsEmits } from 'reka-ui'
import { reactive, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { provideCommandContext } from '.'

const props = withDefaults(
  defineProps<
    ListboxRootProps & {
      class?: HTMLAttributes['class']
      /**
       * Custom filter function for items.
       * @param value The item value (concatenated text, prop value, and keywords).
       * @param search The current search query.
       * @param keywords The actual keywords provided to the CommandItem (if any).
       */
      filter?: (value: string, search: string, keywords?: string[]) => number
    }
  >(),
  {
    modelValue: '',
  },
)

const emits = defineEmits<ListboxRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'filter')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const allItems = ref<Map<string, { value: string; keywords: string[] }>>(new Map())
const allGroups = ref<Map<string, Set<string>>>(new Map())

const { contains } = useFilter({ sensitivity: 'base' })
const filterState = reactive({
  search: '',
  filtered: {
    /** The count of all visible items. */
    count: 0,
    /** Map from visible item id to its search score. */
    items: new Map() as Map<string, number>,
    /** Set of groups with at least one visible item. */
    groups: new Set() as Set<string>,
  },
})

function filterItems() {
  if (!filterState.search) {
    filterState.filtered.count = allItems.value.size
    filterState.filtered.items.clear()
    filterState.filtered.groups.clear()
    return
  }

  // Reset the groups
  filterState.filtered.groups = new Set()
  let itemCount = 0

  // Check which items should be included
  for (const [id, item] of allItems.value) {
    let score = 0
    if (props.filter) {
      // Pass the actual keywords if available, or an empty array.
      score = props.filter(item.value, filterState.search, item.keywords)
    } else {
      score = contains(item.value, filterState.search) ? 1 : 0
    }

    filterState.filtered.items.set(id, score)
    if (score > 0) itemCount++
  }

  // Check which groups have at least 1 item shown
  for (const [groupId, group] of allGroups.value) {
    for (const itemId of group) {
      if ((filterState.filtered.items.get(itemId) ?? 0) > 0) {
        filterState.filtered.groups.add(groupId)
        break
      }
    }
  }

  filterState.filtered.count = itemCount
}

watch(
  [() => filterState.search, () => allItems.value],
  () => {
    filterItems()
  },
  { deep: true },
)

provideCommandContext({
  allItems,
  allGroups,
  filterState,
})
</script>

<template>
  <ListboxRoot
    data-slot="command"
    v-bind="forwarded"
    :class="
      cn(
        'flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        props.class,
      )
    "
  >
    <slot />
  </ListboxRoot>
</template>
