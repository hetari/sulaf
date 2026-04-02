import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteControl,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteClear,
  AutocompleteEmpty,
} from '../default/autocomplete'

const TestAutocomplete = defineComponent({
  components: {
    Autocomplete,
    AutocompleteContent,
    AutocompleteControl,
    AutocompleteInput,
    AutocompleteList,
    AutocompleteItem,
    AutocompleteClear,
    AutocompleteEmpty,
  },
  props: {
    initialOpen: { type: Boolean, default: false },
    items: { type: Array, default: () => ['Apple', 'Banana', 'Cherry'] },
  },
  setup(props) {
    const value = ref('')
    const searchTerm = ref('')
    const open = ref(props.initialOpen)

    return { value, searchTerm, open, props }
  },
  template: `
    <Autocomplete 
      v-model="value" 
      v-model:searchTerm="searchTerm" 
      v-model:open="open"
    >
      <AutocompleteControl>
        <AutocompleteInput placeholder="Search items..." />
        <AutocompleteClear data-testid="clear-btn" />
      </AutocompleteControl>
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteItem
            v-for="item in props.items"
            :key="item"
            :value="item"
          >
            {{ item }}
          </AutocompleteItem>
          <AutocompleteEmpty v-if="props.items.length === 0">No results found.</AutocompleteEmpty>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
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

describe('Autocomplete component test', () => {
  describe('Rendering', () => {
    it('should render the autocomplete component', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: true },
      })
      await flushPromises()

      const input = wrapper.find('input')
      const control = wrapper.find('[role="combobox"]')
      const list = document.querySelector('[role="listbox"]')
      const item = document.querySelector('[role="option"]')
      const clear = wrapper.find('button[data-testid="clear-btn"]')
      const empty = wrapper.find('div[data-testid="empty"]')

      expect(empty.exists()).toBe(false)
      expect(input.exists()).toBe(true)
      expect(control.exists()).toBe(true)
      expect(list).toBeTruthy()
      expect(item).toBeTruthy()
      expect(clear.exists()).toBe(true)
      expect(input.element.placeholder).toBe('Search items...')
    })
  })

  describe('Core Binding', () => {
    it('updates searchTerm when typing', async () => {
      wrapper = mount(TestAutocomplete)
      const input = wrapper.find('input')
      await input.setValue('App')
      expect(wrapper.vm.searchTerm).toBe('App')
    })

    it('updates modelValue when an item is selected', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: true },
      })
      await flushPromises()

      const item = document.querySelector('[role="option"]')
      await (item as HTMLElement).click()
      await flushPromises()

      expect(wrapper.vm.value).toBe('Apple')
    })
  })

  describe('Visibility Baseline', () => {
    it('renders items when open', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: true },
      })
      await flushPromises()
      const items = document.querySelectorAll('[role="option"]')
      expect(items.length).toBe(3)
    })

    it('renders empty state when no items are provided', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: true, items: [] },
      })
      await flushPromises()
      expect(document.body.textContent).toContain('No results found.')
    })
  })

  describe('Primary Interaction', () => {
    it('selects correct value on item click', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: true },
      })
      await flushPromises()
      const items = document.querySelectorAll('[role="option"]')
      await (items[1] as HTMLElement).click()
      await flushPromises()
      expect(wrapper.vm.value).toBe('Banana')
    })

    it('resets searchTerm when clear button is clicked', async () => {
      wrapper = mount(TestAutocomplete)
      await wrapper.find('input').setValue('Test')
      expect(wrapper.vm.searchTerm).toBe('Test')

      await wrapper.find('[data-testid="clear-btn"]').trigger('click')
      await flushPromises()
      expect(wrapper.vm.searchTerm).toBe('')
    })
  })
})
