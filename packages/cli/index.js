#!/usr/bin/env node

// thanks to: https://github.com/vuepont/ai-elements-vue/blob/main/packages/cli

const { spawnSync } = require('node:child_process')
const process = require('node:process')

function resolveRegistryBaseUrl(
  rawUrl = process.env.SULAF_REGISTRY_URL || 'https://sulaf-socd8d.cranl.net/r/',
) {
  return rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`
}

function getCommandAndArgs(userAgent) {
  const ua =
    arguments.length > 0
      ? userAgent
      : typeof process !== 'undefined'
        ? process.env.npm_config_user_agent
        : undefined

  if (ua) {
    if (ua.includes('pnpm')) {
      return ['pnpm', ['dlx']]
    }

    if (ua.includes('yarn')) {
      return ['yarn', ['dlx']]
    }

    if (ua.includes('bun')) {
      return ['bunx', ['--bun']]
    }
  }

  return ['npx', ['-y']]
}

function parseCliArgs(args, baseUrl) {
  const nonOptionArgs = args.filter(arg => !arg.startsWith('-'))
  const components = nonOptionArgs[0] === 'add' ? nonOptionArgs.slice(1) : nonOptionArgs
  const options = args.filter(arg => arg.startsWith('-'))
  const finalComponents = components.length === 0 ? ['all'] : components

  const targetUrls = finalComponents.map(component =>
    new URL(`${component}.json`, baseUrl).toString(),
  )

  return {
    components: finalComponents,
    options,
    targetUrls,
  }
}

function buildCommandArgs(prefixArgs, targetUrls, options) {
  return [...prefixArgs, 'shadcn-vue@latest', 'add', ...targetUrls, ...options]
}

function runCli(
  args = process.argv.slice(2),
  env = process.env,
  { spawnSyncFn = spawnSync, exitFn = code => process.exit(code) } = {},
) {
  const rawRegistryUrl = env.SULAF_REGISTRY_URL || 'https://sulaf-socd8d.cranl.net/r/'
  const registryBaseUrl = resolveRegistryBaseUrl(rawRegistryUrl)
  const [bin, prefixArgs] = getCommandAndArgs(env.npm_config_user_agent)
  const { targetUrls, options } = parseCliArgs(args, registryBaseUrl)
  const commandArgs = buildCommandArgs(prefixArgs, targetUrls, options)

  const result = spawnSyncFn(bin, commandArgs, {
    stdio: 'inherit',
    shell: false,
  })

  if (result.error) {
    // eslint-disable-next-line no-console
    console.error('Failed to execute command:', result.error.message)
    exitFn(1)
    return
  }

  if (result.status !== 0) {
    // eslint-disable-next-line no-console
    console.error(`Command failed with exit code ${result.status}`)
    exitFn(1)
  }
}

if (require.main === module) {
  runCli()
}

module.exports = {
  getCommandAndArgs,
  resolveRegistryBaseUrl,
  parseCliArgs,
  buildCommandArgs,
  runCli,
}
