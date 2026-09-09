import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, afterEach } from 'vitest'
import { defineComponent, ref } from 'vue'
import {
  PhoneInput,
  PhoneInputClear,
  PhoneInputCountrySelect,
  PhoneInputField,
  PhoneFieldCountryFlag,
  validatePhoneNumber,
  getPhoneValidationState,
  isValidPhoneNumber,
  isValidPhoneNumberForCountry,
  phoneInputVariants,
} from '../components/phone-input'
import {
  buildCountryOptions,
  detectCountryFromPhoneInput,
  formatPhoneInputAsYouType,
} from '../components/phone-input/utils'

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
  it('sizes the country dropdown to match the phone input width', async () => {
    wrapper = mount(TestPhoneInput, {
      attachTo: document.body,
    })
    await flushPromises()

    await wrapper.find('button[aria-label^="Select country"]').trigger('click')
    await flushPromises()

    const popoverContent = document.body.querySelector('[data-slot="popover-content"]')
    expect(popoverContent).toBeTruthy()
    expect(popoverContent?.className).toContain('w-(--reka-popover-trigger-width)')
  })

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

describe('PhoneFieldCountryFlag component', () => {
  it('renders cdn flag image by default', () => {
    const flagWrapper = mount(PhoneFieldCountryFlag, {
      props: {
        countryCode: 'US',
        alt: 'United States Flag',
      },
    })

    const img = flagWrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://flagcdn.com/w20/us.png')
    expect(img.attributes('srcset')).toContain('https://flagcdn.com/w40/us.png 2x')
    expect(img.attributes('alt')).toBe('United States Flag')
  })

  it('defaults cdn flag alt to an empty string', () => {
    const flagWrapper = mount(PhoneFieldCountryFlag, {
      props: {
        countryCode: 'US',
      },
    })

    expect(flagWrapper.find('img').attributes('alt')).toBe('')
  })

  it('renders unicode emoji when type="unicode"', () => {
    const flagWrapper = mount(PhoneFieldCountryFlag, {
      props: {
        countryCode: 'US',
        type: 'unicode',
      },
    })

    expect(flagWrapper.find('img').exists()).toBe(false)
    expect(flagWrapper.text()).toContain('🇺🇸')
  })
})

describe('phone input validation', () => {
  it('validates phone number correctly across error conditions', () => {
    expect(validatePhoneNumber('')).toEqual({ success: true })
    expect(validatePhoneNumber('+12025550123')).toEqual({ success: true })
    expect(validatePhoneNumber('+12', 'US')).toEqual({ success: false, error: 'TOO_SHORT' })
    expect(validatePhoneNumber('not-a-number', 'US')).toEqual({
      success: false,
      error: 'INVALID_FORMAT',
    })
  })

  it('computes validation state strings', () => {
    expect(getPhoneValidationState('')).toBe('empty')
    expect(getPhoneValidationState('   ')).toBe('empty')
    expect(getPhoneValidationState('+12025550123')).toBe('valid')
    expect(getPhoneValidationState('+12', 'US')).toBe('TOO_SHORT')
  })

  it('checks phone validity helpers', () => {
    expect(isValidPhoneNumber('')).toBe(false)
    expect(isValidPhoneNumber('+12025550123')).toBe(true)
    expect(isValidPhoneNumber('123')).toBe(false)

    expect(isValidPhoneNumberForCountry('', 'US')).toBe(false)
    expect(isValidPhoneNumberForCountry('2025550123', 'US')).toBe(true)
  })
})

describe('PhoneInputField delegated attrs', () => {
  it('reflects parent updates that change or remove delegated attributes', async () => {
    const AttrTest = defineComponent({
      components: { PhoneInput, PhoneInputField },
      setup() {
        const readonly = ref(true)
        const testId = ref<string | undefined>('phone-field')
        return { readonly, testId }
      },
      template: `
        <PhoneInput model-value="">
          <PhoneInputField :readonly="readonly" :data-testid="testId" />
        </PhoneInput>
      `,
    })

    wrapper = mount(AttrTest, { attachTo: document.body })
    await flushPromises()

    const input = () => wrapper.find('input[data-slot="input-group-control"]')

    expect(input().attributes('readonly')).toBeDefined()
    expect(input().attributes('data-testid')).toBe('phone-field')

    wrapper.vm.readonly = false
    await flushPromises()
    expect(input().attributes('readonly')).toBeUndefined()

    wrapper.vm.testId = 'updated-phone-field'
    await flushPromises()
    expect(input().attributes('data-testid')).toBe('updated-phone-field')

    wrapper.vm.testId = undefined
    await flushPromises()
    expect(input().attributes('data-testid')).toBeUndefined()
  })
})

describe('PhoneInput props and variants contract', () => {
  it('renders data attributes and custom variants correctly', async () => {
    const PropsTest = defineComponent({
      components: { PhoneInput, PhoneInputField, PhoneInputClear },
      template: `
        <PhoneInput
          model-value="123"
          country="US"
          variant="danger"
          format="international"
          disabled
          required
        >
          <PhoneInputField />
          <PhoneInputClear />
        </PhoneInput>
      `,
    })

    wrapper = mount(PropsTest, { attachTo: document.body })
    await flushPromises()

    const root = wrapper.find('[data-slot="phone-input"]')
    expect(root.exists()).toBe(true)
    expect(root.attributes('data-variant')).toBe('danger')
    expect(root.attributes('data-format')).toBe('international')
    expect(root.attributes('data-country')).toBe('US')
    expect(root.attributes('data-disabled')).toBe('true')

    const input = wrapper.find('input[data-slot="input-group-control"]')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('required')).toBeDefined()
  })

  it('hides clear button when input value is empty', async () => {
    const EmptyTest = defineComponent({
      components: { PhoneInput, PhoneInputField, PhoneInputClear },
      setup() {
        const val = ref('')
        return { val }
      },
      template: `
        <PhoneInput v-model="val">
          <PhoneInputField />
          <PhoneInputClear data-testid="clear-btn" />
        </PhoneInput>
      `,
    })

    wrapper = mount(EmptyTest, { attachTo: document.body })
    await flushPromises()

    expect(wrapper.find('[data-testid="clear-btn"]').exists()).toBe(false)

    wrapper.vm.val = '555'
    await flushPromises()

    expect(wrapper.find('[data-testid="clear-btn"]').exists()).toBe(true)
  })
})
