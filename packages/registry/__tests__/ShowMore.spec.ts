import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi, type Mock } from 'vitest'
import { defineComponent, ref, watch } from 'vue'
import * as vueuse from '@vueuse/core'
import { ShowMore, ShowMoreItem, ShowMoreButton, ShowMoreContent } from '../components/show-more'

// Mock useElementSize to control truncation logic
vi.mock('@vueuse/core', () => ({
  useElementSize: vi.fn<any>(),
}))

const TestShowMore = defineComponent({
  components: {
    ShowMore,
    ShowMoreItem,
    ShowMoreButton,
    ShowMoreContent,
  },
  props: {
    threshold: { type: Number, default: 3 },
    fade: { type: Boolean, default: false },
    truncationType: { type: String, default: 'lines' },
    showToggle: { type: Boolean, default: true },
    initialValue: { type: String },
    customClass: { type: String, default: '' },
  },
  setup(props) {
    const value = ref(props.initialValue)
    watch(
      () => props.initialValue,
      val => {
        value.value = val
      },
    )

    return { value, props }
  },
  template: `
    <ShowMore 
      :threshold="props.threshold" 
      :fade="props.fade" 
      :truncation-type="props.truncationType"
      :show-toggle="props.showToggle"
      v-model="value" 
      collapsible
      :class="props.customClass"
    >
      <ShowMoreItem value="demo" v-slot="{ isTruncated }">
        <ShowMoreContent>
          <div style="height: 100px;" data-testid="content">Content</div>
        </ShowMoreContent>
        <ShowMoreButton data-testid="toggle-btn">
          {{ value === 'demo' ? 'Less' : 'More' }}
        </ShowMoreButton>
        <div v-if="isTruncated" data-testid="is-truncated">Truncated</div>
      </ShowMoreItem>
    </ShowMore>
  `,
})

let wrapper: any

afterEach(async () => {
  if (wrapper) {
    wrapper.unmount()
    wrapper = null
  }
  vi.restoreAllMocks()
  await flushPromises()
  document.body.innerHTML = ''
})

describe('ShowMore component test', () => {
  describe('Rendering Contract', () => {
    it('mount all components!', async () => {
      ;(vueuse.useElementSize as Mock).mockImplementation(
        () =>
          ({
            width: ref(100),
            height: ref(20),
            stop: vi.fn<any>(),
          }) as any,
      )

      wrapper = mount(TestShowMore, {
        attachTo: document.body,
      })
      await flushPromises()

      expect(wrapper.findComponent(ShowMore).exists()).toBe(true)
      expect(wrapper.findComponent(ShowMoreItem).exists()).toBe(true)
      expect(wrapper.findComponent(ShowMoreContent).exists()).toBe(true)
    })

    it('applies custom class to root component', async () => {
      ;(vueuse.useElementSize as Mock).mockImplementation(
        () =>
          ({
            width: ref(100),
            height: ref(20),
            stop: vi.fn<any>(),
          }) as any,
      )

      wrapper = mount(TestShowMore, {
        props: { customClass: 'custom-class' },
        attachTo: document.body,
      })
      await flushPromises()

      expect(wrapper.findComponent(ShowMore).classes()).toContain('custom-class')
    })
  })

  describe('Core State & Interaction', () => {
    it('toggles open state when button is clicked', async () => {
      let callCount = 0
      ;(vueuse.useElementSize as Mock).mockImplementation(() => {
        callCount++
        return {
          width: ref(100),
          height: ref(callCount === 1 ? 20 : 100),
          stop: vi.fn<any>(),
        } as any
      })

      wrapper = mount(TestShowMore, {
        attachTo: document.body,
      })
      await flushPromises()

      const button = wrapper.find('[data-testid="toggle-btn"]')
      expect(button.exists()).toBe(true)
      expect(wrapper.vm.value).toBeUndefined()

      await button.trigger('click')
      await flushPromises()
      expect(wrapper.vm.value).toBe('demo')

      await button.trigger('click')
      await flushPromises()
      // Reka UI clears selection on click-again when collapsible
      expect(wrapper.vm.value).toBeFalsy()
    })

    it('syncs with v-model external changes', async () => {
      ;(vueuse.useElementSize as Mock).mockImplementation(
        () =>
          ({
            width: ref(100),
            height: ref(100),
            stop: vi.fn<any>(),
          }) as any,
      )

      wrapper = mount(TestShowMore)
      await flushPromises()

      await wrapper.setProps({ initialValue: 'demo' })
      await flushPromises()
      expect(wrapper.vm.value).toBe('demo')
    })
  })

  describe('Truncation Logic', () => {
    it('hides toggle button when content is below threshold', async () => {
      let callCount = 0
      ;(vueuse.useElementSize as Mock).mockImplementation(() => {
        callCount++
        return {
          width: ref(100),
          height: ref(callCount === 1 ? 20 : 40), // 40 < 20 * 3
          stop: vi.fn<any>(),
        } as any
      })

      wrapper = mount(TestShowMore, {
        attachTo: document.body,
      })
      await flushPromises()

      expect(wrapper.find('[data-testid="toggle-btn"]').exists()).toBe(false)
    })

    it('shows toggle button when content exceeds threshold', async () => {
      let callCount = 0
      ;(vueuse.useElementSize as Mock).mockImplementation(() => {
        callCount++
        return {
          width: ref(100),
          height: ref(callCount === 1 ? 20 : 100), // 100 > 20 * 3
          stop: vi.fn<any>(),
        } as any
      })

      wrapper = mount(TestShowMore, {
        attachTo: document.body,
      })
      await flushPromises()

      expect(wrapper.find('[data-testid="toggle-btn"]').exists()).toBe(true)
    })

    it('responds to threshold prop changes', async () => {
      let callCount = 0
      ;(vueuse.useElementSize as Mock).mockImplementation(() => {
        callCount++
        // contentHeight is 50.
        // Initial threshold 3: 20 * 3 = 60. 50 < 60 -> Not truncated
        // New threshold 2: 20 * 2 = 40. 50 > 40 -> Truncated
        return {
          width: ref(100),
          height: ref(callCount % 2 === 1 ? 20 : 50),
          stop: vi.fn<any>(),
        } as any
      })

      wrapper = mount(TestShowMore, {
        props: { threshold: 3 },
        attachTo: document.body,
      })
      await flushPromises()
      expect(wrapper.find('[data-testid="toggle-btn"]').exists()).toBe(false)

      await wrapper.setProps({ threshold: 2 })
      await flushPromises()
      expect(wrapper.find('[data-testid="toggle-btn"]').exists()).toBe(true)
    })
  })

  describe('Slot Props', () => {
    it('exposes isTruncated via slot props', async () => {
      let callCount = 0
      ;(vueuse.useElementSize as Mock).mockImplementation(() => {
        callCount++
        return {
          width: ref(100),
          height: ref(callCount === 1 ? 20 : 100),
          stop: vi.fn<any>(),
        } as any
      })

      wrapper = mount(TestShowMore, {
        attachTo: document.body,
      })
      await flushPromises()

      expect(wrapper.find('[data-testid="is-truncated"]').exists()).toBe(true)
    })
  })

  describe('Prop Features', () => {
    it('applies fade effect when fade prop is true and truncated', async () => {
      let callCount = 0
      ;(vueuse.useElementSize as Mock).mockImplementation(() => {
        callCount++
        return {
          width: ref(100),
          height: ref(callCount === 1 ? 20 : 100),
          stop: vi.fn<any>(),
        } as any
      })

      wrapper = mount(TestShowMore, {
        props: { fade: true },
        attachTo: document.body,
      })
      await flushPromises()

      expect(wrapper.find('.bg-linear-to-t').exists()).toBe(true)
    })

    it('respects showToggle prop', async () => {
      let callCount = 0
      ;(vueuse.useElementSize as Mock).mockImplementation(() => {
        callCount++
        return {
          width: ref(100),
          height: ref(callCount === 1 ? 20 : 100),
          stop: vi.fn<any>(),
        } as any
      })

      wrapper = mount(TestShowMore, {
        props: { showToggle: false },
        attachTo: document.body,
      })
      await flushPromises()

      expect(wrapper.find('[data-testid="toggle-btn"]').exists()).toBe(false)
    })

    it('works with truncationType: "chars"', async () => {
      // Note: 'chars' logic currently is a fallback in Content but the prop should be accepted
      wrapper = mount(TestShowMore, {
        props: { truncationType: 'chars' },
        attachTo: document.body,
      })
      await flushPromises()
      expect(wrapper.findComponent(ShowMore).props('truncationType')).toBe('chars')
    })
  })

  describe('Advanced Configuration', () => {
    it('initializes in open state via initialValue', async () => {
      wrapper = mount(TestShowMore, {
        props: { initialValue: 'demo' },
        attachTo: document.body,
      })
      await flushPromises()
      expect(wrapper.vm.value).toBe('demo')
    })

    it('handles null/undefined initialValue', async () => {
      wrapper = mount(TestShowMore, {
        props: { initialValue: undefined },
        attachTo: document.body,
      })
      await flushPromises()
      expect(wrapper.vm.value).toBeUndefined()
    })

    it('maintains state after truncation changes', async () => {
      let height = 200
      ;(vueuse.useElementSize as Mock).mockImplementation(
        () =>
          ({
            width: ref(100),
            height: ref(height),
            stop: vi.fn<any>(),
          }) as any,
      )

      wrapper = mount(TestShowMore, {
        props: { initialValue: 'demo' },
        attachTo: document.body,
      })
      await flushPromises()
      expect(wrapper.vm.value).toBe('demo')

      // Change height to not truncated - item should still be "demo" (expanded)
      // but maybe it's not visually truncated anymore.
      height = 40
      await flushPromises()
      expect(wrapper.vm.value).toBe('demo')
    })
  })
})
