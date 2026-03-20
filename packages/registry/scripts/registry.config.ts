export const registryConfig = {
  /**
   * The base URL for the registry.
   * This is used for generating full URLs in registry JSON files.
   */
  baseUrl: 'https://sulaf.netlify.app',

  /**
   * Directory containing the source components to be registered.
   */
  srcDir: 'default',

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
    { from: /@sulaf\/ui\/components\/ui\//g, to: '@/components/ui/' },
    { from: /@sulaf\/ui\/components\/sulaf\//g, to: '@/components/sulaf/' },
  ],

  /**
   * Dependencies to exclude from auto-discovery.
   */
  excludedDeps: ['vue', '@sulaf/ui', 'typescript'],
}
