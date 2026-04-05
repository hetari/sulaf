import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Generates two changelog files using git-cliff and cliff.toml:
 * 1. CHANGELOG.md - Full project history.
 * 2. RELEASE_NOTES.md - Changes for the current release.
 */
function run() {
  try {
    // eslint-disable-next-line no-console
    console.log('📝 Generating Full Changelog (CHANGELOG.md)...')
    execSync('bunx git-cliff -o CHANGELOG.md', { stdio: 'inherit' })

    // eslint-disable-next-line no-console
    console.log('\n📝 Generating Release Notes (RELEASE_NOTES.md)...')
    execSync('bunx git-cliff --latest --strip header -o RELEASE_NOTES.md', {
      stdio: 'inherit',
    })

    // eslint-disable-next-line no-console
    console.log('\n✅ Changelog generation completed successfully!')
    // eslint-disable-next-line no-console
    const currentTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""')
      .toString()
      .trim()

    const pkgPath = join(process.cwd(), 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    const nextTag = `v${pkg.version}`

    // eslint-disable-next-line no-console
    console.log(`\n🏷️  Current tag: ${currentTag || 'none'}`)
    // eslint-disable-next-line no-console
    console.log('✨ You can now use the GH CLI to create your release:')
    // eslint-disable-next-line no-console
    console.log(`   gh release create ${nextTag} --notes-file RELEASE_NOTES.md`)
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(`\n❌ Failed to generate changelogs: ${err.message}`)
    process.exit(1)
  }
}

run()
