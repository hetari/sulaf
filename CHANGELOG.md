# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1-alpha.3] - 2026-04-17

### Miscellaneous Tasks

- Bump package version to 0.0.4 (5105586)
- add meter component (4aff35a)

### Refactor

- Standardize navigation structure using NAV_SECTIONS (4a88d93)

## [0.0.1-alpha.2] - 2026-04-10

### Bug Fixes

- Add error handling to search fetcher and remove unused database configuration (1455909)
- Support class prop and validate context (ce8680f)
- Show-more container classes and gradient (acf58f5)
- Enable auto review and consolidate path rules (271c0ee)
- Use mobile-web-app-capable meta tag (19bbec9)
- Add reka-ui to excludedDeps and inline list (23458e0)

### Features

- Add manual installation component and integrate code tabs for documentation (7d8b0ad)
- Add comprehensive apple-touch-icon support and update favicon configuration (9e77d3f)
- Add support for 'soon' and 'hide' navigation states with UI badges and filtering (b0c68e3)
- Add ShineBorder component and replace legacy shine badge on index page (466af47)
- Add show-more component to registry (9f421f9)
- Add show-mMore demo page and route in playground (82d0224)
- Add configurable animation to ShowMore component (8ac3c77)
- Add show-more demo (5fd9faf)
- Add ShowMore component to the docs (7e54ff4)

### Miscellaneous Tasks

- Update release script instructions to include tag pushing and cleanup steps (6e4ef95)
- Bump package version to 0.0.2 (a4aa1bd)
- Update project homepage and registry base URL references (0532bdf)
- Bump package version to 0.0.3 (f36778f)
- Add nuxt-content skills (fd90ca5)
- Add documentation stubs for new upcoming components (1c4dfe7)
- Add ShowMore component to the registry (28d8d4c)
- Automate build workflow (ab2b894)

### Refactor

- Compute docs version at build time (eb9ece8)
- Update docs layout styling (b08af3c)
- Update documentation and add soon status indicators to component list (d078aae)
- Update CodeRabbit profile and add validation for ShowMoreItem context properties (17a8dda)

### Testing

- Add unit tests for ShowMore component and update ShowMoreButton to consume root context (b43499d)

## [0.0.1-alpha.1] - 2026-04-05

### Bug Fixes

- Update the docker file (7abd3d1)
- Docker file (0fe8ed4)
- Fix: load optional local registry.json per component group to override
  item metadata, and merge dependencies

Add README and support local metadata (239c7c8)

- Docs navigation and update deps (377c387)
- Update test command to use bun run test (df6b44a)
- Add custom filter support and keyword indexing to Command component (0c72f36)

### Features

- Implement a new release process using git-cliff (f5e286d)
- Add autocomplete components and demo (742eb00)
- Implement Autocomplete test and configure Vitest for testing (d1ccdee)
- Add Autocomplete demo (374956d)

### Miscellaneous Tasks

- Add docker file (18aa7b0)
- Add playground files (f997c95)
- Update dependencies and fix path in tsconfig (3bbd97a)
- Add Tailwind CSS and update style.css with custom themes and variables (27f98a0)
- Add ai skills (bc2c872)
- Delete hello-world component (ecda6ba)
- Add code-rabbit config and standardize deps (b45755a)
- Update dependency versions (ee10270)
- Update registry (1883774)
- Rename CLI package from @sulaf/cli to sulaf (935a22a)
- Rename package to sulaf and remove execution log output (c96d237)

### Refactor

- Registry scripts, add types and utils (b483b67)
- Docs structure and update links (bd7a986)
- Restructure registry package and rewrite builder (2010408)

### Build

- Remove --frozen-lockfile flag from bun install in Dockerfile (31a7d3a)

## [0.0.1] - 2026-03-23

### Bug Fixes

- Registry (2feb985)
- Show the og image correctly (73d72af)
- Update the og image content based on page (7f256e1)
- Some isseus (9327b1b)
- Include all component deps and filter registry deps (f49fae1)
- Test.yml (42f9fbe)
- Release workflow (5dcaf85)
- Add NPM_TOKEN to release workflow environment variables (63cbcc6)

### Features

- Add docs template (2a921b3)
- Add registry and ui packages (f419119)
- Add registry builder, (07b4058)
- Feat: Add "New" badge to sidebar navigation and display "Last updated"
  date on documentation pages (95a8557)
- Rebrand site to Sulaf and add SEO/meta (a954f0d)
- Setup test (88febbd)
- Add cli (fed4565)
- Set up monorepo release process with changesets (#1) (ee83d1a)
- Feat/cli publish (#5)

* feat: add github issue and pr templates

Set up actions/setup-node and configure changesets to publish
to npm using the NPM_TOKEN secret.
Add @sulaf/cli README, a changeset to enable auto-publish, and
scripts/check-npm-token.ts to validate NPM tokens.
Fix minor typos in the introduction docs. (78d653e)

### Initial

- Init (02ae049)

### Miscellaneous Tasks

- Add husky, commitlint, oxlint, and nano-staged (e8273a0)
- Add oxfmt and formatting scripts (3b416f5)
- Update oxlint config and oxfmt (8eb1a4f)
- Chore: add all shadcn-vue component and try a test component with the
  registry (80513f3)
- Add contributing guide and readme (6d8821f)
- Add catalog dependency mapping (0970f4f)
- Add test action (a5f34c9)
- Rename the package from @sulaf/cli to sulaf (dd17751)
