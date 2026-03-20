# Contributing to Sulaf

First off, thank you for considering contributing to Sulaf! It's people like you who make the Vue community such a great place.

## Local Development

Sulaf is a monorepo managed with **bun**.

### Prerequisites

- [Bun](https://bun.sh) (v1.3.10 or higher)
- [Node.js](https://nodejs.org) (v24 or higher)

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/hetari/sulaf.git
   cd sulaf
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Start the documentation site**:
   ```bash
   bun docs:dev
   ```

### Project Structure

- `apps/www`: The documentation site built with Nuxt.
- `packages/registry`: The component registry system, here we add the extended shadcn-vue components.
- `packages/ui`: all shadcn-vue components, so in `packages/registry` if you need to use any shadcn-vue component, you should import it from `packages/ui`.

## Adding a New Component

To add a new component to Sulaf:

1. Create the component in `packages/registry`.
2. Ensure it follows the shadcn-vue patterns and uses Tailwind CSS.
3. Add a documentation page in `apps/www/content/docs/components`.
4. Add a test file in `packages/registry/__tests__`.
5. Register the component in the registry package (there is a script to do that, see `packages.json`).

## Coding Standards

We use [oxlint](https://oxlint.dev/) and [oxfmt](https://github.com/oxc-project/oxc) for high-performance linting and formatting.

- **Check**: `bun check`
- **Fix**: `bun fix`

Please ensure your code passes these checks before submitting a pull request.

## Pull Request Process

1. Create a new branch from `main`.
2. Make your changes and ensure tests pass.
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/).
4. Push to your fork and submit a pull request.

## Questions?

Feel free to open an issue or reach out to [Ebraheem Alhetari](https://github.com/hetari).

Happy coding! 🚀
