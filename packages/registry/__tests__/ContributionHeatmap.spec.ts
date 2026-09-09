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
  HeatmapFooter,
  HeatmapLegend,
  HeatmapMonths,
  HeatmapWeekdays,
  HeatmapMain,
} from '../components/contribution-heatmap'
import {
  startOfWeek,
  groupCellsByRow,
  getActualStartDate,
  getActualEndDate,
  getLevels,
  createHeatmapCells,
  getWeekdayLabels,
  getMonthMarkers,
} from '../components/contribution-heatmap/utils'

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

  it('renders GitHub contributions and profile data with real API response structure', async () => {
    const mockContributions = {
      total: {
        lastYear: 5,
      },
      contributions: [{ date: '2023-01-01', count: 5, level: 2 }],
    }
    const mockProfile = { name: 'John Doe', avatar_url: 'url', login: 'johndoe' }
    let requestedContributionsUrl = ''

    ;(useFetch as Mock).mockImplementation((u: any) => {
      const url = typeof u === 'string' ? u : u.value || ''
      if (url.includes('github-contributions-api')) {
        requestedContributionsUrl = url
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

    expect(requestedContributionsUrl).toContain('github-contributions-api.jogruber.de/v4/testuser')
    expect(wrapper.find('[data-testid="profile-name"]').text()).toBe('John Doe')
    expect(wrapper.find('[data-testid="total"]').text()).toBe('5 contributions')

    const cell = wrapper.find('[data-date="2023-01-01"]')
    expect(cell.exists()).toBe(true)
    expect(cell.attributes('data-level')).toBe('2') // 5/2 = 2.5 -> 2
  })
})

describe('ContributionHeatmap Layout & Auxiliary Subcomponents', () => {
  const FullLayoutTest = defineComponent({
    components: {
      Heatmap,
      HeatmapHeader,
      HeatmapContent,
      HeatmapMain,
      HeatmapMonths,
      HeatmapWeekdays,
      HeatmapGrid,
      HeatmapRow,
      HeatmapCell,
      HeatmapFooter,
      HeatmapLegend,
    },
    props: {
      showAllWeekdays: { type: Boolean, default: false },
    },
    template: `
      <Heatmap :data="{ '2024-01-01': 3 }" :start-date="new Date('2024-01-01')" :end-date="new Date('2024-01-14')">
        <HeatmapHeader v-slot="{ totalContributions }">
          <span>{{ totalContributions }} contributions</span>
        </HeatmapHeader>
        <HeatmapContent>
          <HeatmapMain class="custom-main">
            <HeatmapMonths class="custom-months" />
            <HeatmapWeekdays :show-all="showAllWeekdays" class="custom-weekdays" />
            <HeatmapGrid v-slot="{ cellGrid }">
              <HeatmapRow v-for="row in cellGrid" :key="row[0].date.toISOString()">
                <HeatmapCell v-for="cell in row" :key="cell.key" :cell="cell" />
              </HeatmapRow>
            </HeatmapGrid>
          </HeatmapMain>
        </HeatmapContent>
        <HeatmapFooter class="custom-footer">
          <HeatmapLegend label="Contributions" class="custom-legend" />
        </HeatmapFooter>
      </Heatmap>
    `,
  })

  it('renders HeatmapMain, HeatmapMonths, and HeatmapFooter with custom classes', async () => {
    wrapper = mount(FullLayoutTest, { attachTo: document.body })
    await flushPromises()

    const main = wrapper.findComponent(HeatmapMain)
    expect(main.exists()).toBe(true)
    expect(main.classes()).toContain('custom-main')

    const months = wrapper.findComponent(HeatmapMonths)
    expect(months.exists()).toBe(true)
    expect(months.classes()).toContain('custom-months')

    const footer = wrapper.findComponent(HeatmapFooter)
    expect(footer.exists()).toBe(true)
    expect(footer.classes()).toContain('custom-footer')
  })

  it('renders standard weekdays (Mon, Wed, Fri) when showAll is false', async () => {
    wrapper = mount(FullLayoutTest, {
      props: { showAllWeekdays: false },
      attachTo: document.body,
    })
    await flushPromises()

    const weekdays = wrapper.findComponent(HeatmapWeekdays)
    expect(weekdays.exists()).toBe(true)
    const texts = weekdays
      .findAll('span')
      .map((s: any) => s.text())
      .filter((t: string) => t.length > 0)
    expect(texts).toEqual(['Mon', 'Wed', 'Fri'])
  })

  it('renders all weekdays when showAll is true', async () => {
    wrapper = mount(FullLayoutTest, {
      props: { showAllWeekdays: true },
      attachTo: document.body,
    })
    await flushPromises()

    const weekdays = wrapper.findComponent(HeatmapWeekdays)
    const texts = weekdays
      .findAll('span')
      .map((s: any) => s.text())
      .filter((t: string) => t.length > 0)
    expect(texts).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })

  it('renders HeatmapLegend with label, swatches, and custom slots', async () => {
    const CustomLegendTest = defineComponent({
      components: { Heatmap, HeatmapFooter, HeatmapLegend },
      template: `
        <Heatmap :data="{ '2024-01-01': 5 }" :start-date="new Date('2024-01-01')" :end-date="new Date('2024-01-07')">
          <HeatmapFooter>
            <HeatmapLegend>
              <template #label><span data-testid="custom-label">My Activity</span></template>
              <template #before><span data-testid="custom-before">Min</span></template>
              <template #after><span data-testid="custom-after">Max</span></template>
            </HeatmapLegend>
          </HeatmapFooter>
        </Heatmap>
      `,
    })

    wrapper = mount(CustomLegendTest, { attachTo: document.body })
    await flushPromises()

    expect(wrapper.find('[data-testid="custom-label"]').text()).toBe('My Activity')
    expect(wrapper.find('[data-testid="custom-before"]').text()).toBe('Min')
    expect(wrapper.find('[data-testid="custom-after"]').text()).toBe('Max')
  })
})

describe('ContributionHeatmap pure utilities', () => {
  it('calculates startOfWeek correctly', () => {
    // 2024-01-03 was a Wednesday (day 3)
    const wednesday = new Date(2024, 0, 3)
    const sunday = startOfWeek(wednesday)
    expect(sunday.getDay()).toBe(0) // Sunday
    expect(sunday.getDate()).toBe(31) // Dec 31, 2023
  })

  it('groups cells by row correctly', () => {
    const mockCells: any[] = [
      { row: 0, col: 0, key: '1' },
      { row: 1, col: 0, key: '2' },
      { row: 0, col: 1, key: '3' },
      { row: 1, col: 1, key: '4' },
    ]
    const grid = groupCellsByRow(mockCells, 2)
    expect(grid.length).toBe(2)
    expect(grid[0].length).toBe(2)
    expect(grid[1].length).toBe(2)
  })

  it('computes weekday labels for 7 rows and fallback for other row counts', () => {
    expect(getWeekdayLabels(5, false)).toEqual([])
    expect(getWeekdayLabels(7, false)).toEqual(['', 'Mon', '', 'Wed', '', 'Fri', ''])
    expect(getWeekdayLabels(7, true)).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })

  it('computes month markers based on column cells', () => {
    const mockCells: any[] = [
      { col: 0, row: 0, date: new Date(2024, 0, 1) },
      { col: 1, row: 0, date: new Date(2024, 0, 8) },
      { col: 2, row: 0, date: new Date(2024, 1, 1) },
    ]
    const markers = getMonthMarkers(mockCells, 3)
    expect(markers[0]).toBe('Jan')
    expect(markers[1]).toBe(null)
    expect(markers[2]).toBe('Feb')
  })

  it('calculates actual start and end dates', () => {
    const customStart = new Date(2023, 5, 1)
    const customEnd = new Date(2023, 6, 1)

    expect(getActualStartDate(customStart)).toBe(customStart)
    expect(getActualEndDate(customEnd)).toBe(customEnd)

    const defaultStart = getActualStartDate()
    expect(defaultStart.getMonth()).toBe(0)
    expect(defaultStart.getDate()).toBe(1)

    const defaultEnd = getActualEndDate()
    expect(defaultEnd.getMonth()).toBe(11)
    expect(defaultEnd.getDate()).toBe(31)
  })

  it('generates level mappings via getLevels', () => {
    const levels = getLevels(4, level => level * 2)
    expect(levels).toEqual([
      { level: 0, contributions: 0 },
      { level: 1, contributions: 2 },
      { level: 2, contributions: 4 },
      { level: 3, contributions: 6 },
      { level: 4, contributions: 8 },
    ])
  })

  it('creates cells grid with createHeatmapCells', () => {
    const cells = createHeatmapCells({
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 7),
      data: { '2024-01-01': 4 },
      rows: 7,
      cols: 2,
      dayMs: 86400000,
      maxLevel: 4,
      getLevel: count => (count > 0 ? 2 : 0),
    })

    expect(cells.length).toBeGreaterThan(0)
    const matching = cells.find(c => c.key === '2024-01-01')
    expect(matching).toBeDefined()
    expect(matching?.contributions).toBe(4)
    expect(matching?.level).toBe(2)
  })
})
