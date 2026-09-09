import { describe, it, expect, vi } from 'vitest'
import { runRelease } from '../release'

describe('scripts/release.ts', () => {
  it('generates CHANGELOG.md and RELEASE_NOTES.md and prints next tag commands', () => {
    const executedCommands: string[] = []
    const mockExec = vi.fn<(cmd: string) => Buffer>((cmd: string) => {
      executedCommands.push(cmd)
      if (cmd.includes('git describe')) {
        return Buffer.from('v0.0.1\n')
      }
      return Buffer.from('')
    })

    const mockRead = vi.fn<(path: string) => string>((path: string) => {
      if (path.endsWith('package.json')) {
        return JSON.stringify({ version: '0.0.2' })
      }
      return ''
    })

    const mockExit = vi.fn<(code?: number) => void>()
    const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

    runRelease({
      execSyncFn: mockExec as any,
      readFileSyncFn: mockRead as any,
      exitFn: mockExit,
      cwd: '/mock/cwd',
    })

    expect(executedCommands).toEqual([
      'bunx git-cliff -o CHANGELOG.md',
      'bunx git-cliff --latest --strip header -o RELEASE_NOTES.md',
      'git describe --tags --abbrev=0 2>/dev/null || echo ""',
    ])

    expect(mockExit).not.toHaveBeenCalled()
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('v0.0.2'))
    mockConsoleLog.mockRestore()
  })

  it('handles empty current tag when no git tags exist', () => {
    const mockExec = vi.fn<(cmd: string) => Buffer>((cmd: string) => {
      if (cmd.includes('git describe')) {
        return Buffer.from('')
      }
      return Buffer.from('')
    })

    const mockRead = vi.fn<() => string>(() => JSON.stringify({ version: '1.0.0' }))
    const mockExit = vi.fn<(code?: number) => void>()
    const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

    runRelease({
      execSyncFn: mockExec as any,
      readFileSyncFn: mockRead as any,
      exitFn: mockExit,
      cwd: '/mock/cwd',
    })

    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Current tag: none'))
    mockConsoleLog.mockRestore()
  })

  it('catches execution error, logs failure, and calls exit(1)', () => {
    const mockExec = vi.fn<(cmd: string) => Buffer>((cmd: string) => {
      if (cmd.includes('git-cliff')) {
        throw new Error('git-cliff not installed')
      }
      return Buffer.from('')
    })
    const mockRead = vi.fn<() => string>()
    const mockExit = vi.fn<(code?: number) => void>()
    const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    runRelease({
      execSyncFn: mockExec as any,
      readFileSyncFn: mockRead as any,
      exitFn: mockExit,
      cwd: '/mock/cwd',
    })

    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Failed to generate changelogs: git-cliff not installed'),
    )
    expect(mockExit).toHaveBeenCalledWith(1)
    mockConsoleError.mockRestore()
  })
})
