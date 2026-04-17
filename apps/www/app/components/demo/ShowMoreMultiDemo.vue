<script setup lang="ts">
import { ref } from 'vue'
import { ShowMore, ShowMoreItem, ShowMoreButton, ShowMoreContent } from '@/components/ui/show-more'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const openItems = ref<string[]>([])

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

const items = [
  {
    value: 'item-1',
    title: 'First Section',
    content: longText,
  },
  {
    value: 'item-2',
    title: 'Second Section',
    content: longText.repeat(2),
  },
  {
    value: 'item-3',
    title: 'Third Section',
    content: longText.repeat(3),
  },
]
</script>

<template>
  <div class="w-full max-w-xl space-y-4">
    <ShowMore :threshold="3" type="multiple" v-model="openItems" collapsible fade>
      <ShowMoreItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        v-slot="{ isTruncated }"
      >
        <h3 class="font-semibold text-lg mb-2">{{ item.title }}</h3>
        <ShowMoreContent class="text-muted-foreground">
          <p>{{ item.content }}</p>
        </ShowMoreContent>
        <div v-if="isTruncated" class="flex items-center gap-4 mt-4">
          <div class="flex-1 h-px bg-border"></div>
          <ShowMoreButton
            class="group h-8 px-4 text-xs font-semibold uppercase tracking-wide rounded-full border border-border flex items-center gap-2 [&>svg]:hidden"
          >
            <span v-if="!openItems.includes(item.value)" class="flex items-center gap-2">
              Show More
              <ChevronDown class="w-3 h-3" />
            </span>
            <span v-else class="flex items-center gap-2">
              Show Less
              <ChevronUp class="w-3 h-3" />
            </span>
          </ShowMoreButton>
          <div class="flex-1 h-px bg-border"></div>
        </div>
      </ShowMoreItem>
    </ShowMore>
  </div>
</template>
