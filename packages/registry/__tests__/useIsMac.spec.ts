import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useIsMac } from '../hooks/use-is-mac'

const TestComponent = defineComponent({
  setup() {
    const isMac = useIsMac()
    return { isMac }
  },
  template: '<div>{{ isMac ? "mac" : "other" }}</div>',
})

describe('useIsMac composable', () => {
  const originalNavigator = globalThis.navigator

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    })
  })

  it('initializes to false before mounting (SSR safe)', () => {
    let capturedInitial: boolean | undefined
    const WrapperComponent = defineComponent({
      setup() {
        const isMac = useIsMac()
        capturedInitial = isMac.value
        return { isMac }
      },
      template: '<div />',
    })
    mount(WrapperComponent)
    expect(capturedInitial).toBe(false)
  })

  it('detects Mac via navigator.userAgentData.platform', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgentData: { platform: 'macOS' },
        platform: 'Win32',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
      },
      configurable: true,
      writable: true,
    })

    const wrapper = mount(TestComponent)
    await nextTick()
    await flushPromises()

    expect(wrapper.vm.isMac).toBe(true)
    expect(wrapper.text()).toBe('mac')
  })

  it('detects Mac via fallback navigator.platform', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgentData: undefined,
        platform: 'MacIntel',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
      },
      configurable: true,
      writable: true,
    })

    const wrapper = mount(TestComponent)
    await nextTick()
    await flushPromises()

    expect(wrapper.vm.isMac).toBe(true)
    expect(wrapper.text()).toBe('mac')
  })

  it('detects Mac via fallback navigator.userAgent', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgentData: undefined,
        platform: undefined,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      configurable: true,
      writable: true,
    })

    const wrapper = mount(TestComponent)
    await nextTick()
    await flushPromises()

    expect(wrapper.vm.isMac).toBe(true)
    expect(wrapper.text()).toBe('mac')
  })

  it('returns false for Linux platform', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgentData: { platform: 'Linux' },
        platform: 'Linux x86_64',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      },
      configurable: true,
      writable: true,
    })

    const wrapper = mount(TestComponent)
    await nextTick()
    await flushPromises()

    expect(wrapper.vm.isMac).toBe(false)
    expect(wrapper.text()).toBe('other')
  })

  it('returns false for Windows platform', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgentData: { platform: 'Windows' },
        platform: 'Win32',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      configurable: true,
      writable: true,
    })

    const wrapper = mount(TestComponent)
    await nextTick()
    await flushPromises()

    expect(wrapper.vm.isMac).toBe(false)
    expect(wrapper.text()).toBe('other')
  })
})
