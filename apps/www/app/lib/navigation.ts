export type SidebarNavigationItem = {
  title: string
  path: string
  stem?: string
  children?: SidebarNavigationItem[]
  new?: boolean
  beta?: boolean
  soon?: boolean
  hide?: boolean
  navigation?: {
    icon?: string
  }
}

export type NavItem = {
  name: string
  href: string
}

/** Top-level section pills shown in the sidebar and mobile menu. */
export const NAV_SECTIONS: NavItem[] = [
  { name: 'Get Started', href: '/docs/introduction' },
  { name: 'Installation', href: '/docs/installation' },
  { name: 'Components', href: '/docs/components' },
  { name: 'Composables', href: '/docs/composables' },
  { name: 'Animations', href: '/docs/animation' },
]

/** Sidebar group titles (lowercased) that should never be rendered. */
export const SIDEBAR_EXCLUDED_SECTIONS: string[] = []

/** Individual page paths that should be hidden from the sidebar page list. */
export const SIDEBAR_EXCLUDED_PAGES: string[] = []

/**
 * Top-level/main site navigation items primarily used in the site header.
 * Each item follows the NavItem structure with a display name and href.
 */
export const MAIN_NAVIGATION: NavItem[] = [
  {
    href: '/docs/introduction',
    name: 'Docs',
  },
  {
    href: '/docs/components',
    name: 'Components',
  },
]
