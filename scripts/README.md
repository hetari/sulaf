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

#### Automated with GitHub Actions (Recommended)

When you tag a new version and push the tag to GitHub:

```bash
git tag v0.0.5
git push origin v0.0.5 # or git push --tags
```

The GitHub Actions workflow ([`.github/workflows/release.yml`](../.github/workflows/release.yml)) will automatically:

1. Generate the changelog section for the tag using `git-cliff` and `cliff.toml`.
2. Create and publish the GitHub Release with the generated release notes.
3. Automatically mark pre-releases if the tag contains `-alpha`, `-beta`, or `-rc`.

#### Manual Workflow

Alternatively, you can generate notes and create the release manually:

1.  Generate the changelog and release notes:
    ```bash
    bun scripts/release.ts
    ```
2.  Push your tags and create the GitHub release:
    ```bash
    git push --tags
    gh release create <tag> --notes-file RELEASE_NOTES.md
    ```
3.  Clean up:
    ```bash
    rm RELEASE_NOTES.md
    ```

---

> [!NOTE]
> `git-cliff` uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to group changes into sections like "Features", "Bug Fixes", etc. Make sure your commit messages follow this format for the best results.
