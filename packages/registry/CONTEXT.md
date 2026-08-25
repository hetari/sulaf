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

### Theme

A passive configuration entity defining CSS variables, color palettes, and typography design tokens referenced by components.
