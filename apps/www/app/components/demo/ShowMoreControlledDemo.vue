<script setup lang="ts">
import { ref } from 'vue'
import { ShowMore, ShowMoreItem, ShowMoreButton, ShowMoreContent } from '@/components/ui/show-more'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const isShowMoreOpen = ref(false)

const longText = `This is some very long content that demonstrates how the ShowMore component can be controlled externally. By binding a boolean ref to the 'v-model:open' prop, you can programmatically toggle the expanded state of the content. This is useful for scenarios where you might want to open or close the content based on user actions outside of the ShowMore component itself, or based on application logic. The text will expand and collapse smoothly with the configured animation.`
</script>

<template>
  <div class="w-full max-w-xl space-y-4">
    <ShowMore :threshold="3" v-model:open="isShowMoreOpen" collapsible fade>
      <ShowMoreItem value="controlled-item" v-slot="{ isTruncated }">
        <h3 class="font-semibold text-lg mb-2">Controlled ShowMore</h3>
        <ShowMoreContent class="text-muted-foreground">
          <p>{{ longText }}</p>
        </ShowMoreContent>
        <div class="flex items-center gap-4 mt-4">
          <div class="flex-1 h-px bg-border"></div>
          <ShowMoreButton
            class="group h-8 px-4 text-xs font-semibold uppercase tracking-wide rounded-full border border-border flex items-center gap-2 [&>svg]:hidden"
          >
            <span v-if="!isShowMoreOpen" class="flex items-center gap-2">
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

    <Button @click="isShowMoreOpen = !isShowMoreOpen">
      Toggle from outside (Currently: {{ isShowMoreOpen ? 'Open' : 'Closed' }})
    </Button>
  </div>
</template>
