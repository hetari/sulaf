# Registry Bounded Context

Glossary and canonical definitions for the Sulaf Registry core.

## Domain Terms

### Primitive (`ui`)

A low-level, headless or foundational UI element (e.g., `Button`, `Dialog`, `Input`). Direct building blocks that wrap Radix / Reka UI or core HTML primitives.

### Composite Component (`component`)

A reusable UI pattern combining multiple primitives with application logic and state management.

### Block (`block`)

A full section layout or complex multi-component page section (e.g., `HeroSection`, `DashboardHeader`, `PricingTable`).

### Composable / Hook (`hook`)

A pure Vue composition function (`.ts` file starting with `use`) encapsulating reactive logic without template markup (e.g., `useAutocomplete`). Hooks can exist as standalone registry items or be dynamically bundled into consuming components.

### Registry Item

An atomic unit of publication and installation in Sulaf identified by a unique `name` slug. Each item includes:

- **Files**: Implementation `.vue` and `.ts` files.
- **Registry Dependencies**: Internal references to other Registry Items needed for compilation.
- **NPM Dependencies**: External third-party package dependencies.
- **Metadata**: Automatically derived from directory structure, AST import analysis, and registry configuration.

### Registry Bundle

An aggregate registry payload (e.g., `all.json`) combining multiple Registry Items with internal registry dependencies flattened into a single target bundle for one-shot installation.

### Dependency Resolver

A build-time module that takes source code (`.vue` script blocks or `.ts` files) as input, parses import specifiers via regex (no AST tooling), and produces a classified `DependencyResult`: npm `dependencies`, npm `devDependencies` (including resolved `@types/` packages), and internal `registryDependencies` (slugs of other Registry Items). Owns SFC script extraction internally — callers pass raw file content and the resolver decides how to extract parseable code based on file extension. "Import analysis" is the mechanism; dependency resolution is the purpose.

### Source Collector

A build-time module that walks configured source directories (`srcDirs`), reads file contents, applies alias replacements, flattens hook paths, and groups files by slug. Returns a structured result: `{ components: Map<slug, CollectedFile[]>, examples: ExampleFile[] }`. Does not analyze dependencies — that responsibility belongs to the Dependency Resolver.

### Registry Emitter

A pure build-time module that takes grouped, pre-analyzed component data and produces serialized registry JSON output in-memory as `{ path: string, content: string }[]`. Handles Zod schema validation, hook bundling, and per-component JSON generation. Does **not** write to disk — the entry-point script handles filesystem output.

### Hook Bundling

The strategy of inlining a Hook's files directly into a consuming component's registry JSON output, rather than listing the Hook as a `registryDependency`. This exists because the `shadcn-vue` CLI does not always resolve transitive `registryDependencies` for hooks gracefully. When the emitter encounters a component that depends on a hook Registry Item, the hook's files are added to the component's `files` array and the hook is removed from `registryDependencies`.

### Theme

A passive configuration entity defining CSS variables, color palettes, and typography design tokens referenced by components.
