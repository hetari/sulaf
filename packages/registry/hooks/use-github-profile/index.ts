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
  count?: number
  level?: number
  contributionCount?: number
  color?: string
  contributionLevel?: string
}

export interface GitHubContributionsResponse {
  contributions: GitHubContributionDay[] | GitHubContributionDay[][]
  total?: number | Record<string, number>
  totalContributions?: number
}

export interface UseGithubProfileOptions {
  year?: MaybeRefOrGetter<string | number | undefined>
  endpoint?: MaybeRefOrGetter<string | undefined>
}

/**
 * Composable for fetching GitHub profile and contribution data.
 */
export function useGithubProfile(
  username: MaybeRefOrGetter<string | undefined>,
  options?: UseGithubProfileOptions,
) {
  const resolvedUsername = computed(() => {
    const val = toValue(username)
    return typeof val === 'string' && val.trim() ? val.trim() : undefined
  })
  const resolvedYear = computed(() => toValue(options?.year) ?? 'last')
  const resolvedEndpoint = computed(() => toValue(options?.endpoint))

  // Fetch GitHub User Profile
  const profileUrl = computed(() =>
    resolvedUsername.value
      ? `https://api.github.com/users/${resolvedUsername.value}`
      : (null as unknown as string),
  )

  const {
    data: profile,
    isFetching: isFetchingProfile,
    error: profileError,
  } = useFetch(profileUrl, {
    refetch: true,
    immediate: !!resolvedUsername.value,
    beforeFetch({ cancel }) {
      if (!resolvedUsername.value) cancel()
    },
  })
    .get()
    .json<GitHubProfile>()

  // Fetch GitHub Contributions
  const contributionsUrl = computed(() => {
    if (!resolvedUsername.value) return null as unknown as string
    if (resolvedEndpoint.value) {
      return resolvedEndpoint.value
        .replace('{username}', resolvedUsername.value)
        .replace('{year}', String(resolvedYear.value))
    }
    const yearParam =
      resolvedYear.value && resolvedYear.value !== 'all' ? `?y=${resolvedYear.value}` : ''
    return `https://github-contributions-api.jogruber.de/v4/${resolvedUsername.value}${yearParam}`
  })

  const {
    data: fetchedData,
    isFetching: isFetchingContributions,
    error: contributionsError,
  } = useFetch(contributionsUrl, {
    refetch: true,
    immediate: !!resolvedUsername.value,
    beforeFetch({ cancel }) {
      if (!resolvedUsername.value) cancel()
    },
  })
    .get()
    .json<GitHubContributionsResponse>()

  const isLoadingProfile = computed(() => !!resolvedUsername.value && isFetchingProfile.value)
  const isLoadingContributions = computed(
    () => !!resolvedUsername.value && isFetchingContributions.value,
  )
  const isProfileError = computed(() => !!resolvedUsername.value && !!profileError.value)
  const isContributionsError = computed(
    () => !!resolvedUsername.value && !!contributionsError.value,
  )

  const contributionData = computed<Record<string, number>>(() => {
    if (resolvedUsername.value && fetchedData.value?.contributions) {
      const list = Array.isArray(fetchedData.value.contributions)
        ? (fetchedData.value.contributions as any[]).flat()
        : []
      return list.reduce(
        (acc, curr) => {
          if (curr?.date) {
            acc[curr.date] = curr.count ?? curr.contributionCount ?? 0
          }
          return acc
        },
        {} as Record<string, number>,
      )
    }
    return {}
  })

  const totalContributions = computed(() => {
    if (!resolvedUsername.value || !fetchedData.value) return 0

    if (typeof fetchedData.value.totalContributions === 'number') {
      return fetchedData.value.totalContributions
    }

    const total = fetchedData.value.total
    if (typeof total === 'number') {
      return total
    }

    if (typeof total === 'object' && total !== null) {
      const yearKey = String(resolvedYear.value)
      if (typeof total[yearKey] === 'number') {
        return total[yearKey]
      }
      if (yearKey === 'last' && typeof total.lastYear === 'number') {
        return total.lastYear
      }
      return Object.entries(total).reduce(
        (acc, [key, curr]) => (key === 'lastYear' ? acc : acc + (Number(curr) || 0)),
        0,
      )
    }

    return Object.values(contributionData.value).reduce((acc, curr) => acc + (Number(curr) || 0), 0)
  })

  return {
    profile,
    contributionData,
    totalContributions,
    isLoadingProfile,
    isLoadingContributions,
    isProfileError,
    isContributionsError,
  }
}
