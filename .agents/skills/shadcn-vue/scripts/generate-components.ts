/**
 * Generates shadcn-vue component docs from GitHub repository
 * Run: npx -y tsx skills/shadcn-vue/scripts/generate-shadcn-components.ts
 *
 * Creates:
 *   - references/components.md (index)
 *   - components/<component>.md (per-component details)
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'unovue/shadcn-vue'
const BRANCH = 'dev'
const API_URL = `https://api.github.com/repos/${REPO}/contents/apps/v4/content/docs/components?ref=${BRANCH}`

interface ComponentMetaLinks {
  doc?: string
  api?: string
}

interface ComponentFrontmatter {
  title?: string
  description?: string
  component?: boolean
  links?: ComponentMetaLinks
}

interface ComponentMeta extends ComponentFrontmatter {
  name: string
  content: string
}

interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  _links: {
    self: string
    git: string
    html: string
  }
}

async function fetchComponentList(): Promise<GitHubFile[]> {
  const headers: Record<string, string> = {}
  const token = process.env.GITHUB_TOKEN
  if (token)
    headers.Authorization = `Bearer ${token}`
  try {
    const res = await fetch(API_URL, { headers })
    if (!res.ok)
      throw new Error(`Failed to fetch component list: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return data.filter((f: GitHubFile) => f.type === 'file' && f.name.endsWith('.md'))
  }
  catch (error) {
    console.error('Error fetching component list:', error)
    return []
  }
}

function parseFrontmatter(content: string): { meta: ComponentFrontmatter, content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/
  const match = content.match(frontmatterRegex)

  if (!match)
    return { meta: {}, content }

  const frontmatter = match[1]
  const meta: ComponentFrontmatter = {}
  const lines = frontmatter.split('\n')

  for (const line of lines) {
    if (line.trim() === '')
      continue
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1)
      continue
    const isNested = line.startsWith('  ')
    const key = line.slice(0, colonIndex).trim()
    let value: string | boolean = line.slice(colonIndex + 1).trim()

    if (value === 'true')
      value = true
    else if (value === 'false')
      value = false

    if (isNested && meta.links)
      meta.links[key as keyof ComponentMetaLinks] = value as string
    else if (key === 'links')
      meta.links = {}
    else if (key === 'title' || key === 'description')
      meta[key] = value as string
    else if (key === 'component')
      meta[key] = value as boolean
  }

  const remainingContent = content.slice(match[0].length)
  return { meta, content: remainingContent }
}

async function fetchComponent(file: GitHubFile): Promise<ComponentMeta | null> {
  try {
    const res = await fetch(file.download_url)
    if (!res.ok)
      return null
    const content = await res.text()
    const { meta, content: markdownContent } = parseFrontmatter(content)

    const componentName = file.name.replace('.md', '')

    return {
      name: componentName,
      title: meta.title || componentName,
      description: meta.description || '',
      component: meta.component || false,
      links: meta.links,
      content: markdownContent,
    }
  }
  catch {
    return null
  }
}

function escapeMarkdown(str: string): string {
  return str.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

async function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const baseDir = join(__dirname, '..')
  const componentsDir = join(baseDir, 'components')
  mkdirSync(componentsDir, { recursive: true })

  console.log('Generating shadcn-vue component docs...')

  const files = await fetchComponentList()
  console.log(`Found ${files.length} component files`)

  if (files.length === 0) {
    console.error('No component files found. Aborting to avoid wiping existing docs.')
    process.exit(1)
  }

  const components: ComponentMeta[] = []

  for (const file of files) {
    console.log(`Fetching ${file.name}...`)
    const component = await fetchComponent(file)
    if (component)
      components.push(component)
  }

  console.log(`Successfully parsed ${components.length} components`)

  const sortedComponents = components.sort((a, b) => a.name.localeCompare(b.name))

  const index: string[] = []
  index.push('# Shadcn Vue Components')
  index.push('')
  index.push(`> Total components: ${sortedComponents.length}`)
  index.push('')
  index.push('| Component | Description | File |')
  index.push('|-----------|-------------|------|')

  for (const comp of sortedComponents) {
    const file = `components/${comp.name}.md`
    const badge = comp.component ? '`component`' : ''
    const docLink = comp.links?.doc ? `[doc](${comp.links.doc})` : ''
    index.push(`| **${comp.title}** | ${escapeMarkdown(comp.description)} ${badge} ${docLink} | \`${file}\` |`)
  }

  index.push('')

  writeFileSync(join(baseDir, 'references/components.md'), index.join('\n'))
  console.log('✓ Generated references/components.md (index)')

  for (const comp of sortedComponents) {
    const lines: string[] = []
    lines.push(`# ${comp.title}`)
    lines.push('')
    lines.push(`**Description:** ${comp.description}`)
    lines.push('')

    if (comp.links) {
      const links: string[] = []
      if (comp.links.doc)
        links.push(`[Documentation](${comp.links.doc})`)
      if (comp.links.api)
        links.push(`[API Reference](${comp.links.api})`)
      if (links.length > 0) {
        lines.push(`**Links:** ${links.join(' | ')}`)
        lines.push('')
      }
    }

    lines.push('---')
    lines.push('')
    lines.push(comp.content)

    const filename = `${comp.name}.md`
    writeFileSync(join(componentsDir, filename), lines.join('\n'))
    console.log(`✓ Generated components/${filename}`)
  }

  console.log(`\nDone! Generated ${sortedComponents.length + 1} files.`)
}

main().catch(console.error)
