---
title: Autocomplete
description: A searchable selection component with filtering capabilities, built on top of Reka UI Combobox.
new: true
links:
  doc: https://reka-ui.com/docs/components/combobox
  api: https://reka-ui.com/docs/components/combobox#api-reference
---

::component-preview{name="AutocompleteDemo"}
::

## Installation

::::doc-tabs{default-value="cli"}
:::doc-tabs-list
::doc-tabs-trigger{value="cli"}
Sulaf CLI
::

    ::doc-tabs-trigger{value="shadcn-vue-cli"}
    Shadcn-Vue CLI
    ::

:::

:::doc-tabs-content{value="cli"}

```bash
npx sulaf@latest add autocomplete
```

:::

:::doc-tabs-content{value="shadcn-vue-cli"}

```bash
npx shadcn-vue@latest add http://localhost:3000/r/components/autocomplete.json
```

:::
::::

## API Reference

The `Autocomplete` component uses Reka UI's `Combobox` primitive under the hood, but introduces a few custom abstractions, models, and styling defaults.

### Autocomplete (Root)

The root component extends all `ComboboxRoot` properties and adds semantic handling for the search input state.

| Prop                  | Type     | Default | Description                                                                                                                                    |
| :-------------------- | :------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search-term` | `string` | `''`    | Exposes the direct value of the `AutocompleteInput`. By binding to this, you can filter your own item lists dynamically outside the component. |

### AutocompleteControl

This is a custom sub-component designed to wrap the `AutocompleteInput`, icons, and `AutocompleteTrigger` inside a unified border container. It simulates standard text-input focus modes, hiding the raw input's outlines.

Instead of wrapping your inputs manually with HTML divs, place them directly inside an `<AutocompleteControl>`.

### AutocompleteClear

A convenience trigger component that, when clicked, immediately erases the value in `v-model:search-term` without needing custom component logic.

### AutocompleteContent

A popover container that renders the `AutocompleteList`.
**Automatic Sizing**: Our implementation automatically overrides default widths. `AutocompleteContent` will automatically map to the width of the `Autocomplete` (the trigger layout) dynamically. No `w-*` classes are required on the content itself!
