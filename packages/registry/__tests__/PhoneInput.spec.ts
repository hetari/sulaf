import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, afterEach } from 'vitest'
import { defineComponent, ref } from 'vue'
import {
  PhoneInput,
  PhoneInputClear,
  PhoneInputCountrySelect,
  PhoneInputField,
} from '../components/phone-input'
import {
  buildCountryOptions,
  detectCountryFromPhoneInput,
  formatPhoneInputAsYouType,
} from '../components/phone-input/utils'
import { phoneInputVariants } from '../components/phone-input'

describe('phone input utilities', () => {
  const countries = buildCountryOptions('en')

  it('keeps international input in international format while typing', () => {
    expect(formatPhoneInputAsYouType('+', 'YE')).toBe('+')

    const formatted = formatPhoneInputAsYouType('+971555123456', 'YE')

    expect(formatted.startsWith('+971')).toBe(true)
  })

  it('normalizes 00-prefixed input to international format while typing', () => {
    expect(formatPhoneInputAsYouType('00', 'YE')).toBe('+')

    const formatted = formatPhoneInputAsYouType('00 971 555 123 456', 'YE')

    expect(formatted.startsWith('+971')).toBe(true)
  })

  it('keeps plain national digits stable while typing', () => {
    expect(formatPhoneInputAsYouType('697775367671', 'YE')).toBe('697775367671')
  })

  it('detects the country from international prefixes', () => {
    const detected = detectCountryFromPhoneInput('+971555123456', countries)

    expect(detected).toBe('AE')
  })

  it('detects the country from 00-prefixed international input', () => {
    const detected = detectCountryFromPhoneInput('00 971 555 123 456', countries)

    expect(detected).toBe('AE')
  })

  it('exposes meter-like visual variants', () => {
    expect(phoneInputVariants({ variant: 'danger' })).toContain('border-red-500')
    expect(phoneInputVariants({ variant: 'success' })).toContain('border-emerald-500')
  })
})

const TestPhoneInput = defineComponent({
  components: {
    PhoneInput,
    PhoneInputField,
    PhoneInputCountrySelect,
    PhoneInputClear,
  },
  setup() {
    const value = ref('123456789')
    const country = ref<'YE'>('YE')

    return { value, country }
  },
  template: `
    <PhoneInput v-model="value" v-model:country="country">
      <PhoneInputCountrySelect />
      <PhoneInputField data-testid="phone-field" />
      <PhoneInputClear data-testid="phone-clear" />
    </PhoneInput>
  `,
})

const TestPhoneInputCountryName = defineComponent({
  components: {
    PhoneInput,
    PhoneInputField,
    PhoneInputCountrySelect,
  },
  setup() {
    const value = ref('')
    const country = ref<'US'>('US')
    const countries = [
      {
        code: 'US',
        label: 'United States',
        callingCode: '1',
        flag: '🇺🇸',
        searchText: 'United States US 1',
      },
      {
        code: 'CA',
        label: 'Canada',
        callingCode: '1',
        flag: '🇨🇦',
        searchText: 'Canada CA 1',
      },
    ]

    return { value, country, countries }
  },
  template: `
    <PhoneInput v-model="value" v-model:country="country" :countries="countries">
      <PhoneInputCountrySelect show-country-name />
      <PhoneInputField />
    </PhoneInput>
  `,
})

let wrapper: any

afterEach(async () => {
  if (wrapper) {
    wrapper.unmount()
    wrapper = null
  }
  await flushPromises()
  document.body.innerHTML = ''
})

describe('PhoneInput clear interaction', () => {
  it('clears the bound model when the clear control is clicked', async () => {
    wrapper = mount(TestPhoneInput, {
      attachTo: document.body,
    })
    await flushPromises()

    expect(wrapper.vm.value).toBe('123456789')

    await wrapper.find('[data-testid="phone-clear"]').trigger('click')
    await flushPromises()

    expect(wrapper.vm.value).toBe('')
    expect(wrapper.find('input[data-slot="input-group-control"]').element.value).toBe('')
  })
})

describe('PhoneInput country select', () => {
  it('shows the country name in dropdown items when enabled', async () => {
    wrapper = mount(TestPhoneInputCountryName, {
      attachTo: document.body,
    })
    await flushPromises()

    expect(document.body.textContent ?? '').not.toContain('Canada')

    await wrapper.find('button[aria-label^="Select country"]').trigger('click')
    await flushPromises()

    expect(document.body.textContent ?? '').toContain('Canada')
  })
})
