import { createHash } from 'node:crypto'
import { readdirSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// Compute the docs version at BUILD TIME by hashing all .md files.
// This avoids reading the filesystem at request time, which fails in serverless.
function computeDocsVersion(): string {
  try {
    const contentDir = join(__dirname, 'content')
    const files = getAllMdFiles(contentDir)
    const hash = createHash('md5')
    for (const file of files.sort()) {
      const stats = statSync(file)
      hash.update(`${file}:${stats.mtimeMs}`)
    }
    return hash.digest('hex').slice(0, 8)
  } catch {
    return 'unknown'
  }
}

function getAllMdFiles(dirPath: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dirPath)) {
    const full = join(dirPath, entry)
    if (statSync(full).isDirectory()) {
      getAllMdFiles(full, files)
    } else if (entry.endsWith('.md')) {
      files.push(full)
    }
  }
  return files
}

function computeLastUpdatedMap(): Map<string, string> {
  const map = new Map<string, string>()
  try {
    const root = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()
    const output = execSync('git log --pretty=format:"%cI" --name-only -- "apps/www/content"', {
      cwd: root,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })
    const lines = output.split('\n')
    let currentDate = ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (trimmed.match(/^\d{4}-\d{2}-\d{2}T/)) {
        currentDate = trimmed
      } else {
        const fullPath = join(root, trimmed)
        if (!map.has(fullPath)) {
          map.set(fullPath, currentDate)
        }
      }
    }
  } catch {
    // skip
  }
  return map
}

const DOCS_VERSION = computeDocsVersion()
const LAST_UPDATED_MAP = computeLastUpdatedMap()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/a11y',
    '@nuxt/hints',
    'nuxt-og-image',
    '@nuxt/content',
    'nuxt-shiki',
    '@nuxt/fonts',
  ],

  runtimeConfig: {
    docsVersion: DOCS_VERSION,
  },

  routeRules: {
    // redirect from /docs/animation to /docs/components/animation
    '/docs/animation': {
      redirect: '/docs/components',
    },
    // Raw markdown content endpoint
    '/raw/**': {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    },
  },

  ogImage: {
    fontSubsets: ['Geist:400', 'Geist:500', 'Geist:600'],
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['reka-ui', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-vue-next'],
    },
    plugins: [
      // https://github.com/tailwindlabs/tailwindcss/discussions/19655
      tailwindcss(),
    ],
  },

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
  },

  components: [
    {
      path: '~/components',
      ignore: ['_internal/*', '_internal/**/*', 'examples/*', 'examples/**/*'],
    },
    { path: '~/components/demo', pathPrefix: false },
    { path: '~/components/content', global: true, pathPrefix: false },
  ],

  shiki: {
    defaultTheme: {
      light: 'github-light-default',
      dark: 'github-dark',
    },
    bundledLangs: [
      'ts',
      'tsx',
      'js',
      'vue',
      'html',
      'json',
      'bash',
      'astro',
      'toml',
      'yaml',
      'md',
      'markdown',
    ],
  },

  fonts: {
    families: [{ name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] }],
    defaults: {
      weights: [400, 500, 600, 700],
    },
  },
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
    // required to prevent error related to better-sqlite3 during build and deploy
    experimental: {
      sqliteConnector: 'better-sqlite3',
    },
  },

  build: {
    transpile: ['vue-sonner'],
  },

  nitro: {
    devStorage: {
      cache: {
        driver: 'memory',
      },
    },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false,
      autoSubfolderIndex: false,
    },
  },
  app: {
    head: {
      link: [
        // { rel: "manifest", href: "/site.webmanifest" },
        { rel: 'shortcut icon', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        {
          name: 'keywords',
          content: 'Nuxt,Vue,Tailwind CSS,Components,shadcn',
        },
      ],
    },
  },
  hooks: {
    'content:file:afterParse': function ({ file, content }) {
      if (file.path && file.path.endsWith('.md')) {
        const fullPath = resolve(file.path)
        const date = LAST_UPDATED_MAP.get(fullPath)
        if (date) {
          content.lastUpdated = date
        } else {
          try {
            const stats = statSync(fullPath)
            content.lastUpdated = stats.mtime.toISOString()
          } catch {
            content.lastUpdated = new Date().toISOString()
          }
        }
      }
    },
  },
})
