<script setup lang="ts">
import { computed } from 'vue'
import { siteConfig } from '~/lib/siteConfig'

const props = defineProps({
  colorMode: { type: String, required: false, default: 'dark' },
  title: { type: String, required: false, default: 'title' },
  description: { type: String, required: false },
  website: { type: String, required: false },
})

const website = computed(() => {
  return props.website || siteConfig.url.replace('https://', '').replace(/\/$/, '')
})
</script>

<template>
  <div class="relative flex size-full bg-black text-white" :style="{ fontFamily: 'Geist' }">
    <!-- Grid Pattern -->
    <div
      class="absolute inset-0 opacity-[0.2]"
      style="
        background-image: radial-gradient(#ffffff 1px, transparent 10px);
        background-size: 40px 40px;
      "
    />

    <!-- Logo Section -->
    <div class="absolute left-20 top-20 flex items-center gap-4">
      <div class="flex size-14 items-center justify-center rounded-2xl bg-white p-2.5">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="size-full text-black"
        >
          <path
            d="M0.135418 193.289C1.60539 179.975 10.5091 168.828 24.0643 163.156C30.8997 160.369 30.8998 160.369 74.8519 159.748C111.969 159.233 119.78 158.816 124.904 157.272C133.21 154.902 137.851 152.319 143.216 147.367C150.177 140.861 152.498 135.394 152.13 127.14C151.763 120.119 151.763 120.119 98.0459 119.604C40.7906 118.983 42.1241 119.09 29.5558 113.622C18.0796 108.563 8.18878 98.4541 3.30637 86.4811C-0.725544 76.4695 -0.473595 62.0202 3.91532 50.9791C12.8296 28.7904 33.9447 11.3501 62.0316 2.8829C69.8435 0.513141 70.5785 0.513156 135.163 0.096008C200.356 -0.214634 200.356 -0.214648 199.747 7.32064C198.77 20.3232 190.35 31.0537 176.92 36.4233C168.867 39.6185 168.867 39.6185 122.468 40.1422C76.3219 40.657 76.0699 40.6569 69.9695 43.2397C66.6726 44.5799 60.8136 48.2988 56.9077 51.4939C49.3374 57.9997 46.1664 64.2924 46.1664 73.372C46.1664 78.3245 46.1665 78.3245 98.4239 78.3245C154.094 78.3245 158.252 78.6351 169.843 83.5877C197.92 95.7648 208.304 128.276 192.796 155.417C180.826 176.061 164.1 188.753 138.344 196.289C127.351 199.59 127.351 199.59 63.3756 199.901C-0.599589 200.211 -0.599567 200.211 0.135418 193.297V193.289Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <span class="text-3xl font-bold tracking-tighter uppercase">{{ siteConfig.name }}</span>
    </div>

    <!-- Content -->
    <div class="absolute inset-0 flex flex-col items-center justify-center px-32 pt-10 text-center">
      <h1
        class="text-balance font-bold leading-[1] text-white"
        :style="{
          fontSize: title && title.length > 30 ? '48px' : '64px',
        }"
      >
        {{ title }}
      </h1>

      <p
        v-if="description"
        class="mt-8 max-w-3xl text-balance text-2xl leading-relaxed text-slate-400"
      >
        {{ description }}
      </p>

      <!-- CTA Button -->
      <div class="mt-12 flex items-center gap-3 rounded-2xl bg-white px-8 py-4">
        <span class="text-2xl font-bold tracking-tight text-black">Get Started</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-7 text-black"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>

    <!-- Bottom Info -->
    <div class="absolute bottom-14 mx-auto text-sm font-medium text-white uppercase opacity-50">
      {{ website }}
    </div>
  </div>
</template>
