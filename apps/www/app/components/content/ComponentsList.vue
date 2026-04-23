<script setup lang="ts">
const { data } = await useNavigation()

const list = computed(
  () => data.value?.[0]?.children.find(item => item.title === 'Components')?.children ?? [],
)
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20"
  >
    <NuxtLink
      v-for="component in list"
      :key="component.title"
      :to="component.path"
      class="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
    >
      {{ component.title }}

      <Badge
        v-if="component.new"
        variant="outline"
        class="h-4 px-1.5 text-[0.65rem] border-green-600 dark:border-green-500 bg-green-600/10 dark:bg-green-500/10 text-green-600 dark:text-green-500"
      >
        New
      </Badge>
      <Badge
        v-else-if="component.beta"
        variant="outline"
        class="h-4 px-1.5 text-[0.65rem] border-amber-500 dark:border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 text-amber-500 dark:text-amber-500"
      >
        Beta
      </Badge>
      <Badge
        v-else-if="component.soon"
        variant="outline"
        class="h-4 px-1.5 text-[0.65rem] leading-none"
      >
        Soon
      </Badge>
    </NuxtLink>
  </div>
</template>
