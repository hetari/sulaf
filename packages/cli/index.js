#!/usr/bin/env node

// thanks to: https://github.com/vuepont/ai-elements-vue/blob/main/packages/cli

const { spawnSync } = require('node:child_process')
const process = require('node:process')

const rawRegistryUrl = process.env.SULAF_REGISTRY_URL || 'https://sulaf-socd8d.cranl.net/r/'
const registryBaseUrl = rawRegistryUrl.endsWith('/') ? rawRegistryUrl : `${rawRegistryUrl}/`

// Function to detect the command and prefix arguments used to invoke this script
function getCommandAndArgs() {
  // Check for common package manager environment variables
  if (process.env.npm_config_user_agent) {
    const userAgent = process.env.npm_config_user_agent

    if (userAgent.includes('pnpm')) {
      return ['pnpm', ['dlx']]
    }

    if (userAgent.includes('yarn')) {
      return ['yarn', ['dlx']]
    }

    if (userAgent.includes('bun')) {
      return ['bunx', ['--bun']]
    }
  }

  // Default fallback
  return ['npx', ['-y']]
}

const [bin, prefixArgs] = getCommandAndArgs()

// Parse command line arguments
const args = process.argv.slice(2)

// Filter out options (starting with -) from component names
const components = args.filter(arg => !arg.startsWith('-'))

// Get options (flags that start with -)
const options = args.filter(arg => arg.startsWith('-'))

// Default to 'all' if no components provided
const finalComponents = components.length === 0 ? ['all'] : components

// Get the target URLs for all components
const targetUrls = finalComponents.map(component =>
  new URL(`${component}.json`, registryBaseUrl).toString(),
)

// Build command arguments array with options at the end
const commandArgs = [...prefixArgs, 'shadcn-vue@latest', 'add', ...targetUrls, ...options]

const result = spawnSync(bin, commandArgs, {
  stdio: 'inherit',
  shell: false,
})

if (result.error) {
  // eslint-disable-next-line no-console
  console.error('Failed to execute command:', result.error.message)
  process.exit(1)
} else if (result.status !== 0) {
  // eslint-disable-next-line no-console
  console.error(`Command failed with exit code ${result.status}`)
  process.exit(1)
}
