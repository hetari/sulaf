import type { Ref } from 'vue'
import { createContext } from 'reka-ui'

export interface AutocompleteContext {
  searchTerm: Ref<string>
}

const [injectAutocompleteContext, provideAutocompleteContext] =
  createContext<AutocompleteContext>('AutocompleteContext')

export { provideAutocompleteContext }

/**
 * Hook to access the Autocomplete context within sub-components.
 *
 * @returns The shared Autocomplete context.
 * @throws Error if called outside of an `<Autocomplete>` component tree.
 */
export function useAutocompleteContext(): AutocompleteContext {
  const ctx = injectAutocompleteContext()

  if (!ctx) {
    throw new Error(
      '[Autocomplete] useAutocompleteContext() was called outside of an <Autocomplete> component.\n' +
        'Make sure your component is rendered inside an <Autocomplete> root.',
    )
  }
  return ctx
}
