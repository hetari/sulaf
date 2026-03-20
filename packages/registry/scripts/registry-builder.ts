/**
 * Registry Builder Entry Point
 *
 * This script is responsible for generating shadcn-vue compatible registry JSON files
 * from the local component source code. It handles dependency analysis, path replacements,
 * and generates individual component files as well as a bundled all.json file.
 *
 * Configuration is managed in scripts/registry.config.ts
 */

import { generateRegistryAssets } from './registry/builder'

/**
 * Main execution block.
 * Uses the current working directory as the project root.
 */
const rootDir = process.cwd()

generateRegistryAssets({
  rootDir: rootDir,
}).catch(error => {
  // eslint-disable-next-line no-console
  console.error('Failed to generate registry assets:', error)
  process.exit(1)
})
