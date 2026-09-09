import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface RunReleaseOptions {
  execSyncFn?: typeof execSync
  readFileSyncFn?: typeof readFileSync
  exitFn?: (code: number) => void
  cwd?: string
}

/**
 * Generates two changelog files using git-cliff and cliff.toml:
 * 1. CHANGELOG.md - Full project history.
 * 2. RELEASE_NOTES.md - Changes for the current release.
 */
export function runRelease(options: RunReleaseOptions = {}) {
  const {
    execSyncFn = execSync,
    readFileSyncFn = readFileSync,
    exitFn = code => process.exit(code),
    cwd = process.cwd(),
  } = options

  try {
    // eslint-disable-next-line no-console
    console.log('📝 Generating Full Changelog (CHANGELOG.md)...')
    execSyncFn('bunx git-cliff -o CHANGELOG.md', { stdio: 'inherit' })

    // eslint-disable-next-line no-console
    console.log('\n📝 Generating Release Notes (RELEASE_NOTES.md)...')
    execSyncFn('bunx git-cliff --latest --strip header -o RELEASE_NOTES.md', {
      stdio: 'inherit',
    })

    // eslint-disable-next-line no-console
    console.log('\n✅ Changelog generation completed successfully!')
    // eslint-disable-next-line no-console
    const currentTag = execSyncFn('git describe --tags --abbrev=0 2>/dev/null || echo ""')
      .toString()
      .trim()

    const pkgPath = join(cwd, 'package.json')
    const pkg = JSON.parse(readFileSyncFn(pkgPath, 'utf-8'))
    const nextTag = `v${pkg.version}`

    // eslint-disable-next-line no-console
    console.log(`\n🏷️  Current tag: ${currentTag || 'none'}`)
    // eslint-disable-next-line no-console
    console.log('✨ You can now use the GH CLI to create your release:')
    // eslint-disable-next-line no-console
    console.log(`   git push --tags`)
    // eslint-disable-next-line no-console
    console.log(`   gh release create ${nextTag} --notes-file RELEASE_NOTES.md`)
    // eslint-disable-next-line no-console
    console.log(`   rm RELEASE_NOTES.md`)
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(`\n❌ Failed to generate changelogs: ${err.message}`)
    exitFn(1)
  }
}

if (
  import.meta.main ||
  (typeof process !== 'undefined' && process.argv[1]?.endsWith('release.ts'))
) {
  runRelease()
}
