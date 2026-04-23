<script setup lang="ts">
import { computed } from 'vue'
import Step from './Step.vue'
import ComponentSource from './ComponentSource.vue'

const props = defineProps<{
  folder: string
}>()

const rawSources = import.meta.glob(['../ui/**/*.{vue,ts}', '../../composables/**/*.{vue,ts}'], {
  query: '?raw',
  import: 'default',
})

const SEARCH_DIRS = ['../ui/', '../../composables/']

// Discover all files for this folder by checking each search directory in order
const files = computed(() => {
  for (const baseDir of SEARCH_DIRS) {
    const dirPath = `${baseDir}${props.folder}/`
    let sourceKeys = Object.keys(rawSources).filter(key => key.startsWith(dirPath))

    // If no directory found, check if it's a single file in this search dir
    if (sourceKeys.length === 0) {
      const singleFileBase = `${baseDir}${props.folder}`
      const singleFileKey = Object.keys(rawSources).find(
        key => key === `${singleFileBase}.ts` || key === `${singleFileBase}.vue`,
      )
      if (singleFileKey) sourceKeys = [singleFileKey]
    }

    if (sourceKeys.length > 0) {
      return sourceKeys.map(key => {
        const filenameWithExt = key.split('/').pop() || ''
        const name = filenameWithExt.replace(/\.(vue|ts)$/, '')
        const ext = filenameWithExt.split('.').pop() || 'vue'

        // For single files, pathInFolder should just be the folder name
        const isSingleFile = !key.includes(`/${props.folder}/`)
        const pathInFolder = isSingleFile
          ? props.folder
          : key.replace(dirPath, '').replace(/\.(vue|ts)$/, '')

        return {
          name,
          ext,
          pathInFolder: isSingleFile ? props.folder : `${props.folder}/${pathInFolder}`,
          filename: filenameWithExt,
          isMain: name.toLowerCase() === props.folder.toLowerCase(),
        }
      })
    }
  }

  return []
})

// Sort files: Main first, then Vue, then TS, with index.ts last
const sortedFiles = computed(() =>
  [...files.value].sort((a, b) => {
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
  }),
)
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
