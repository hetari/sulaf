<script setup lang="ts">
import { ref } from 'vue'
import { useGithubProfile } from '#imports'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'

const username = ref('hetari')
const { profile, totalContributions, isLoading, isError } = useGithubProfile(username)

const safeBlogUrl = computed(() => {
  const raw = profile.value?.blog
  if (!raw) return ''
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : ''
  } catch {
    return ''
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <Input v-model="username" placeholder="Enter GitHub username" />

    <Card v-if="isLoading">
      <CardContent class="py-4">
        <p>Loading profile for {{ username }}...</p>
      </CardContent>
    </Card>

    <Card v-else-if="isError">
      <CardContent class="py-4 text-red-500">
        <p>Error fetching profile for {{ username }}. Please check the username.</p>
      </CardContent>
    </Card>

    <Card v-else-if="profile">
      <CardHeader class="flex flex-row items-center gap-4">
        <Avatar class="h-16 w-16">
          <AvatarImage :src="profile.avatar_url" :alt="profile.name || profile.login" />
          <AvatarFallback>{{ profile.login.slice(0, 2).toUpperCase() }}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{{ profile.name || profile.login }}</CardTitle>
          <p class="text-sm text-muted-foreground">@{{ profile.login }}</p>
        </div>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div v-if="profile.bio">
          <h4 class="font-medium leading-none">Bio</h4>
          <p class="text-sm text-muted-foreground">{{ profile.bio }}</p>
        </div>
        <Separator />
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium leading-none">Followers</h4>
            <p class="text-sm text-muted-foreground">{{ profile.followers }}</p>
          </div>
          <div>
            <h4 class="font-medium leading-none">Following</h4>
            <p class="text-sm text-muted-foreground">{{ profile.following }}</p>
          </div>
          <div>
            <h4 class="font-medium leading-none">Public Repos</h4>
            <p class="text-sm text-muted-foreground">
              {{ profile.public_repos }}
            </p>
          </div>
          <div>
            <h4 class="font-medium leading-none">Total Contributions (last year)</h4>
            <p class="text-sm text-muted-foreground">
              {{ totalContributions }}
            </p>
          </div>
        </div>
        <Separator />
        <div v-if="safeBlogUrl">
          <h4 class="font-medium leading-none">Website</h4>
          <a
            :href="safeBlogUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-500 hover:underline"
            >{{ profile.blog }}</a
          >
        </div>
        <div v-if="profile.company">
          <h4 class="font-medium leading-none">Company</h4>
          <p class="text-sm text-muted-foreground">{{ profile.company }}</p>
        </div>
        <div v-if="profile.location">
          <h4 class="font-medium leading-none">Location</h4>
          <p class="text-sm text-muted-foreground">{{ profile.location }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
