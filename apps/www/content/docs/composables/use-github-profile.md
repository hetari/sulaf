---
title: useGithubProfile
description: Fetch GitHub profile information and contribution data for a specific user.
beta: true
---

`useGithubProfile` is a composable that provides a simple way to retrieve GitHub profile details (like avatar, bio, followers) and contribution history. It uses `@vueuse/core` under the hood for efficient fetching and reactivity.

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
  npx sulaf@latest add use-github-profile
  ```
  ::

  ::doc-tabs-content{value="manual"}

    ::steps

      ::step
      Install the following dependencies:
      ::

      ```bash
      bun add @vueuse/core
      ```

      ::step
        ::manual-install{folder="use-github-profile"}
        ::
      ::

      ::step
      Update the import paths to match your project setup.
      ::

    ::

  ::

::

## Usage

::component-preview
---
name: GithubProfileDemo
hideCode: true
---
::

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useGithubProfile } from '#imports'

const username = ref('octocat') // Default username

const { profile, totalContributions, isLoading, isError } = useGithubProfile(username)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Input v-model="username" placeholder="Enter GitHub username" />

    <div v-if="isLoading">Loading profile for {{ username }}...</div>

    <div v-else-if="isError" class="text-red-500">
      Error fetching profile for {{ username }}. Please check the username.
    </div>

    <div v-else-if="profile">
      <img :src="profile.avatar_url" :alt="profile.name || profile.login" class="w-16 h-16 rounded-full" />
      <h1>{{ profile.name || profile.login }}</h1>
      <p>@{{ profile.login }}</p>
      <p v-if="profile.bio">{{ profile.bio }}</p>
      <p>Followers: {{ profile.followers }}</p>
      <p>Total Contributions (last year): {{ totalContributions }}</p>
    </div>
  </div>
</template>
```

## API Reference

### Parameters

| Parameter  | Type                          | Description                               |
| ---------- | ----------------------------- | ----------------------------------------- |
| `username` | `MaybeRefOrGetter<string \| undefined>` | The GitHub username to fetch data for. |

### Return Values

| Value                | Type                                     | Description                                                                 |
| -------------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| `profile`            | `Ref<GitHubProfile \| null>`             | The GitHub user profile data.                                               |
| `contributionData`   | `Ref<Record<string, number>>`            | A map of dates (YYYY-MM-DD) to contribution counts.                        |
| `totalContributions` | `Ref<number>`                            | The total number of contributions in the last year.                         |
| `isLoading`          | `Ref<boolean>`                           | Whether the data is currently being fetched.                                |
| `isError`            | `Ref<boolean>`                           | Whether an error occurred during fetching.                                  |

## Interfaces

```typescript
export interface GitHubProfile {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  location: string | null
  blog: string | null
  company: string | null
  followers: number
  following: number
  public_repos: number
  public_gists: number
  twitter_username: string | null
  html_url: string
}
```
