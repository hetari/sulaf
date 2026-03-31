export type RegistryFileType =
  | 'registry:block'
  | 'registry:component'
  | 'registry:lib'
  | 'registry:hook'
  | 'registry:ui'
  | 'registry:page'
  | 'registry:file'

export type RegistryItemType = 'registry:block' | 'registry:component' | 'registry:ui'

/**
 * Represents a component asset file in the registry.
 */
export interface ComponentAssetFile {
  type: RegistryFileType
  path: string
  content: string
  target?: string
}

/**
 * Represents an example asset file in the registry.
 */
export interface ExampleAssetFile {
  type: 'registry:block'
  path: string
  content: string
  target?: string
}

/**
 * Represents the structure of a package.json file.
 */
export interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

/**
 * Result of the dependency analysis for a component.
 */
export interface DependencyAnalysisResult {
  dependencies: Set<string>
  devDependencies: Set<string>
  registryDependencies: Set<string>
}

/**
 * Options for analyzing component dependencies.
 */
export interface AnalyzeDependenciesOptions {
  /** The absolute path to the file being analyzed */
  filePath?: string
  /** The current component group (e.g., 'ui', 'ai-elements') */
  currentGroup?: string
  /** If true, skip adding local registry dependencies (useful for all.json generation) */
  skipAiComponentDeps?: boolean
  /** Mapping from import package name to corresponding @types/ package names */
  typesDevDepsMap?: Map<string, string[]>
}

/**
 * Context for generating registry assets.
 */
export interface RegistryContext {
  /** The root directory of the project */
  rootDir: string
}

/**
 * Local metadata loaded from directory's registry.json.
 */
export interface RegistryItemMetadata {
  type?: RegistryItemType
  title?: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files?: {
    path: string
    type?: RegistryFileType
    target?: string
  }[]
}
