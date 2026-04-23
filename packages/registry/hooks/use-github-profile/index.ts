import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useFetch } from '@vueuse/core'

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

export interface GitHubContributionDay {
  date: string
  contributionCount: number
  color?: string
  contributionLevel?: string
}

export interface GitHubContributionsResponse {
  contributions: GitHubContributionDay[][]
  totalContributions: number
}

export interface UseGithubProfileOptions {
  username: MaybeRefOrGetter<string | undefined>
}

/**
 * Composable for fetching GitHub profile and contribution data.
 */
export function useGithubProfile(username: MaybeRefOrGetter<string | undefined>) {
  const resolvedUsername = computed(() => toValue(username))

  // Fetch GitHub User Profile
  const profileUrl = computed(() =>
    resolvedUsername.value ? `https://api.github.com/users/${resolvedUsername.value}` : '',
  )

  const {
    data: profile,
    isFetching: isLoadingProfile,
    error: profileError,
  } = useFetch(profileUrl, { refetch: true }).get().json<GitHubProfile>()

  // Fetch GitHub Contributions
  const contributionsUrl = computed(() =>
    resolvedUsername.value
      ? `https://github-contributions-api.deno.dev/${resolvedUsername.value}.json`
      : '',
  )

  const {
    data: fetchedData,
    isFetching: isLoadingContributions,
    error: contributionsError,
  } = useFetch(contributionsUrl, { refetch: true }).get().json<GitHubContributionsResponse>()

  const isLoading = computed(() => isLoadingProfile.value || isLoadingContributions.value)
  const isError = computed(() => !!profileError.value || !!contributionsError.value)

  const contributionData = computed(() => {
    if (resolvedUsername.value && fetchedData.value?.contributions) {
      return fetchedData.value.contributions.flat().reduce(
        (acc, curr) => {
          acc[curr.date] = curr.contributionCount
          return acc
        },
        {} as Record<string, number>,
      )
    }
    return {}
  })

  const totalContributions = computed(() => {
    if (resolvedUsername.value && fetchedData.value?.totalContributions) {
      return fetchedData.value.totalContributions
    }
    return 0
  })

  return {
    profile,
    contributionData,
    totalContributions,
    isLoading,
    isError,
  }
}
