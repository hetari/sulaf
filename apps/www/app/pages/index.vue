<script setup lang="ts">
import { ArrowRightIcon, ComponentIcon, FishingHookIcon } from 'lucide-vue-next'
</script>

<template>
  <div class="flex size-full flex-col flex-1 items-center justify-center relative">
    <section
      class="overflow-x-clip size-full flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both md:text-center text-left p-4 md:p-0 space-y-4 justify-center md:items-center"
    >
      <NuxtLink
        to="https://github.com/hetari/sulaf"
        target="_blank"
        class="flex md:justify-center justify-start items-center group/badge relative"
        aria-label="Star Sulaf UI on GitHub"
      >
        <ShineBorder
          :borderWidth="1"
          :duration="6"
          gradient="from-blue-500 via-red-500 to-teal-400"
          borderRadius="9999px"
          className="w-fit"
        >
          <Badge
            variant="outline"
            class="border-none font-semibold tracking-wider animate-in fade-in zoom-in duration-500 text-sm cursor-pointer transition-all shadow-sm flex items-center gap-2 py-1.5 px-3 rounded-full bg-background/50 backdrop-blur-sm group-hover/badge:bg-background/80"
          >
            <span class="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-4 text-emerald-500 group-hover/badge:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="font-medium opacity-80 group-hover/badge:opacity-100 transition-opacity">
                Open source
              </span>
            </span>
            <div
              class="flex items-center gap-1 group-hover/badge:text-foreground transition-colors ml-1 border-l border-border/50 pl-2"
            >
              <span class="text-xs font-semibold">Star on GitHub</span>
              <ArrowRightIcon
                class="size-3 translate-x-0 group-hover/badge:translate-x-0.5 transition-transform"
              />
            </div>
          </Badge>
        </ShineBorder>
      </NuxtLink>

      <!-- <div
          class="animate-in fade-in zoom-in duration-1000 delay-300 absolute top-0 right-0 blur-xl hidden md:block -z-1 opacity-75"
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-primary transform-gpu"
          >
            <path
              d="M0.135418 193.289C1.60539 179.975 10.5091 168.828 24.0643 163.156C30.8997 160.369 30.8998 160.369 74.8519 159.748C111.969 159.233 119.78 158.816 124.904 157.272C133.21 154.902 137.851 152.319 143.216 147.367C150.177 140.861 152.498 135.394 152.13 127.14C151.763 120.119 151.763 120.119 98.0459 119.604C40.7906 118.983 42.1241 119.09 29.5558 113.622C18.0796 108.563 8.18878 98.4541 3.30637 86.4811C-0.725544 76.4695 -0.473595 62.0202 3.91532 50.9791C12.8296 28.7904 33.9447 11.3501 62.0316 2.8829C69.8435 0.513141 70.5785 0.513156 135.163 0.096008C200.356 -0.214634 200.356 -0.214648 199.747 7.32064C198.77 20.3232 190.35 31.0537 176.92 36.4233C168.867 39.6185 168.867 39.6185 122.468 40.1422C76.3219 40.657 76.0699 40.6569 69.9695 43.2397C66.6726 44.5799 60.8136 48.2988 56.9077 51.4939C49.3374 57.9997 46.1664 64.2924 46.1664 73.372C46.1664 78.3245 46.1665 78.3245 98.4239 78.3245C154.094 78.3245 158.252 78.6351 169.843 83.5877C197.92 95.7648 208.304 128.276 192.796 155.417C180.826 176.061 164.1 188.753 138.344 196.289C127.351 199.59 127.351 199.59 63.3756 199.901C-0.599589 200.211 -0.599567 200.211 0.135418 193.297V193.289Z"
              fill="currentcolor"
            />
          </svg>
        </div> -->

      <div
        class="flex items-center justify-start md:justify-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 fill-mode-both"
      >
        <span class="text-sm text-muted-foreground"> A shadcn-vue registry </span>
      </div>

      <div class="text-7xl font-bold font-mono">Sulaf</div>

      <p class="text-lg md:text-xl leading-relaxed text-balance text-muted-foreground">
        Beautiful, accessible components built for
        <span class="text-foreground font-medium text-nowrap">shadcn-vue</span>.
        <br />
        <span>Copy, paste, and make them yours.</span>
      </p>

      <div class="flex flex-col gap-2 mt-4">
        <div class="flex md:justify-center justify-start gap-2 mt-4">
          <NuxtLink class="w-fit" prefetch-on="interaction" to="/docs/introduction">
            <Button class="group font-bold">
              <span>Get Started</span>
              <ArrowRightIcon
                class="size-4 md:transition-all md:group-hover:translate-x-1 md:will-change-auto"
              />
            </Button>
          </NuxtLink>

          <NuxtLink class="w-fit" prefetch-on="interaction" to="/docs/components">
            <Button class="group" variant="outline">
              <span>Components</span>
              <ComponentIcon
                class="size-4 md:transition-all md:group-hover:scale-110 md:will-change-auto"
              />
            </Button>
          </NuxtLink>
        </div>

        <NuxtLink class="w-fit md:mx-auto mx-0" prefetch-on="interaction" to="/docs/composables">
          <Button class="group" variant="outline">
            <span>Composables</span>
            <FishingHookIcon
              class="size-4 md:transition-all md:group-hover:rotate-0 -rotate-45 md:will-change-auto"
            />
          </Button>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
