export const registryConfig = {
  /**
   * The base URL for the registry.
   * This is used for generating full URLs in registry JSON files.
   */
  baseUrl: 'https://sulaf-socd8d.cranl.net',

  /**
   * Directory where components should be installed in the consuming project.
   * e.g., 'ui' would install to 'components/ui/...'
   */
  componentDir: 'ui',

  /**
   * Directory containing the source components to be registered.
   */
  srcDirs: ['components', 'blocks', 'pages'],

  /**
   * Directory where the registry JSON files will be generated.
   * These should typically be served by your Nitro/Nuxt server.
   */
  outputDir: '../../apps/www/public/r',

  /**
   * Public directory where a copy of registry.json should be placed.
   */
  publicDir: '../../apps/www/public/r',

  /**
   * Information about the registry itself.
   */
  registry: {
    name: 'sulaf',
    homepage: 'https://github.com/hetari/sulaf',
  },

  /**
   * Path replacements for source code.
   * For example, replacing repository aliases with project aliases.
   */
  replacements: [
    { from: /@sulaf\/ui\/components\//g, to: '@/components/ui/' },
    { from: /@sulaf\/ui\/lib\/utils/g, to: '@/lib/utils' },
  ],

  /**
   * Dependencies to exclude from auto-discovery.
   */
  excludedDeps: [
    'vue',
    '@sulaf/ui',
    'typescript',
    // 'reka-ui'
  ],
}
