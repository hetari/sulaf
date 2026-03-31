import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'

export type AutocompleteProps = ComboboxRootProps & {
  searchTerm?: string
}

export type AutocompleteEmits = ComboboxRootEmits & {
  'update:searchTerm': [searchTerm: string]
}
