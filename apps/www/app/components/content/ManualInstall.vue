<script setup lang="ts">
import Step from './Step.vue'
import ComponentSource from './ComponentSource.vue'

const props = defineProps<{
  folder: string
}>()

const rawUi = import.meta.glob('../ui/**/*.{vue,ts}', {
  query: '?raw',
  import: 'default',
})

// Discover all files for this folder
const files = Object.keys(rawUi)
  .filter(key => key.startsWith(`../ui/${props.folder}/`))
  .map(key => {
    const filenameWithExt = key.split('/').pop() || ''
    const name = filenameWithExt.replace(/\.(vue|ts)$/, '')
    const ext = filenameWithExt.split('.').pop() || 'vue'
    const pathInFolder = key.replace(`../ui/${props.folder}/`, '').replace(/\.(vue|ts)$/, '')

    return {
      name,
      ext,
      pathInFolder: `${props.folder}/${pathInFolder}`,
      filename: filenameWithExt,
      isMain: name.toLowerCase() === props.folder.toLowerCase(),
    }
  })

// Sort files: Main first, then Vue, then TS, with index.ts last
const sortedFiles = [...files].sort((a, b) => {
  // Main file first
  if (a.isMain && !b.isMain) return -1
  if (!a.isMain && b.isMain) return 1

  // Vue before TS
  if (a.ext === 'vue' && b.ext !== 'vue') return -1
  if (a.ext !== 'vue' && b.ext === 'vue') return 1

  // index.ts last
  if (a.filename === 'index.ts' && b.filename !== 'index.ts') return 1
  if (a.filename !== 'index.ts' && b.filename === 'index.ts') return -1

  // Alphabetical otherwise
  return a.filename.localeCompare(b.filename)
})
</script>

<template>
  <div class="manual-install">
    <template v-for="file in sortedFiles" :key="file.filename">
      <Step>
        Create <code>{{ file.filename }}</code> and paste the following code:
      </Step>
      <ComponentSource :name="file.pathInFolder" :title="file.filename" :language="file.ext" />
    </template>
  </div>
</template>
