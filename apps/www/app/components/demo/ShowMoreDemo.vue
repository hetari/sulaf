<script setup lang="ts">
import { ref } from 'vue'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ShowMore, ShowMoreItem, ShowMoreButton, ShowMoreContent } from '@/components/ui/show-more'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

// This is only for demonstration purposes to show the text on mobile and adjust the size to show or hide it.
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('sm')
// This is only for demonstration purposes to show the text on mobile and adjust the size to show or hide it.

const openItem = ref('none')
const shortText = {
  preview: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
  expanded:
    'Minus quisquam assumenda eligendi provident magni. error voluptatibus obcaecati ab qui necessitatibus.',
}
</script>

<template>
  <ResizablePanelGroup direction="horizontal" class="rounded-lg border">
    <!-- LEFT PANEL (CONTENT) -->
    <ResizablePanel :default-size="60">
      <!-- ShowMore Demo Content -->
      <div class="size-full">
        <ShowMore
          :threshold="3"
          type="single"
          collapsible
          v-model="openItem"
          fade
          :animation="{
            duration: 0.5,
            ease: 'backOut',
          }"
        >
          <ShowMoreItem value="demo" v-slot="{ isTruncated }">
            <div class="p-6">
              <ShowMoreContent class="text-muted-foreground">
                <!-- This is only for demonstration purposes to show the text on mobile and adjust the size to show or hide it.  -->
                <p v-if="isMobile">{{ shortText.preview }}</p>
                <p v-else>{{ shortText.preview }} {{ shortText.expanded }}</p>
              </ShowMoreContent>

              <div v-if="isTruncated" class="flex items-center gap-4 mt-4">
                <div class="flex-1 h-px bg-border"></div>

                <ShowMoreButton
                  class="group h-8 px-4 text-xs font-semibold uppercase tracking-wide rounded-full border border-border flex items-center gap-2 [&>svg]:hidden"
                >
                  <span v-if="openItem !== 'demo'" class="flex items-center gap-2">
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
            </div>
          </ShowMoreItem>
        </ShowMore>
      </div>
    </ResizablePanel>

    <!-- HANDLE -->
    <ResizableHandle />

    <!-- RIGHT PANEL -->
    <ResizablePanel :default-size="40">
      <div class="h-full flex items-center justify-center text-xs text-muted-foreground">
        horizontal Resize
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
