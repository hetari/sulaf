import { execSync } from 'node:child_process'

function run() {
  try {
    // Run npm token list and capture JSON output
    const output = execSync('npm token list --json', { encoding: 'utf-8' })
    const tokens = JSON.parse(output)

    if (!Array.isArray(tokens) || tokens.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ No NPM tokens found on this account.')
      process.exit(0)
    }

    let hasValidToken = false
    const now = new Date()

    // eslint-disable-next-line no-console
    console.log(`Found ${tokens.length} token(s). Checking expiration dates:\n`)

    for (const t of tokens) {
      if (!t.created) continue

      const createdDate = new Date(t.created)

      // Some versions of npm return 'expiry', otherwise we calculate 90 days from creation
      const expiryDate = t.expiry
        ? new Date(t.expiry)
        : new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000)

      const daysRemaining = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )

      const tokenEnding = t.token ? t.token.slice(-4) : '...'

      // eslint-disable-next-line no-console
      console.log(
        `- Token [..${tokenEnding}] | Created: ${createdDate.toISOString().split('T')[0]} | Expires in: ${daysRemaining} days`,
      )

      if (daysRemaining <= 0) {
        // eslint-disable-next-line no-console
        console.error(`::error::🚨 NPM Token [..${tokenEnding}] has EXPIRED!`)
      } else if (daysRemaining <= 7) {
        // eslint-disable-next-line no-console
        console.warn(
          `::warning::⚠️ NPM Token [..${tokenEnding}] will expire in ${daysRemaining} days! Please prepare to rotate it soon.`,
        )
        hasValidToken = true
      } else {
        hasValidToken = true
      }
    }

    // eslint-disable-next-line no-console
    console.log('')

    if (!hasValidToken) {
      // eslint-disable-next-line no-console
      console.error(
        '::error::🚨 All tokens have expired! Please create a new one to ensure GitHub Actions can publish.',
      )
      process.exit(1)
    } else {
      // eslint-disable-next-line no-console
      console.log('✅ Found valid NPM token(s) ready for use.')
      process.exit(0)
    }
  } catch (err: any) {
    if (err.message.includes('code E401')) {
      // eslint-disable-next-line no-console
      console.error(
        '::error::🚨 Authentication failed! Please ensure NPM_TOKEN is valid or you are logged in locally.',
      )
    } else {
      // eslint-disable-next-line no-console
      console.error(`::error::🚨 Error running npm token list: ${err.message}`)
    }
    process.exit(1)
  }
}

run()
