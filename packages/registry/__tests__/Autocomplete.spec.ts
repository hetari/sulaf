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
  AutocompleteTrigger,
} from '../components/autocomplete'

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
    AutocompleteTrigger,
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
        <AutocompleteTrigger data-testid="trigger">
          <span>Toggle</span>
        </AutocompleteTrigger>
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
  describe('Rendering Contract', () => {
    it('mount all components!', async () => {
      // We must pass initialOpen: true so that the ComboboxContent and its children (List, Item) render.
      wrapper = mount(TestAutocomplete, {
        props: { initialOpen: true },
        attachTo: document.body,
      })
      await flushPromises()

      // The better approach is to use `findComponent` instead of raw DOM selectors.
      // This makes tests less brittle and decouples them from exact DOM structures or ARIA roles.
      expect(wrapper.findComponent(AutocompleteInput).exists()).toBe(true)
      expect(wrapper.findComponent(AutocompleteControl).exists()).toBe(true)
      expect(wrapper.findComponent(AutocompleteTrigger).exists()).toBe(true)
      expect(wrapper.findComponent(AutocompleteContent).exists()).toBe(true)
      expect(wrapper.findComponent(AutocompleteList).exists()).toBe(true)
      expect(wrapper.findComponent(AutocompleteItem).exists()).toBe(true)
      expect(wrapper.findComponent(AutocompleteClear).exists()).toBe(true)

      // empty component won't exist because items are populated by default.
      expect(wrapper.findComponent(AutocompleteEmpty).exists()).toBe(false)
    })

    it('mounts empty component and trigger when no items are provided', async () => {
      wrapper = mount(TestAutocomplete, {
        props: { initialOpen: true, items: [] },
        attachTo: document.body,
      })
      await flushPromises()

      // Trigger is always independent of items
      expect(wrapper.findComponent(AutocompleteTrigger).exists()).toBe(true)

      // When items are empty, AutocompleteEmpty mounts and AutocompleteItem unmounts
      expect(wrapper.findComponent(AutocompleteEmpty).exists()).toBe(true)
      expect(wrapper.findComponent(AutocompleteItem).exists()).toBe(false)
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

      const items = wrapper.findAllComponents(AutocompleteItem)
      await items[0].trigger('click')
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

      const items = wrapper.findAllComponents(AutocompleteItem)
      expect(items.length).toBe(3)
    })

    it('renders empty state when no items are provided', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: true, items: [] },
      })
      await flushPromises()

      const empty = wrapper.findComponent(AutocompleteEmpty)
      expect(empty.exists()).toBe(true)
      expect(empty.text()).toBe('No results found.')
    })
  })

  describe('Primary Interaction', () => {
    it('opens dropdown when trigger is clicked', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: false },
      })
      await flushPromises()

      // Should be closed initially
      expect(wrapper.findComponent(AutocompleteList).exists()).toBe(false)

      // Click trigger
      const trigger = wrapper.findComponent(AutocompleteTrigger)
      await trigger.trigger('click')
      await flushPromises()

      // Should be open
      expect(wrapper.findComponent(AutocompleteList).exists()).toBe(true)
    })

    it('selects correct value on item click', async () => {
      wrapper = mount(TestAutocomplete, {
        attachTo: document.body,
        props: { initialOpen: true },
      })
      await flushPromises()

      const items = wrapper.findAllComponents(AutocompleteItem)
      await items[1].trigger('click')
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
