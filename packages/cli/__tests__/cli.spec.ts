import { describe, it, expect, vi } from 'vitest'
const {
  getCommandAndArgs,
  resolveRegistryBaseUrl,
  parseCliArgs,
  buildCommandArgs,
  runCli,
} = require('../index.js')

describe('CLI - getCommandAndArgs', () => {
  it('detects pnpm dlx when user agent includes pnpm', () => {
    const [bin, prefixArgs] = getCommandAndArgs('pnpm/9.0.0 npm/? node/v20.0.0')
    expect(bin).toBe('pnpm')
    expect(prefixArgs).toEqual(['dlx'])
  })

  it('detects yarn dlx when user agent includes yarn', () => {
    const [bin, prefixArgs] = getCommandAndArgs('yarn/4.0.0 npm/? node/v20.0.0')
    expect(bin).toBe('yarn')
    expect(prefixArgs).toEqual(['dlx'])
  })

  it('detects bunx --bun when user agent includes bun', () => {
    const [bin, prefixArgs] = getCommandAndArgs('bun/1.2.0 npm/? node/v20.0.0')
    expect(bin).toBe('bunx')
    expect(prefixArgs).toEqual(['--bun'])
  })

  it('defaults to npx -y when user agent is undefined or npm', () => {
    expect(getCommandAndArgs(undefined)).toEqual(['npx', ['-y']])
    expect(getCommandAndArgs('npm/10.0.0 node/v20.0.0')).toEqual(['npx', ['-y']])
  })
})

describe('CLI - resolveRegistryBaseUrl', () => {
  it('returns default registry URL when rawUrl is undefined', () => {
    expect(resolveRegistryBaseUrl()).toBe('https://sulaf-socd8d.cranl.net/r/')
  })

  it('ensures trailing slash if missing', () => {
    expect(resolveRegistryBaseUrl('https://custom-registry.com/r')).toBe(
      'https://custom-registry.com/r/',
    )
  })

  it('preserves trailing slash if already present', () => {
    expect(resolveRegistryBaseUrl('https://custom-registry.com/r/')).toBe(
      'https://custom-registry.com/r/',
    )
  })
})

describe('CLI - parseCliArgs', () => {
  const baseUrl = 'https://sulaf-socd8d.cranl.net/r/'

  it('defaults to all.json when no components or flags are passed', () => {
    const parsed = parseCliArgs([], baseUrl)
    expect(parsed.components).toEqual(['all'])
    expect(parsed.options).toEqual([])
    expect(parsed.targetUrls).toEqual(['https://sulaf-socd8d.cranl.net/r/all.json'])
  })

  it('strips leading add keyword', () => {
    const parsed = parseCliArgs(['add', 'button'], baseUrl)
    expect(parsed.components).toEqual(['button'])
    expect(parsed.targetUrls).toEqual(['https://sulaf-socd8d.cranl.net/r/button.json'])
  })

  it('handles direct component name without add keyword', () => {
    const parsed = parseCliArgs(['button'], baseUrl)
    expect(parsed.components).toEqual(['button'])
    expect(parsed.targetUrls).toEqual(['https://sulaf-socd8d.cranl.net/r/button.json'])
  })

  it('handles multiple components', () => {
    const parsed = parseCliArgs(['button', 'input', 'show-more'], baseUrl)
    expect(parsed.components).toEqual(['button', 'input', 'show-more'])
    expect(parsed.targetUrls).toEqual([
      'https://sulaf-socd8d.cranl.net/r/button.json',
      'https://sulaf-socd8d.cranl.net/r/input.json',
      'https://sulaf-socd8d.cranl.net/r/show-more.json',
    ])
  })

  it('separates options and flags from component names', () => {
    const parsed = parseCliArgs(['-y', 'button', '--overwrite'], baseUrl)
    expect(parsed.components).toEqual(['button'])
    expect(parsed.options).toEqual(['-y', '--overwrite'])
    expect(parsed.targetUrls).toEqual(['https://sulaf-socd8d.cranl.net/r/button.json'])
  })
})

describe('CLI - buildCommandArgs', () => {
  it('assembles prefix args, shadcn-vue command, target URLs, and options in order', () => {
    const args = buildCommandArgs(
      ['--bun'],
      ['https://sulaf-socd8d.cranl.net/r/button.json'],
      ['-y', '--overwrite'],
    )

    expect(args).toEqual([
      '--bun',
      'shadcn-vue@latest',
      'add',
      'https://sulaf-socd8d.cranl.net/r/button.json',
      '-y',
      '--overwrite',
    ])
  })
})

describe('CLI - runCli execution', () => {
  it('invokes spawnSync with correct arguments and succeeds on status 0', () => {
    const mockSpawn = vi
      .fn<(...args: any[]) => { status: number | null; error: Error | null }>()
      .mockReturnValue({ status: 0, error: null })
    const mockExit = vi.fn<(code?: number) => void>()

    runCli(
      ['add', 'phone-input'],
      { npm_config_user_agent: 'bun/1.2.0' },
      {
        spawnSyncFn: mockSpawn as any,
        exitFn: mockExit,
      },
    )

    expect(mockSpawn).toHaveBeenCalledWith(
      'bunx',
      ['--bun', 'shadcn-vue@latest', 'add', 'https://sulaf-socd8d.cranl.net/r/phone-input.json'],
      {
        stdio: 'inherit',
        shell: false,
      },
    )
    expect(mockExit).not.toHaveBeenCalled()
  })

  it('handles spawnSync failure error', () => {
    const mockSpawn = vi
      .fn<(...args: any[]) => { status: number | null; error: Error | null }>()
      .mockReturnValue({
        status: null,
        error: new Error('command not found'),
      })
    const mockExit = vi.fn<(code?: number) => void>()
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    runCli(
      ['button'],
      {},
      {
        spawnSyncFn: mockSpawn as any,
        exitFn: mockExit,
      },
    )

    expect(mockConsoleError).toHaveBeenCalledWith('Failed to execute command:', 'command not found')
    expect(mockExit).toHaveBeenCalledWith(1)
    mockConsoleError.mockRestore()
  })

  it('handles non-zero exit status from child process', () => {
    const mockSpawn = vi
      .fn<(...args: any[]) => { status: number | null; error: Error | null }>()
      .mockReturnValue({ status: 2, error: null })
    const mockExit = vi.fn<(code?: number) => void>()
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    runCli(
      ['button'],
      {},
      {
        spawnSyncFn: mockSpawn as any,
        exitFn: mockExit,
      },
    )

    expect(mockConsoleError).toHaveBeenCalledWith('Command failed with exit code 2')
    expect(mockExit).toHaveBeenCalledWith(1)
    mockConsoleError.mockRestore()
  })

  it('respects custom SULAF_REGISTRY_URL environment variable', () => {
    const mockSpawn = vi
      .fn<(...args: any[]) => { status: number | null; error: Error | null }>()
      .mockReturnValue({ status: 0, error: null })
    const mockExit = vi.fn<(code?: number) => void>()

    runCli(
      ['card'],
      { SULAF_REGISTRY_URL: 'http://localhost:3000/r' },
      {
        spawnSyncFn: mockSpawn as any,
        exitFn: mockExit,
      },
    )

    expect(mockSpawn).toHaveBeenCalledWith(
      'npx',
      ['-y', 'shadcn-vue@latest', 'add', 'http://localhost:3000/r/card.json'],
      {
        stdio: 'inherit',
        shell: false,
      },
    )
  })
})
