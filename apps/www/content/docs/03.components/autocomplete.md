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

::code-tabs

  ::doc-tabs-list

    ::doc-tabs-trigger{value="cli"}
    CLI
    ::

    ::doc-tabs-trigger{value="manual"}
    Manual
    ::

  ::

  ::doc-tabs-content{value="cli"}
  ```bash
  npx sulaf@latest add autocomplete
  ```
  ::

  ::doc-tabs-content{value="manual"}

    ::steps

      ::step
      Install the following dependencies:
      ::

      ```bash
      npm install reka-ui @vueuse/core lucide-vue-next
      ```

      ::step
        ::manual-install{folder="autocomplete"}
        ::
      ::

      ::step
      Update the import paths to match your project setup.
      ::

    ::

  ::

::

## API Reference

The `Autocomplete` component uses Reka UI's `Combobox` primitive under the hood, but introduces a few custom abstractions, models, and styling defaults.

### Autocomplete (Root)

The root component extends all `ComboboxRoot` properties and adds semantic handling for the search input state.

| Prop                  | Type     | Default | Description                                                                                                                                    |
| :-------------------- | :------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search-term` | `string` | `''`    | Exposes the direct value of the `AutocompleteInput`. By binding to this, you can filter your own item lists dynamically outside the component. |
