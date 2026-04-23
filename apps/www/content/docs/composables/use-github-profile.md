---
title: useGithubProfile
description: Fetch GitHub profile information and contribution data for a specific user.
beta: true
---

`useGithubProfile` is a composable that provides a simple way to retrieve GitHub profile details (like avatar, bio, followers) and contribution history. It uses `@vueuse/core` under the hood for efficient fetching and reactivity.

## Installation

This composable is part of the registry and can be added to your project manually.

```bash
# Required dependency
bun add @vueuse/core
```

## Usage

```vue
<script setup lang="ts">
const { profile, contributionData, totalContributions, isLoading } = useGithubProfile('octocat')
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="profile">
    <img :src="profile.avatar_url" :alt="profile.name" />
    <h1>{{ profile.name }}</h1>
    <p>{{ profile.bio }}</p>
    <p>Total Contributions (last year): {{ totalContributions }}</p>
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
