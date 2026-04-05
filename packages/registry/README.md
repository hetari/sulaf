# Sulaf Registry System

This package dynamically manages the component registry for Sulaf. It programmatically scans your source components, analyzes their dependencies using AST, and generates standardized JSON files for use with the `shadcn-vue` CLI.

## How it Works

The registry is built using a custom generator script located in `scripts/registry-builder.ts`.

1. **Scanning**: The script crawls source directories defined in `registry.config.ts` (`components`, `blocks`, and `pages` by default) looking for `.vue` files and non-root `.ts` files. It also scans the `examples` directory.
2. **Analysis**: For each discovered file group, `ts-morph` and `@vue/compiler-sfc` are invoked to extract script contexts and analyze import specifiers.
3. **Dependency Discovery**:
   - **NPM Dependencies**: Discovered automatically by scanning standard module imports and cross-referencing your project's `package.json`. Includes automatic discovery of matching `@types/` packages for `devDependencies`.
   - **Registry Dependencies**: Detected transparently when internal path aliases map to other component groups (e.g., `@/components/ui/button` internally becomes a registry dependency).
4. **Transformation**: Path aliases pointing to the repository workspace (`@sulaf/ui/...`) are replaced according to the `replacements` config in `registry.config.ts`.
5. **Generation**: Individual component JSON payload definitions are bundled and placed inside output directories (e.g. `apps/www/public/r/components/`). Two primary indices are also baked out: `registry.json` and a massive bundled `all.json` for one-shot CLI commands.

## Auto-detection rules

The registry generation scripts operate without any manual configuration or `registry.json` overrides. It dynamically resolves the registry types using simple folder and filename heuristics:

| Type                 | Heuristic / Rule                                                                                 |
| :------------------- | :----------------------------------------------------------------------------------------------- |
| `registry:ui`        | Any `.vue` or `.ts` files located anywhere inside the `components/` directory.                   |
| `registry:hook`      | Any TypeScript file (`.ts`) where the file basename begins with `use` (e.g., `use-debounce.ts`). |
| `registry:block`     | Any files located inside the `examples/` directory. They are exposed as standalone blocks.       |
| `registry:component` | Any remaining components in other source directories not matched by the criteria above.          |

The registry item title is derived automatically by capitalizing and splitting the folder/group name strings (e.g., `alert-dialog` becomes "Alert Dialog").

## Folder Structure

```text
packages/registry/
├── components/          <-- Auto-mapped to 'registry:ui' and 'registry:hook'
│   └── autocomplete/
│       ├── Autocomplete.vue
│       └── use-autocomplete.ts
├── blocks/              <-- Auto-mapped to 'registry:component'
├── pages/               <-- Auto-mapped to 'registry:component'
├── examples/            <-- Rendered out purely as 'registry:block'
├── scripts/
│   ├── registry-builder.ts  <-- Generation logic
│   └── registry.config.ts   <-- Configuration boundaries and replacements
└── README.md
```

## Global Configuration (`registry.config.ts`)

You can edit `"scripts/registry.config.ts"` to tweak:

- **`srcDirs`**: Which directories should be actively walked.
- **`excludeDeps`**: Which dependencies stringently found in imports should not be bundled in outputs (e.g., `vue`).
- **`outputDir`**: Where to emit files (which is `apps/www/public/r` to expose them publicly via Nitro).
- **`replacements`**: Regex path mappings for transpiling repository paths to standard developer path configurations.

## Building the Registry

To trigger the builder and regenerate the `apps/www/public/r` contents:

From the repository root workspace:

```bash
bun registry:build
```

Or while inside the `packages/registry` directory:

```bash
bun build
```
