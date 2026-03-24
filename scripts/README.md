# Scripts

This directory contains utility scripts for managing the Sulaf project.

## `release.ts`

The `release.ts` script automates the generation of changelogs and release notes using `git-cliff`.

### Prerequisites

- [Bun](https://bun.sh/)
- [git-cliff](https://git-cliff.org/) (installed via `bunx`)
- [GitHub CLI](https://cli.github.com/) (optional, for creating releases)

### Usage

To generate the changelog and release notes, run the following command from the project root:

```bash
bun scripts/release.ts
```

### What it does

1.  **Generates `CHANGELOG.md`**: Updates the full project history by reconstructing it from git tags and commit messages using the configuration in `cliff.toml`.
2.  **Generates `RELEASE_NOTES.md`**: Extracts the changes for the latest version (or unreleased changes if no tags are present) and strips the header for use with the GitHub CLI.

### Workflow Example

After pushing your changes and tagging a new version:

1.  Generate the changelog and release notes:
    ```bash
    bun scripts/release.ts
    ```
2.  Commit the updated `CHANGELOG.md`:
    ```bash
    git add CHANGELOG.md
    git commit -m "chore: update changelog"
    git push
    ```
3.  Create a GitHub release using the generated notes:
    ```bash
    gh release create <tag> --notes-file RELEASE_NOTES.md
    ```

---

> [!NOTE]
> `git-cliff` uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to group changes into sections like "Features", "Bug Fixes", etc. Make sure your commit messages follow this format for the best results.
