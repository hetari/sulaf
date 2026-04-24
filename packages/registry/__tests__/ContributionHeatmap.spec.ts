import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi, type Mock } from 'vitest'
import { defineComponent, ref } from 'vue'
import type * as VueUse from '@vueuse/core'
import { useFetch } from '@vueuse/core'
import {
  Heatmap,
  HeatmapHeader,
  HeatmapContent,
  HeatmapGrid,
  HeatmapCell,
  HeatmapRow,
} from '../components/contribution-heatmap'

// Mock useFetch to avoid network errors and control responses
vi.mock('@vueuse/core', async importOriginal => {
  const original = await importOriginal<typeof VueUse>()
  return {
    ...original,
    useFetch: vi.fn<typeof original.useFetch>(),
  }
})

// A more complete test component for GitHub scenarios
const TestHeatmapWithGithub = defineComponent({
  components: {
    Heatmap,
    HeatmapHeader,
    HeatmapContent,
    HeatmapGrid,
    HeatmapCell,
    HeatmapRow,
  },
  props: {
    githubUsername: { type: String, default: undefined },
    data: { type: Object, default: () => ({}) },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  setup() {
    const clickedCell = ref<any>(null)
    return { clickedCell }
  },
  template: `
    <Heatmap 
      :data="data" 
      :githubUsername="githubUsername"
      :startDate="startDate" 
      :endDate="endDate" 
      @click:cell="clickedCell = $event"
    >
      <template #default="{ githubProfile }">
        <div v-if="githubProfile" data-testid="profile-name">{{ githubProfile.name }}</div>
        <div v-else data-testid="profile-name">No Profile</div>
        
        <HeatmapContent v-slot="{ isLoading, isError }">
          <HeatmapHeader v-if="!isLoading && !isError" v-slot="{ totalContributions }">
            <div data-testid="total">{{ totalContributions }} contributions</div>
          </HeatmapHeader>
          <div v-if="isLoading" data-testid="loading">Loading contributions...</div>
          <div v-else-if="isError" data-testid="error">Error fetching contributions.</div>
          <HeatmapGrid v-else v-slot="{ cellGrid }">
            <HeatmapRow v-for="row in cellGrid" :key="row[0].date.toISOString()">
              <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
            </HeatmapRow>
          </HeatmapGrid>
        </HeatmapContent>
      </template>
    </Heatmap>
  `,
})

// Original simple test component (retained for basic tests)
const SimpleTestHeatmap = defineComponent({
  components: {
    Heatmap,
    HeatmapHeader,
    HeatmapContent,
    HeatmapGrid,
    HeatmapCell,
    HeatmapRow,
  },
  props: {
    data: { type: Object, default: () => ({}) },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  setup() {
    const clickedCell = ref<any>(null)
    return { clickedCell }
  },
  template: `
    <Heatmap 
      :data="data" 
      :startDate="startDate" 
      :endDate="endDate" 
      @click:cell="clickedCell = $event"
    >
      <HeatmapHeader v-slot="{ totalContributions }">
        <div data-testid="total">{{ totalContributions }}</div>
      </HeatmapHeader>
      <HeatmapContent>
        <HeatmapGrid v-slot="{ cellGrid }">
          <HeatmapRow v-for="row in cellGrid" :key="row[0].date.toISOString()">
            <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
          </HeatmapRow>
        </HeatmapGrid>
      </HeatmapContent>
    </Heatmap>
  `,
})

let wrapper: any

afterEach(async () => {
  if (wrapper) wrapper.unmount()
  vi.restoreAllMocks()
  await flushPromises()
})

describe('ContributionHeatmap Basic Data Test', () => {
  const startDate = new Date('2024-01-01')
  const endDate = new Date('2024-01-07')

  it('renders correctly with provided local data', async () => {
    // Setup mock to return no GitHub data, so local data is used
    ;(useFetch as Mock).mockImplementation(() => {
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

    const data = { '2024-01-01': 10 }
    wrapper = mount(SimpleTestHeatmap, {
      props: { data, startDate, endDate },
    })
    await flushPromises()

    expect(wrapper.find('[data-testid="total"]').text()).toBe('10')
    expect(wrapper.findComponent(HeatmapCell).exists()).toBe(true)

    const cell = wrapper.find('[data-date="2024-01-01"]')
    expect(cell.exists()).toBe(true)
    expect(cell.attributes('data-level')).toBe('4')
  })

  it('handles cell click events with local data', async () => {
    // Setup mock to return no GitHub data, so local data is used
    ;(useFetch as Mock).mockImplementation(() => {
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

    const data = { '2024-01-01': 5 }
    wrapper = mount(SimpleTestHeatmap, {
      props: { data, startDate, endDate },
    })
    await flushPromises()

    const cell = wrapper.find('[data-date="2024-01-01"]')
    await cell.trigger('click')

    expect(wrapper.vm.clickedCell).toBeDefined()
    expect(wrapper.vm.clickedCell.key).toBe('2024-01-01')
  })
})

describe('ContributionHeatmap GitHub Integration Test', () => {
  const githubUsername = 'testuser'
  const startDate = new Date('2023-01-01')
  const endDate = new Date('2023-01-07')

  it('shows loading state when fetching GitHub data', async () => {
    ;(useFetch as Mock).mockImplementation((u: any) => {
      const url = typeof u === 'string' ? u : u.value || ''
      if (url.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(null),
              isFetching: ref(true),
              error: ref(null),
            }),
          }),
        }
      }
      // For profile data, assume it's not loading for this test
      if (url.includes('api.github.com/users')) {
        return {
          get: () => ({
            json: () => ({
              data: ref({ name: 'Test User' }),
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

    wrapper = mount(TestHeatmapWithGithub, {
      props: { githubUsername, startDate, endDate },
    })
    await flushPromises()

    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="total"]').exists()).toBe(false)
  })

  it('shows error state when GitHub data fetch fails', async () => {
    ;(useFetch as Mock).mockImplementation((u: any) => {
      const url = typeof u === 'string' ? u : u.value || ''
      if (url.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(null),
              isFetching: ref(false),
              error: ref(new Error('Failed to fetch')),
            }),
          }),
        }
      }
      // For profile data, assume it succeeds
      if (url.includes('api.github.com/users')) {
        return {
          get: () => ({
            json: () => ({
              data: ref({ name: 'Test User' }),
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

    wrapper = mount(TestHeatmapWithGithub, {
      props: { githubUsername, startDate, endDate },
    })
    await flushPromises()

    expect(wrapper.find('[data-testid="error"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="total"]').exists()).toBe(false)
  })

  it('renders GitHub contributions and profile data', async () => {
    const mockContributions = {
      contributions: [[{ date: '2023-01-01', contributionCount: 5 }]],
      total: { lastYear: 5 },
    }
    const mockProfile = { name: 'John Doe', avatar_url: 'url', login: 'johndoe' }

    ;(useFetch as Mock).mockImplementation((u: any) => {
      const url = typeof u === 'string' ? u : u.value || ''
      if (url.includes('github-contributions-api')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(mockContributions),
              isFetching: ref(false),
              error: ref(null),
            }),
          }),
        }
      }
      if (url.includes('api.github.com/users')) {
        return {
          get: () => ({
            json: () => ({
              data: ref(mockProfile),
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

    wrapper = mount(TestHeatmapWithGithub, {
      props: { githubUsername, startDate, endDate },
    })
    await flushPromises()

    expect(wrapper.find('[data-testid="profile-name"]').text()).toBe('John Doe')

    const cell = wrapper.find('[data-date="2023-01-01"]')
    expect(cell.exists()).toBe(true)
    expect(cell.attributes('data-level')).toBe('2') // 5/2 = 2.5 -> 2
  })
})
