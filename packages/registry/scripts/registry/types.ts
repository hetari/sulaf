/**
 * Represents a component asset file in the registry.
 */
export interface ComponentAssetFile {
  type: 'registry:component'
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
