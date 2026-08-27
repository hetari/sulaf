# 2. Decompose Registry Builder into Three Deep Modules

Status: Accepted

We decided to decompose the monolithic `registry-builder.ts` (591 lines, 12+ file-scope helpers) into three focused modules — **Dependency Resolver**, **Source Collector**, and **Registry Emitter** — living in `packages/registry/src/`, with `scripts/registry-builder.ts` reduced to a ~10-line pipeline entry point.

## Considered Options

- **ts-morph for import parsing** (current): Full TypeScript compiler wrapper, creates a new `Project` per file. We chose **regex** instead (`/(?:import|export)\s.*?from\s+['"]([^'"]+)['"]/g`) because we only extract import specifiers — no type resolution, no diagnostics. Regex is ~100x faster and eliminates the ts-morph dependency entirely.

- **Two modules instead of three**: Merging collector + emitter. Rejected because they have different I/O shapes (filesystem in → grouped files vs. grouped data → serialized JSON) and different test strategies (fixture directories vs. in-memory assertions).

- **Emitter writes to disk**: Rejected in favor of pure in-memory return (`{ path: string, content: string }[]`). The entry-point script handles all `fs.writeFile` calls. This makes the emitter trivially testable without filesystem mocking.

- **`all.json` as a re-analysis pass**: Currently re-runs dependency analysis with `skipInternalRegistryDeps: true`. We chose post-processing instead: take already-emitted per-component items, union their files, filter out internal `registryDependencies`. Zero duplicate work.

## Consequences

- Migration is big-bang with JSON output diffing: write all three modules, wire the entry point, run `bun run registry:build`, `git diff` the output directory. If JSON matches, the refactor is correct.
- `console.warn`/`throw` error handling preserved — these are build scripts, not libraries.
- Full `registryConfig` object passed to each module — no per-module option types needed for a 50-line config.
