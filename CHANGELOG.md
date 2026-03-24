# Changelog

All notable changes to this project will be documented in this file.

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
