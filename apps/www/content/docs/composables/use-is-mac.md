---
title: useIsMac
description: A composable to detect if the user is on a macOS device.
new: true

---

`useIsMac` provides a reactive way to determine if the current user is accessing your application from a Mac. This is particularly useful for displaying platform-specific keyboard shortcuts (e.g., `Cmd` vs `Ctrl`).

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
  npx sulaf@latest add use-is-mac
  ```
  ::

  ::doc-tabs-content{value="manual"}

    ::steps

      ::step
        ::manual-install{folder="use-is-mac"}
        ::
      ::

      ::step
      Update the import paths to match your project setup.
      ::

    ::

  ::

::

## Usage

You can use the hook to conditionally render content or apply logic based on the platform. The value is initialized to `false` and updated on mount to prevent SSR hydration mismatches.

```vue
<script setup lang="ts">
import { useIsMac } from '@/composables/useIsMac'

const isMac = useIsMac()
</script>

<template>
  <div>
    <p v-if="isMac">You are using a Mac. Use ⌘ + K to search.</p>
    <p v-else>You are using Windows/Linux. Use Ctrl + K to search.</p>
  </div>
</template>
```

## API Reference

### Return Values

| Value | Type | Description |
| :--- | :--- | :--- |
| `isMac` | `Ref<boolean>` | A reactive reference that is `true` if the platform is detected as macOS. |
