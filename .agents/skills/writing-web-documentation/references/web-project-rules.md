# Web-project rules

## Web-project specifics

When documenting web software, check these items explicitly.

### Environment and versions

Always state or verify:

- runtime version (for example Node or Bun)
- framework version
- package manager used in examples
- supported browsers when relevant
- OS assumptions when commands differ
- whether examples target local development, staging, or production

### Local development

For setup docs, include:

- install command
- environment variable setup
- seed or sample data steps if required
- dev server command
- local URL
- how to verify the app actually works

### Frontend-specific topics

Cover these when relevant:

- routing model
- client/server boundaries
- rendering mode (SSR, SSG, CSR, streaming, edge)
- styling approach
- state management expectations
- accessibility requirements
- browser support and polyfills
- asset handling

### Backend / API topics

Cover these when relevant:

- authentication and authorization
- rate limits
- pagination
- idempotency / retries
- webhook signing / replay handling
- error format
- local testing or sandbox mode
- CORS or origin constraints
- caching behavior

### Deployment topics

When a page includes deployment:

- separate build-time and runtime configuration
- distinguish secrets from public environment variables
- state platform-specific caveats
- mention rollback, logs, and smoke tests when important

## Code example rules

1. **Solve a real task**
   Examples should match something the audience actually wants to do.

2. **Start simple**
   Show the smallest useful example first. Expand later.

3. **Be runnable**
   Provide the imports, surrounding setup, and file paths the reader needs.

4. **Be easy to scan**
   Prefer short blocks. Split large examples by step or file.

5. **Label placeholders clearly**
   Use obvious placeholders like `YOUR_API_KEY` or `your-project-id`.

6. **Do not fake verification**
   If a result is illustrative rather than guaranteed, say so.

7. **Show expected output when useful**
   Especially for CLI steps, API responses, generated files, and visible UI changes.

8. **Avoid comment spam**
   Comment the surprising lines, not every line.

9. **Never hide critical omissions**
   If code is abbreviated, say exactly what is omitted.

10. **Prefer the project's dominant stack**
    Do not multiply language or framework tabs unless the product truly supports them equally well.

## What developers tend to like in excellent docs

Use these as quality signals:

- the page tells them where to start
- examples work
- prerequisites are not buried
- the document type is obvious
- learning material and lookup material are separated
- the writer respects their time
- the page shows version or freshness context
- the docs admit limitations and failure modes
- the next step is obvious

## Common anti-patterns

Never ship these on purpose:

- a README that tries to be the entire documentation site
- a quickstart with many branches before the reader gets a first success
- a tutorial that reads like reference
- a reference page missing defaults, errors, or compatibility notes
- commands with hidden prerequisites
- screenshots used instead of copyable text for commands or config
- headings like `Overview`, `Notes`, `Details`, or `More`
- code blocks with no filename, no language, and no surrounding context
- unexplained acronyms or internal terminology
- stale version assumptions
- "works like magic" wording
- burying breaking changes below the fold
- writing as if the tool is the actor when the reader is the actor

## Accessibility and inclusivity rules

- Prefer descriptive link text.
- Provide alt text or a text equivalent for meaningful images.
- Do not rely on screenshots when text or code would be better.
- Keep sentences translation-friendly and jargon-light.
- Explain abbreviations on first use if they are not universal.
- Use examples that do not depend on hidden cultural context.

## Docs-as-code maintenance rules

Prefer documentation that can be maintained like code:

- keep docs near the code when practical
- update docs in the same change as the product behavior
- use review checklists
- keep examples tested or at least plausibly executable
- make "last updated" context visible when the platform supports it
- avoid orphan pages by linking related content
