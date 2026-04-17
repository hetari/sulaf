import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { defineComponent } from 'vue'
import {
  Meter,
  MeterHeader,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '../components/meter'

const TestMeter = defineComponent({
  components: {
    Meter,
    MeterHeader,
    MeterIndicator,
    MeterLabel,
    MeterTrack,
    MeterValue,
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    min: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
      default: 'default',
    },
  },
  template: `
    <Meter :value="value" :max="max" :min="min" :label="label" :variant="variant" :size="size">
      <MeterHeader>
        <MeterLabel>{{ label }}</MeterLabel>
        <MeterValue />
      </MeterHeader>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
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

describe('Meter', () => {
  describe('Rendering Contract', () => {
    it('mounts all components with proper ARIA and data attributes', async () => {
      wrapper = mount(TestMeter, {
        props: {
          label: 'test',
          value: 25,
          min: 0,
          max: 100,
        },
      })
      await flushPromises()

      const meter = wrapper.findComponent(Meter)
      const header = wrapper.findComponent(MeterHeader)
      const track = wrapper.findComponent(MeterTrack)
      const indicator = wrapper.findComponent(MeterIndicator)
      const label = wrapper.findComponent(MeterLabel)
      const value = wrapper.findComponent(MeterValue)

      expect(meter.exists()).toBe(true)
      expect(header.exists()).toBe(true)
      expect(track.exists()).toBe(true)
      expect(indicator.exists()).toBe(true)
      expect(label.exists()).toBe(true)
      expect(value.exists()).toBe(true)

      const meterEl = wrapper.find('[data-slot="meter"]')
      expect(meterEl.attributes('role')).toBe('meter')
      expect(meterEl.attributes('aria-valuenow')).toBe('25')
      expect(meterEl.attributes('aria-valuemin')).toBe('0')
      expect(meterEl.attributes('aria-valuemax')).toBe('100')
      expect(meterEl.attributes('aria-valuetext')).toBe('25%')
      expect(meterEl.attributes('data-variant')).toBe('default')
      expect(meterEl.attributes('data-size')).toBe('default')
      expect(meterEl.attributes('data-value')).toBe('25')
      expect(meterEl.attributes('data-max')).toBe('100')
      expect(meterEl.attributes('data-min')).toBe('0')
      expect(meterEl.attributes('data-percentage')).toBe('25%')
    })
  })

  describe('Core Binding', () => {
    it('calculates the exact percentage based on value, min and max', async () => {
      wrapper = mount(TestMeter, {
        props: {
          value: 75,
          min: 0,
          max: 100,
        },
      })
      await flushPromises()

      const meterEl = wrapper.find('[data-slot="meter"]')
      expect(meterEl.attributes('aria-valuenow')).toBe('75')
      expect(meterEl.attributes('data-percentage')).toBe('75%')
    })

    it('clamps the value to max', async () => {
      wrapper = mount(TestMeter, {
        props: {
          value: 200,
          min: 0,
          max: 100,
        },
      })
      await flushPromises()

      const meterEl = wrapper.find('[data-slot="meter"]')
      expect(meterEl.attributes('data-percentage')).toBe('100%')
    })

    it('clamps the value to min', async () => {
      wrapper = mount(TestMeter, {
        props: {
          value: -50,
          min: 0,
          max: 100,
        },
      })
      await flushPromises()

      const meterEl = wrapper.find('[data-slot="meter"]')
      expect(meterEl.attributes('data-percentage')).toBe('0%')
    })
  })

  describe('Variants & Sizes Baseline', () => {
    it('changes variant properly', async () => {
      wrapper = mount(TestMeter, {
        props: { variant: 'danger' },
      })
      await flushPromises()

      const meterEl = wrapper.find('[data-slot="meter"]')
      expect(meterEl.attributes('data-variant')).toBe('danger')
    })

    it('changes size properly', async () => {
      wrapper = mount(TestMeter, {
        props: { size: 'lg' },
      })
      await flushPromises()

      const meterEl = wrapper.find('[data-slot="meter"]')
      expect(meterEl.attributes('data-size')).toBe('lg')
    })
  })
})
