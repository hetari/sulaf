# CLI Bounded Context (`packages/cli`)

Glossary and canonical definitions for the Sulaf Command Line Interface package (`@sulaf/cli` / `sulaf`).

## Domain Terms

### Pass-Through CLI Wrapper

An architecture where the `sulaf` CLI acts as a light, zero-dependency proxy layer that resolves package manager execution commands (`npx`, `bunx`, `pnpm dlx`, `yarn dlx`) and delegates component fetching and AST installation directly to `shadcn-vue@latest add <registry-url>`.

### Default Bundle Resolution

When invoked with no arguments (`bunx sulaf`), the CLI automatically resolves target component to `all` (`all.json`), delivering a complete one-shot installation of the Sulaf collection.

### Dynamic Registry Endpoint

The target registry URL prefix (`https://sulaf-socd8d.cranl.net/r/`) used by the CLI, configurable via the `SULAF_REGISTRY_URL` environment variable for local testing or custom deployments.
