<script setup lang="ts">
import type { ListboxItemEmits, ListboxItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit, useCurrentElement } from '@vueuse/core'
import { ListboxItem, useForwardPropsEmits, useId } from 'reka-ui'
import { cn } from '@/lib/utils'
import { useCommand, useCommandGroup } from '.'

const props = defineProps<
  ListboxItemProps & {
    class?: HTMLAttributes['class']
    keywords?: string[]
  }
>()
const emits = defineEmits<ListboxItemEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'keywords')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const id = useId()
const { filterState, allItems, allGroups } = useCommand()
const groupContext = useCommandGroup()

const isRender = computed(() => {
  if (!filterState.search) {
    return true
  } else {
    const filteredCurrentItem = filterState.filtered.items.get(id)
    // If the filtered items is undefined means not in the all times map yet
    // Do the first render to add into the map
    if (filteredCurrentItem === undefined) {
      return true
    }

    // Check with filter
    return filteredCurrentItem > 0
  }
})

const itemRef = ref()
const currentElement = useCurrentElement(itemRef)

function updateValue() {
  if (!(currentElement.value instanceof HTMLElement)) return

  const textValue = currentElement.value.textContent ?? ''
  const propValue = props.value?.toString() ?? ''
  const keywords = props.keywords ?? []

  allItems.value.set(id, {
    value: `${textValue} ${propValue} ${keywords.join(' ')}`.trim(),
    keywords: keywords,
  })
}

onMounted(() => {
  updateValue()

  const groupId = groupContext?.id
  if (groupId) {
    if (!allGroups.value.has(groupId)) {
      allGroups.value.set(groupId, new Set([id]))
    } else {
      allGroups.value.get(groupId)?.add(id)
    }
  }
})

watch(
  () => [props.value, props.keywords, (currentElement.value as HTMLElement)?.textContent],
  () => {
    updateValue()
  },
  { deep: true },
)

onUnmounted(() => {
  allItems.value.delete(id)
})
</script>

<template>
  <ListboxItem
    v-if="isRender"
    v-bind="forwarded"
    :id="id"
    ref="itemRef"
    data-slot="command-item"
    :class="
      cn(
        `
      relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50
      data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4
      [&_svg:not([class*=\'text-\'])]:text-muted-foreground
    `,
        props.class,
      )
    "
    @select="
      () => {
        filterState.search = ''
      }
    "
  >
    <slot />
  </ListboxItem>
</template>
