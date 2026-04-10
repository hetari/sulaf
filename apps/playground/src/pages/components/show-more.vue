<script setup lang="ts">
import { reactive } from 'vue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sulaf/ui/components/accordion'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import {
  ShowMore,
  ShowMoreItem,
  ShowMoreButton,
  ShowMoreContent,
} from '@sulaf/registry/ui/show-more'

type ExampleKind = 'basic' | 'long' | 'mixed'

type Example = {
  title: string
  kind: ExampleKind
  accordionLabelOpen: string
  accordionLabelClose: string
  showMoreLabelOpen: string
  showMoreLabelClose: string
  fade: boolean
}

const examples: Example[] = [
  {
    title: 'Basic Text Expansion',
    kind: 'basic',
    accordionLabelOpen: 'Show More',
    accordionLabelClose: 'Show Less',
    showMoreLabelOpen: 'Show More',
    showMoreLabelClose: 'Show Less',
    fade: false,
  },

  {
    title: 'Long Content',
    kind: 'long',
    accordionLabelOpen: 'Read Story',
    accordionLabelClose: 'Collapse',
    showMoreLabelOpen: 'Read Story',
    showMoreLabelClose: 'Collapse',
    fade: true,
  },
  {
    title: 'Mixed Content',
    kind: 'mixed',
    accordionLabelOpen: 'View Details',
    accordionLabelClose: 'Hide Details',
    showMoreLabelOpen: 'View Details',
    showMoreLabelClose: 'Hide Details',
    fade: true,
  },
]

const shortText = {
  preview:
    'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus quisquam assumenda eligendi provident magni.',
  expanded: 'error voluptatibus obcaecati ab qui necessitatibus.',
}

const longText = {
  intro:
    "The journey through the mystical mountains was more than just a physical challenge; it was an exploration of the self. Each step upward revealed new vistas of both the land and a traveler's own endurance.",
  more1:
    'As the sun began to dip behind the jagged peaks, casting long, purple shadows across the valley, I realized that the silence of the high altitudes was not empty — it was full of the whispers of the wind and the ancient secrets of the stones.',
  more2:
    'Reflecting on these moments now, I understand that the true peak was not the summit itself, but the clarity found in the struggle to reach it. The thin air seemed to sharpen every thought, leaving behind only the essential truths of existence.',
}

const mixedContent = {
  quote:
    'Architecture is the learned game, correct and magnificent, of forms assembled in the light.',
  imageUrl:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000',
  caption:
    'The intersection of geometric structure and organic landscapes creates a unique visual dialogue that has inspired builders for millennia.',
}

const accValues = reactive<string[]>(['', '', ''])
const smValues = reactive<string[]>(['', '', ''])
</script>

<template>
  <div class="min-h-screen bg-background text-foreground pb-28">
    <div class="mx-auto max-w-7xl px-6 pt-10 space-y-10">
      <h1 class="text-sm font-semibold text-muted-foreground">Show More</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- ================= ACCORDION ================= -->
        <div class="space-y-8">
          <div class="space-y-2 border-b border-border pb-4">
            <span
              class="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            >
              Accordion
            </span>
            <p class="text-sm text-muted-foreground">Manual split content</p>
          </div>

          <div
            v-for="(example, i) in examples"
            :key="'acc-' + i"
            class="rounded-xl border border-border bg-card shadow-sm"
          >
            <Accordion type="single" collapsible v-model="accValues[i]">
              <AccordionItem value="demo" class="border-none">
                <!-- CONTENT -->
                <div class="p-8">
                  <div class="text-[15px] leading-relaxed text-muted-foreground max-w-2xl">
                    <!-- BASIC -->
                    <template v-if="example.kind === 'basic'">
                      <p>
                        {{ shortText.preview }}
                        <AccordionContent class="inline">
                          {{ shortText.expanded }}
                        </AccordionContent>
                      </p>
                    </template>

                    <!-- LONG -->
                    <template v-else-if="example.kind === 'long'">
                      <p>{{ longText.intro }}</p>
                      <AccordionContent class="pt-4 space-y-4">
                        <p>{{ longText.more1 }}</p>
                        <p>{{ longText.more2 }}</p>
                      </AccordionContent>
                    </template>

                    <!-- MIXED -->
                    <template v-else>
                      <p class="italic text-foreground">
                        {{ mixedContent.quote }}
                      </p>

                      <AccordionContent class="pt-6 space-y-4">
                        <img
                          :src="mixedContent.imageUrl"
                          class="w-full h-44 object-cover rounded-lg border border-border"
                        />
                        <p class="text-sm text-muted-foreground">
                          {{ mixedContent.caption }}
                        </p>
                      </AccordionContent>
                    </template>
                  </div>

                  <!-- DIVIDER -->
                  <div class="flex items-center gap-4 mt-6">
                    <div class="flex-1 h-px bg-border relative">
                      <span
                        class="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2 bg-border"
                      ></span>
                    </div>

                    <AccordionTrigger
                      class="group h-8 px-4 text-xs font-semibold uppercase tracking-wide rounded-full border border-border flex items-center gap-2 transition-all [&>svg]:hidden"
                    >
                      <span class="group-data-[state=open]:hidden flex items-center gap-2">
                        {{ example.accordionLabelOpen }}
                        <ChevronDown class="w-3 h-3" />
                      </span>
                      <span class="group-data-[state=closed]:hidden flex items-center gap-2">
                        {{ example.accordionLabelClose }}
                        <ChevronUp class="w-3 h-3" />
                      </span>
                    </AccordionTrigger>

                    <div class="flex-1 h-px bg-border relative">
                      <span
                        class="absolute right-0 top-1/2 -translate-y-1/2 w-px h-2 bg-border"
                      ></span>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <!-- ================= SHOW MORE ================= -->
        <div class="space-y-8">
          <div class="space-y-2 border-b border-border pb-4">
            <span
              class="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            >
              ShowMore
            </span>
            <p class="text-sm text-muted-foreground">Automatic truncation</p>
          </div>

          <div
            v-for="(example, i) in examples"
            :key="'sm-' + i"
            class="rounded-xl border border-border bg-card shadow-sm"
          >
            <ShowMore
              :threshold="example.kind === 'mixed' ? 4 : 3"
              type="single"
              collapsible
              v-model="smValues[i]"
              :fade="example.fade"
            >
              <ShowMoreItem value="demo" v-slot="{ isTruncated }">
                <div class="p-8">
                  <ShowMoreContent class="text-muted-foreground max-w-2xl">
                    <!-- BASIC -->
                    <template v-if="example.kind === 'basic'">
                      <p>{{ shortText.preview }} {{ shortText.expanded }}</p>
                    </template>

                    <!-- LONG -->
                    <template v-else-if="example.kind === 'long'">
                      <div class="space-y-4">
                        <p>{{ longText.intro }}</p>
                        <p>{{ longText.more1 }}</p>
                        <p>{{ longText.more2 }}</p>
                      </div>
                    </template>

                    <!-- MIXED -->
                    <template v-else>
                      <div class="space-y-4">
                        <p class="italic text-foreground">
                          {{ mixedContent.quote }}
                        </p>
                        <img
                          :src="mixedContent.imageUrl"
                          class="w-full h-44 object-cover rounded-lg border border-border"
                        />
                        <p class="text-sm text-muted-foreground">
                          {{ mixedContent.caption }}
                        </p>
                      </div>
                    </template>
                  </ShowMoreContent>

                  <!-- DIVIDER -->
                  <div v-if="isTruncated" class="flex items-center gap-4 mt-6">
                    <div class="flex-1 h-px bg-border relative">
                      <span
                        class="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2 bg-border"
                      ></span>
                    </div>

                    <ShowMoreButton
                      variant="outline"
                      class="group h-8 px-4 text-xs font-semibold uppercase tracking-wide rounded-full border border-border flex items-center gap-2 transition-all [&>svg]:hidden hover:underline"
                    >
                      <span v-if="smValues[i] !== 'demo'" class="flex items-center gap-2">
                        {{ example.showMoreLabelOpen }}
                        <ChevronDown class="w-3 h-3" />
                      </span>
                      <span v-else class="flex items-center gap-2">
                        {{ example.accordionLabelClose }}
                        <ChevronUp class="w-3 h-3" />
                      </span>
                    </ShowMoreButton>

                    <div class="flex-1 h-px bg-border relative">
                      <span
                        class="absolute right-0 top-1/2 -translate-y-1/2 w-px h-2 bg-border"
                      ></span>
                    </div>
                  </div>
                </div>
              </ShowMoreItem>
            </ShowMore>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
