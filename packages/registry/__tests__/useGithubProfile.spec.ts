import { describe, it, expect, afterEach, vi, type Mock } from 'vitest'
import { ref } from 'vue'
import type * as VueUse from '@vueuse/core'
import { useFetch } from '@vueuse/core'
import { useGithubProfile } from '../hooks/use-github-profile'

vi.mock('@vueuse/core', async importOriginal => {
  const original = await importOriginal<typeof VueUse>()
  return {
    ...original,
    useFetch: vi.fn<typeof original.useFetch>(),
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useGithubProfile composable (TDD)', () => {
  it('requests contributions from the active jogruber endpoint by default with y=last', () => {
    const requestedUrls: string[] = []
    ;(useFetch as Mock).mockImplementation((urlRef: any) => {
      const rawUrl = typeof urlRef === 'string' ? urlRef : urlRef?.value || ''
      requestedUrls.push(rawUrl)
      return {
        get: () => ({
          json: () => ({
            data: ref(null),
            isFetching: ref(false),
            error: ref(null),
          }),
        }),
      }
    })

    useGithubProfile('hetari')

    const contributionsUrl = requestedUrls.find(u => u.includes('github-contributions'))
    expect(contributionsUrl).toBeDefined()
    expect(contributionsUrl).toContain('github-contributions-api.jogruber.de/v4/hetari')
    expect(contributionsUrl).toContain('y=last')
  })

  it('correctly parses real API response with total.lastYear and flat contributions array with count', () => {
    const mockContributionsResponse = {
      total: {
        lastYear: 2256,
      },
      contributions: [
        { date: '2026-09-05', count: 0, level: 0 },
        { date: '2026-09-06', count: 12, level: 3 },
      ],
    }

    const mockProfileResponse = {
      login: 'hetari',
      name: 'Ebraheem Alhetari',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345',
      bio: 'Software Engineer',
      followers: 42,
    }

    ;(useFetch as Mock).mockImplementation((urlRef: any) => {
      const rawUrl = typeof urlRef === 'string' ? urlRef : urlRef?.value || ''
      if (rawUrl.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(mockContributionsResponse),
              isFetching: ref(false),
              error: ref(null),
            }),
          }),
        }
      }
      if (rawUrl.includes('api.github.com/users')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(mockProfileResponse),
              isFetching: ref(false),
              error: ref(null),
            }),
          }),
        }
      }
      return {
        get: () => ({
          json: () => ({ data: ref(null), isFetching: ref(false), error: ref(null) }),
        }),
      }
    })

    const { profile, contributionData, totalContributions, isLoading, isError } =
      useGithubProfile('hetari')

    expect(isLoading.value).toBe(false)
    expect(isError.value).toBe(false)
    expect(profile.value?.name).toBe('Ebraheem Alhetari')
    expect(totalContributions.value).toBe(2256)
    expect(contributionData.value['2026-09-06']).toBe(12)
    expect(contributionData.value['2026-09-05']).toBe(0)
  })

  it('handles all-years response format and sums total contributions', () => {
    const mockContributionsResponse = {
      total: {
        '2024': 100,
        '2025': 200,
        '2026': 300,
      },
      contributions: [
        { date: '2024-01-01', count: 5, level: 1 },
        { date: '2025-01-01', count: 10, level: 2 },
      ],
    }

    ;(useFetch as Mock).mockImplementation((urlRef: any) => {
      const rawUrl = typeof urlRef === 'string' ? urlRef : urlRef?.value || ''
      if (rawUrl.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(mockContributionsResponse),
              isFetching: ref(false),
              error: ref(null),
            }),
          }),
        }
      }
      return {
        get: () => ({
          json: () => ({ data: ref(null), isFetching: ref(false), error: ref(null) }),
        }),
      }
    })

    const { totalContributions, contributionData } = useGithubProfile('hetari', { year: 'all' })

    expect(totalContributions.value).toBe(600)
    expect(contributionData.value['2024-01-01']).toBe(5)
    expect(contributionData.value['2025-01-01']).toBe(10)
  })

  it('supports legacy / alternate shape with contributionCount and totalContributions number', () => {
    const legacyResponse = {
      totalContributions: 15,
      contributions: [
        [
          { date: '2024-01-01', contributionCount: 7 },
          { date: '2024-01-02', contributionCount: 8 },
        ],
      ],
    }

    ;(useFetch as Mock).mockImplementation((urlRef: any) => {
      const rawUrl = typeof urlRef === 'string' ? urlRef : urlRef?.value || ''
      if (rawUrl.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(legacyResponse),
              isFetching: ref(false),
              error: ref(null),
            }),
          }),
        }
      }
      return {
        get: () => ({
          json: () => ({ data: ref(null), isFetching: ref(false), error: ref(null) }),
        }),
      }
    })

    const { totalContributions, contributionData } = useGithubProfile('hetari')

    expect(totalContributions.value).toBe(15)
    expect(contributionData.value['2024-01-01']).toBe(7)
    expect(contributionData.value['2024-01-02']).toBe(8)
  })

  it('falls back to summing contribution counts when total object is missing', () => {
    const noTotalResponse = {
      contributions: [
        { date: '2024-01-01', count: 10, level: 2 },
        { date: '2024-01-02', count: 20, level: 3 },
      ],
    }

    ;(useFetch as Mock).mockImplementation((urlRef: any) => {
      const rawUrl = typeof urlRef === 'string' ? urlRef : urlRef?.value || ''
      if (rawUrl.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(noTotalResponse),
              isFetching: ref(false),
              error: ref(null),
            }),
          }),
        }
      }
      return {
        get: () => ({
          json: () => ({ data: ref(null), isFetching: ref(false), error: ref(null) }),
        }),
      }
    })

    const { totalContributions } = useGithubProfile('hetari')

    expect(totalContributions.value).toBe(30)
  })

  it('handles empty or undefined username gracefully', () => {
    const { profile, contributionData, totalContributions, isLoading, isError } =
      useGithubProfile(undefined)

    expect(isLoading.value).toBe(false)
    expect(isError.value).toBe(false)
    expect(profile.value).toBeNull()
    expect(totalContributions.value).toBe(0)
    expect(contributionData.value).toEqual({})
  })

  it('reports error when contributions fetch fails', () => {
    ;(useFetch as Mock).mockImplementation((urlRef: any) => {
      const rawUrl = typeof urlRef === 'string' ? urlRef : urlRef?.value || ''
      if (rawUrl.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(null),
              isFetching: ref(false),
              error: ref(new Error('User not found')),
            }),
          }),
        }
      }
      return {
        get: () => ({
          json: () => ({ data: ref(null), isFetching: ref(false), error: ref(null) }),
        }),
      }
    })

    const { isError, totalContributions } = useGithubProfile('nonexistent-user-123')

    expect(isError.value).toBe(true)
    expect(totalContributions.value).toBe(0)
  })
})
