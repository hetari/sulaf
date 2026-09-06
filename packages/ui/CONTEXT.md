# Primitives Bounded Context (`packages/ui`)

Glossary and canonical definitions for the Sulaf UI Primitives package (`@sulaf/ui`).

## Domain Terms

### UI Primitives

Foundational, low-level Vue UI components (e.g., `Button`, `Dialog`, `Input`, `Accordion`, `Card`) built on top of Reka UI headless primitives and styled with Tailwind CSS. Primitives serve as the direct building blocks for composite registry items.

### Design Tokens

Passive CSS custom properties and utility abstractions defining color palettes, border radiuses, typography, and theme styling applied across primitive components.

### Component Utilities

Shared runtime helper functions (e.g., `cn` class merger utility in `@sulaf/ui/lib/utils`) consumed by primitives and composite components to resolve class name merging and dynamic styling.
