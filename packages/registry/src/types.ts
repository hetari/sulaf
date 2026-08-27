/** File type values recognised by the shadcn-vue registry schema. */
export type RegistryFileType =
  | 'registry:ui'
  | 'registry:component'
  | 'registry:hook'
  | 'registry:block'

/**
 * A single source file collected by the Source Collector.
 * Carries raw file content + enough metadata for the Emitter to work with.
 */
export interface CollectedFile {
  /** Relative path used as the registry item's file path (e.g. `button/Button.vue`). */
  path: string
  /** Raw file content, after alias replacements have been applied. */
  content: string
  /** Registry file type derived from the source directory. */
  type: RegistryFileType
  /** Registry item slug this file belongs to (e.g. `button`). */
  slug: string
  /** Source directory name the file was collected from (e.g. `components`). */
  srcDir: string
}

/**
 * A single example file collected from the `examples/` directory.
 */
export interface ExampleFile {
  /** Relative path (e.g. `examples/ButtonDemo.vue`). */
  path: string
  /** Raw file content, after alias replacements. */
  content: string
  type: 'registry:block'
}

/**
 * Structured result returned by the Source Collector.
 */
export interface CollectedSources {
  /** Component/hook files grouped by slug. */
  components: Map<string, CollectedFile[]>
  /** Example block files. */
  examples: ExampleFile[]
}

/**
 * Dependency classification produced by the Dependency Resolver for a single file.
 */
export interface DependencyResult {
  dependencies: Set<string>
  devDependencies: Set<string>
  registryDependencies: Set<string>
}

/**
 * In-memory output item produced by the Registry Emitter.
 * The entry-point script is responsible for writing these to disk.
 */
export interface EmittedFile {
  /** Output path relative to the output base directory (e.g. `button.json`, `examples/ButtonDemo.json`). */
  path: string
  /** Serialized JSON content. */
  content: string
}
