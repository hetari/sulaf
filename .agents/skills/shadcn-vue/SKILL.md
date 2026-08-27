---
name: shadcn-vue
description: shadcn-vue for Vue/Nuxt with Reka UI components and Tailwind. Use for accessible UI, Auto Form, data tables, charts, dark mode, or encountering component imports, Reka UI errors.
---

# shadcn-vue

A framework for building ui, components and design systems. Components are added as source code to the user's project via the CLI.

> **IMPORTANT:** Run all CLI commands using the project's package runner: `npx shadcn-vue@latest`, `pnpm dlx shadcn-vue@latest`, or `bunx --bun shadcn-vue@latest` — based on the project's `packageManager`. Examples below use `npx shadcn-vue@latest` but substitute the correct runner for the project.

## Current Project Context

```json
!`npx shadcn-vue@latest info --json`
```

The JSON above contains the project config and installed components. Use `npx shadcn-vue@latest docs <component>` to get documentation and example URLs for any component.

## Principles

1. **Use existing components first.** Use `npx shadcn-vue@latest search` to check registries before writing custom UI. Check community registries too.
2. **Compose, don't reinvent.** Settings page = Tabs + Card + form controls. Dashboard = Sidebar + Card + Chart + Table.
3. **Use built-in variants before custom styles.** `variant="outline"`, `size="sm"`, etc.
4. **Use semantic colors.** `bg-primary`, `text-muted-foreground` — never raw values like `bg-blue-500`.

## Critical Rules

These rules are **always enforced**. Each links to a file with Incorrect/Correct code pairs.

### Styling & Tailwind → [rules/styling.md](./references/rules/styling.md)

- **`class` for layout, not styling.** Never override component colors or typography.
- **No `space-x-*` or `space-y-*`.** Use `flex` with `gap-*`. For vertical stacks, `flex flex-col gap-*`.
- **Use `size-*` when width and height are equal.** `size-10` not `w-10 h-10`.
- **Use `truncate` shorthand.** Not `overflow-hidden text-ellipsis whitespace-nowrap`.
- **No manual `dark:` color overrides.** Use semantic tokens (`bg-background`, `text-muted-foreground`).
- **Use `cn()` for conditional classes.** Don't write manual template literal ternaries.
- **No manual `z-index` on overlay components.** Dialog, Sheet, Popover, etc. handle their own stacking.

### Forms & Inputs → [rules/forms.md](./references/rules/forms.md)

- **Forms use `FieldGroup` + `Field`.** Never use raw `div` with `space-y-*` or `grid gap-*` for form layout.
- **`InputGroup` uses `InputGroupInput`/`InputGroupTextarea`.** Never raw `Input`/`Textarea` inside `InputGroup`.
- **Buttons inside inputs use `InputGroup` + `InputGroupAddon`.**
- **Option sets (2–7 choices) use `ToggleGroup`.** Don't loop `Button` with manual active state.
- **`FieldSet` + `FieldLegend` for grouping related checkboxes/radios.** Don't use a `div` with a heading.
- **Field validation uses `data-invalid` + `aria-invalid`.** `data-invalid` on `Field`, `aria-invalid` on the control. For disabled: `data-disabled` on `Field`, `disabled` on the control.

### Component Structure → [rules/composition.md](./references/rules/composition.md)

- **Items always inside their Group.** `SelectItem` → `SelectGroup`. `DropdownMenuItem` → `DropdownMenuGroup`. `CommandItem` → `CommandGroup`.
- **Dialog, Sheet, and Drawer always need a Title.** `DialogTitle`, `SheetTitle`, `DrawerTitle` required for accessibility. Use `class="sr-only"` if visually hidden.
- **Use full Card composition.** `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`. Don't dump everything in `CardContent`.
- **Button has no `isPending`/`isLoading`.** Compose with `Spinner` + `data-icon` + `disabled`.
- **`TabsTrigger` must be inside `TabsList`.** Never render triggers directly in `Tabs`.
- **`Avatar` always needs `AvatarFallback`.** For when the image fails to load.

### Use Components, Not Custom Markup → [rules/composition.md](./references/rules/composition.md)

- **Use existing components before custom markup.** Check if a component exists before writing a styled `div`.
- **Callouts use `Alert`.** Don't build custom styled divs.
- **Empty states use `Empty`.** Don't build custom empty state markup.
- **Toast via `vue-sonner`.** Use `toast()` from `vue-sonner`.
- **Use `Separator`** instead of `<hr>` or `<div class="border-t">`.
- **Use `Skeleton`** for loading placeholders. No custom `animate-pulse` divs.
- **Use `Badge`** instead of custom styled spans.

### Icons → [rules/icons.md](./references/rules/icons.md)

- **Icons in `Button` use `data-icon`.** `data-icon="inline-start"` or `data-icon="inline-end"` on the icon.
- **No sizing classes on icons inside components.** Components handle icon sizing via CSS. No `size-4` or `w-4 h-4`.
- **Pass icons as objects, not string keys.** `:icon="CheckIcon"`, not a string lookup.
- **Use project's `iconLibrary` for imports.** Check `iconLibrary` from project context. Never assume `@lucide/vue`.

### CLI

- **Apply preset codes directly with the CLI.** Use `npx shadcn-vue@latest apply <code>` for existing projects, or `npx shadcn-vue@latest init --preset <code>` when initializing.

## Key Patterns

These are the most common patterns that differentiate correct shadcn-vue code. For edge cases, see the linked rule files above.

```html
<!-- Form layout: FieldGroup + Field, not div + Label. -->
<FieldGroup>
  <Field>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

<!-- Validation: data-invalid on Field, aria-invalid on the control. -->
<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>Invalid email.</FieldDescription>
</Field>

<!-- Icons in buttons: data-icon, no sizing classes. -->
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

<!-- Spacing: gap-*, not space-y-*. -->
<div class="flex flex-col gap-4">  <!-- correct -->
<div class="space-y-4">           <!-- wrong -->

<!-- Equal dimensions: size-*, not w-* h-*. -->
<Avatar class="size-10">   <!-- correct -->
<Avatar class="w-10 h-10"> <!-- wrong -->

<!-- Status colors: Badge variants or semantic tokens, not raw colors. -->
<Badge variant="secondary">+20.1%</Badge>    <!-- correct -->
<span class="text-emerald-600">+20.1%</span> <!-- wrong -->
```

## Component Selection

| Need                       | Use                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| Button/action              | `Button` with appropriate variant                                                                   |
| Form inputs                | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider` |
| Toggle between 2–7 options | `ToggleGroup` + `ToggleGroupItem`                                                                   |
| Data display               | `Table`, `Card`, `Badge`, `Avatar`                                                                  |
| Navigation                 | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination`                                     |
| Overlays                   | `Dialog` (modal), `Sheet` (side panel), `Drawer` (bottom sheet), `AlertDialog` (confirmation)       |
| Feedback                   | `vue-sonner` (toast), `Alert`, `Progress`, `Skeleton`, `Spinner`                                   |
| Command palette            | `Command` inside `Dialog`                                                                           |
| Charts                     | `Chart` (wraps Unovis)                                                                              |
| Layout                     | `Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible`                          |
| Empty states               | `Empty`                                                                                             |
| Menus                      | `DropdownMenu`, `ContextMenu`, `Menubar`                                                            |
| Tooltips/info              | `Tooltip`, `HoverCard`, `Popover`                                                                   |

## Key Fields

The injected project context contains these key fields:

- **`aliases`** → use the actual alias prefix for imports (e.g. `@/`, `~/`), never hardcode.
- **`tailwindVersion`** → `"v4"` uses `@theme inline` blocks; `"v3"` uses `tailwind.config.js`.
- **`tailwindCssFile`** → the global CSS file where custom CSS variables are defined. Always edit this file, never create a new one.
- **`style`** → component visual treatment (e.g. `nova`, `vega`).
- **`base`** → primitive library (`reka`). Affects component APIs and available props.
- **`iconLibrary`** → determines icon imports. Use `@lucide/vue` for `lucide`, `@tabler/icons-vue` for `tabler`, etc. Never assume `@lucide/vue`.
- **`resolvedPaths`** → exact file-system destinations for components, utils, hooks, etc.
- **`framework`** → routing and file conventions (e.g. Nuxt vs Vite SPA).
- **`packageManager`** → use this for any non-shadcn-vue dependency installs (e.g. `pnpm add date-fns` vs `npm install date-fns`).

See [cli.md — `info` command](./references/cli.md#info--project-information) for the full field reference.

## Component Docs, Examples, and Usage

Run `npx shadcn-vue@latest docs <component>` to get the URLs for a component's documentation, examples, and API reference. Fetch these URLs to get the actual content.

```bash
npx shadcn-vue@latest docs button dialog select
```

**When creating, fixing, debugging, or using a component, always run `npx shadcn-vue@latest docs` and fetch the URLs first.** This ensures you're working with the correct API and usage patterns rather than guessing.

For per-component documentation, see `components/<component>.md` in this skill (70 components auto-generated from the official repo).

## Workflow

1. **Get project context** — already injected above. Run `npx shadcn-vue@latest info` again if you need to refresh.
2. **Check installed components first** — before running `add`, always check the `components` list from project context or list the `resolvedPaths.ui` directory. Don't import components that haven't been added, and don't re-add ones already installed.
3. **Find components** — `npx shadcn-vue@latest search`.
4. **Get docs and examples** — run `npx shadcn-vue@latest docs <component>` to get URLs, then fetch them. Use `npx shadcn-vue@latest view` to browse registry items you haven't installed. To preview changes to installed components, use `npx shadcn-vue@latest add --diff`.
5. **Install or update** — `npx shadcn-vue@latest add`. When updating existing components, use `--dry-run` and `--diff` to preview changes first (see [Updating Components](#updating-components) below).
6. **Fix imports in third-party components** — After adding components from community registries, check the added non-UI files for hardcoded import paths like `@/components/ui/...`. These won't match the project's actual aliases. Use `npx shadcn-vue@latest info` to get the correct `ui` alias (e.g. `@workspace/ui/components`) and rewrite the imports accordingly. The CLI rewrites imports for its own UI files, but third-party registry components may use default paths that don't match the project.
7. **Review added components** — After adding a component or block from any registry, **always read the added files and verify they are correct**. Check for missing sub-components (e.g. `SelectItem` without `SelectGroup`), missing imports, incorrect composition, or violations of the [Critical Rules](#critical-rules). Also replace any icon imports with the project's `iconLibrary` from the project context (e.g. if the registry item uses `@lucide/vue` but the project uses `hugeicons`, swap the imports and icon names accordingly). Fix all issues before moving on.
8. **Registry must be explicit** — When the user asks to add a block or component, **do not guess the registry**. If no registry is specified (e.g. user says "add a login block" without specifying `@shadcn`, etc.), ask which registry to use. Never default to a registry on behalf of the user.
9. **Switching presets** — Ask the user first: **overwrite**, **merge**, or **skip**?
   - **Overwrite**: `npx shadcn-vue@latest apply <code>`. Overwrites detected components, fonts, and CSS variables.
   - **Merge**: `npx shadcn-vue@latest init --preset <code> --force --no-reinstall`, then run `npx shadcn-vue@latest info` to list installed components, then for each installed component use `--dry-run` and `--diff` to [smart merge](#updating-components) it individually.
   - **Skip**: `npx shadcn-vue@latest init --preset <code> --force --no-reinstall`. Only updates config and CSS, leaves components as-is.
   - **Important**: Always run preset commands inside the user's project directory. `apply` only works in an existing project with a `components.json` file. The CLI automatically preserves the current base (`reka`) from `components.json`. If you must use a scratch/temp directory (e.g. for `--dry-run` comparisons), pass `--base <current-base>` explicitly — preset codes do not encode the base.

## Updating Components

When the user asks to update a component from upstream while keeping their local changes, use `--dry-run` and `--diff` to intelligently merge. **NEVER fetch raw files from GitHub manually — always use the CLI.**

1. Run `npx shadcn-vue@latest add <component> --dry-run` to see all files that would be affected.
2. For each file, run `npx shadcn-vue@latest add <component> --diff <file>` to see what changed upstream vs local.
3. Decide per file based on the diff:
   - No local changes → safe to overwrite.
   - Has local changes → read the local file, analyze the diff, and apply upstream updates while preserving local modifications.
   - User says "just update everything" → use `--overwrite`, but confirm first.
4. **Never use `--overwrite` without the user's explicit approval.**

## Quick Reference

```bash
# Create a new project.
npx shadcn-vue@latest init --name my-app --preset nova
npx shadcn-vue@latest init --name my-app --preset a2r6bw --template vite

# Initialize existing project.
npx shadcn-vue@latest init --preset nova
npx shadcn-vue@latest init --defaults  # shortcut: --template=nuxt --preset=nova (base style implied)

# Apply a preset to an existing project.
npx shadcn-vue@latest apply a2r6bw

# Add components.
npx shadcn-vue@latest add button card dialog
npx shadcn-vue@latest add --all

# Search registries.
npx shadcn-vue@latest search @shadcn -q "sidebar"

# Get component docs and example URLs.
npx shadcn-vue@latest docs button dialog select

# View registry item details (for items not yet installed).
npx shadcn-vue@latest view @shadcn/button

# Get project info.
npx shadcn-vue@latest info
npx shadcn-vue@latest info --json
```

**Named presets:** `nova`, `vega`, `maia`, `lyra`, `mira`, `luma`
**Templates:** `nuxt`, `vite`, `astro`, `laravel`
**Preset codes:** Version-prefixed base62 strings (e.g. `a2r6bw`), from [shadcn-vue.com](https://shadcn-vue.com).

---

## Quick Start (3 Minutes)

### For Vue Projects (Vite)

#### 1. Initialize shadcn-vue

```bash
npx shadcn-vue@latest init
```

**During initialization**:

- Style: `New York` or `Default` (cannot change later!)
- Base color: `Slate` (recommended)
- CSS variables: `Yes` (required for dark mode)

#### 2. Configure TypeScript Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 3. Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite"; // Tailwind v4
import path from "path";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### 4. Add Your First Component

```bash
npx shadcn-vue@latest add button
```

---

## Bundled Resources

**Templates** (`templates/`):

- `quick-setup.ts` - Complete setup guide for Vue/Nuxt with examples (190 lines)

**References** (`references/`):

- `cli.md` - CLI commands, flags, presets, templates, smart merge
- `theming.md` - Theming and `cssVariables`
- `error-catalog.md` - All 7 documented issues with solutions (267 lines)
- `component-examples.md` - All 50+ component examples with code
- `dark-mode-setup.md` - Complete dark mode implementation guide
- `data-tables.md` - Data tables with TanStack Table

**Rules** (`references/rules/`):

- `styling.md` - Semantic colors, variants, class, spacing, size, truncate, dark mode, cn(), z-index
- `forms.md` - FieldGroup, Field, InputGroup, ToggleGroup, FieldSet, validation states
- `composition.md` - Groups, overlays, Card, Tabs, Avatar, Alert, Empty, Toast, Separator, Skeleton, Badge, Button loading
- `icons.md` - data-icon, icon sizing, passing icons as objects, iconLibrary

**Component Documentation** (`components/`):

- `references/components.md` - Index of all shadcn-vue components (70)
- `components/<component>.md` - Individual component documentation with installation, usage, and examples

**Official Documentation**:

- shadcn-vue Docs: https://shadcn-vue.com
- Reka UI Docs: https://reka-ui.com
- GitHub: https://github.com/unovue/shadcn-vue

---

## When to Load References

Load these references based on the task:

1. **Load `references/rules/styling.md` when:**
   - Writing or reviewing component markup with Tailwind classes
   - User encounters styling issues or inconsistent appearance
   - Need to verify correct use of semantic tokens, spacing, sizing
   - **Trigger phrases:** "style", "color", "spacing", "gap", "dark mode", "class"

2. **Load `references/rules/forms.md` when:**
   - Building forms or working with form controls
   - User needs accessible form field patterns
   - Working with InputGroup, ToggleGroup, FieldSet, or validation states
   - **Trigger phrases:** "form", "input", "field", "validation", "toggle group"

3. **Load `references/rules/composition.md` when:**
   - Composing multiple components together
   - Building dialogs, cards, menus, tabs, or overlay components
   - User asks which component to use for a given UI pattern
   - **Trigger phrases:** "dialog", "card", "tabs", "menu", "overlay", "empty state", "alert"

4. **Load `references/rules/icons.md` when:**
   - Adding icons to buttons or other components
   - Troubleshooting icon sizing or alignment issues
   - Need to determine correct icon import package
   - **Trigger phrases:** "icon", "lucide", "tabler", "data-icon"

5. **Load `references/error-catalog.md` when:**
   - User encounters "component not found" or import errors
   - Setup commands fail or configuration issues arise
   - Tailwind CSS variables or TypeScript paths broken
   - **Trigger phrases:** "not working", "error", "fails to", "broken"

6. **Load `references/components.md` when:**
   - User asks what components are available (names, categories, status)
   - User needs to add/use a component and wants the correct install/import paths
   - You need to confirm a component exists before recommending a custom build

7. **Load `references/component-examples.md` when:**
   - User asks "how do I implement [component]?"
   - Need copy-paste examples for specific components
   - Building forms, tables, navigation, or data display
   - **Trigger phrases:** "example", "how to use", "implement", "code sample"

8. **Load `references/cli.md` when:**
   - User asks how to run the CLI (`init`, `add`, `update`, `search`, `view`, `docs`, `info`, `apply`) or what prompts mean
   - Need the exact command/flags for installing one or more components
   - Working with presets, templates, or switching presets
   - Troubleshooting CLI-related issues (registry, paths, overwrites)

9. **Load `references/dark-mode-setup.md` when:**
   - Implementing dark mode / theme switching
   - User mentions Vue 3 + Vite, Nuxt, or Astro setup
   - Need composable patterns for theme management
   - **Trigger phrases:** "dark mode", "theme", "light/dark", "color scheme"

10. **Load `references/theming.md` when:**
    - User wants to customize theme tokens via CSS variables (`cssVariables`, `:root`, `.dark`)
    - Need to wire Tailwind to CSS-variable-based colors and radii
    - Setting up/adjusting design tokens (colors, radius, typography) for shadcn-vue

11. **Load `references/data-tables.md` when:**
    - Building sortable/filterable/paginated tables
    - User mentions TanStack Table or `DataTable`
    - **Trigger phrases:** "data table", "table", "tanstack", "sorting", "pagination"

---

## Critical Setup Rules

### Always Do

✅ **Run `init` before adding components**

- Creates required configuration and utilities
- Sets up path aliases

✅ **Use CSS variables for theming** (`cssVariables: true`)

- Enables dark mode support
- Flexible theme customization

✅ **Configure TypeScript path aliases**

- Required for component imports
- Must match `components.json` aliases

✅ **Keep components.json in version control**

- Team members need same configuration
- Documents project setup

### Never Do

❌ **Don't change `style` after initialization**

- Requires complete reinstall
- Reinitialize in new directory instead

❌ **Don't mix Radix Vue and Reka UI v2**

- Incompatible component APIs
- Use one or the other

❌ **Don't skip TypeScript configuration**

- Component imports will fail
- IDE autocomplete won't work

❌ **Don't use without Tailwind CSS**

- Components are styled with Tailwind
- Won't render correctly

---

## Common Mistakes

- Running `add` before `init` and missing `components.json`.
- Using CSS variable classes without `tailwind.cssVariables: true`.
- Hardcoding `@/` imports instead of reading `aliases` from project context.
- Fetching component files from GitHub manually instead of using the CLI.
- Using `--overwrite` without user confirmation.
- Guessing registry names instead of asking the user.

---

## Configuration

shadcn-vue uses `components.json` to configure:

- Component paths (`@/components/ui`)
- Utils location (`@/lib/utils`)
- Tailwind config paths
- TypeScript paths
- Icon library
- Custom registries

**Full example:** See `templates/components.json` or generate via `npx shadcn-vue@latest init`

---

## Utils Library

The `@/lib/utils.ts` file provides the `cn()` helper for merging Tailwind classes:

- Combines multiple className strings
- Uses `clsx` + `tailwind-merge` for conflict resolution

**Auto-generated** by `shadcn-vue init` - no manual setup needed.