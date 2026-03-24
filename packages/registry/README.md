# Sulaf Registry System

This package manages the component registry for Sulaf. It scans the source components, analyzes their dependencies, and generates the necessary JSON files for the `shadcn-vue` CLI.

## How it Works

The registry is built using a custom script located in `scripts/registry-builder.ts`.

1. **Scanning**: The script walks through the `default/` directory. Each top-level directory under `default/` is treated as a component "group" (e.g., `default/autocomplete`).
2. **Analysis**: For each group, it reads all `.vue` and `.ts` files and uses `ts-morph` and `@vue/compiler-sfc` to extract and analyze import statements.
3. **Dependency Discovery**:
   - **NPM Dependencies**: Automatically detected from imports and cross-referenced with `package.json`.
   - **Registry Dependencies**: Automatically detected when one component imports another using project aliases (e.g., `@/components/ui/...`).
4. **Transformation**: Path aliases are replaced according to the rules in `scripts/registry.config.ts` to ensure the registry files are portable.
5. **Generation**: Individual component JSON files are generated in `apps/www/public/r/components/`, along with a global `registry.json` and a bundled `all.json`.

## Registry Types

You can specify the type of a registry item to help the CLI understand how to install it. The following types are supported:

| Type                 | Description                                                                       |
| :------------------- | :-------------------------------------------------------------------------------- |
| `registry:ui`        | **Recommended for primitives.** Use for UI components and single-file primitives. |
| `registry:component` | Use for simple, reusable components. (Default)                                    |
| `registry:block`     | Use for complex components with multiple files or example blocks.                 |
| `registry:lib`       | Use for library files and utility functions.                                      |
| `registry:hook`      | Use for Vue composables (hooks).                                                  |
| `registry:page`      | Use for page components or file-based routes.                                     |
| `registry:file`      | Use for miscellaneous files.                                                      |

## Customizing a Component

By default, every folder in `default/` is treated as a `registry:component` and its title is derived from the folder name. You can customize this by adding a `registry.json` file inside the component folder.

### Example: `default/my-component/registry.json`

```json
{
  "title": "My Premium Component",
  "description": "A high-quality component with custom metadata.",
  "type": "registry:ui",
  "dependencies": ["gsap"],
  "registryDependencies": ["button", "badge"]
}
```

### Folder Structure

```text
packages/registry/
├── default/
│   ├── autocomplete/
│   │   ├── Autocomplete.vue
│   │   ├── ...
│   │   └── registry.json   <-- Optional customization
├── scripts/
│   ├── registry/           <-- Builder logic
│   └── registry.config.ts  <-- Global config
└── README.md               <-- You are here
```

### Advanced Usage: Mixing Multiple Types

If you have a component folder containing different types of files (e.g., UI components, hooks, and utils), you can specify the `type` for each file individually in the `files` array.

#### Example: `default/autocomplete/registry.json`

```json
{
  "title": "Autocomplete",
  "type": "registry:ui",
  "files": [
    {
      "path": "use-autocomplete.ts",
      "type": "registry:hook"
    },
    {
      "path": "Autocomplete.vue",
      "type": "registry:ui"
    }
  ]
}
```

Files not explicitly listed in the `files` array will inherit the top-level `type` (or default to `registry:component`).

## Building the Registry

To regenerate the registry JSON files, run the following command from the project root:

```bash
bun registry:build
```

Or from within the `packages/registry` directory:

```bash
bun build
```
