# Sulaf Context Map

This repository is split into distinct bounded contexts:

- **Registry Context** ([packages/registry/CONTEXT.md](file:///home/hetari/My%20Data/Work/My%20stuff/CV/sulaf/packages/registry/CONTEXT.md)): Component taxonomy, AST dependency analysis, registry generation, primitives, blocks, and hooks.
- **Primitives Context** ([packages/ui/CONTEXT.md](file:///home/hetari/My%20Data/Work/My%20stuff/CV/sulaf/packages/ui/CONTEXT.md)): Foundational UI primitives wrapping Reka UI and Tailwind, design tokens, and shared component utilities.
- **Showcase Context** ([apps/www/CONTEXT.md](file:///home/hetari/My%20Data/Work/My%20stuff/CV/sulaf/apps/www/CONTEXT.md)): Documentation website, live interactive previews, and public JSON registry endpoints.
- **CLI Context** ([packages/cli/CONTEXT.md](file:///home/hetari/My%20Data/Work/My%20stuff/CV/sulaf/packages/cli/CONTEXT.md)): Developer CLI tool for searching, resolving, and installing registry items into user projects.
- **Playground Sandbox** ([apps/playground/CONTEXT.md](file:///home/hetari/My%20Data/Work/My%20stuff/CV/sulaf/apps/playground/CONTEXT.md)): Internal development sandbox for testing components in isolation before publishing to the showcase.
