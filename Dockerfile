# Use the official Bun image
FROM oven/bun:1.3.10-slim AS base
WORKDIR /usr/src/app

# Install build dependencies for native modules (like better-sqlite3)
# These are required because better-sqlite3 needs to be compiled from source
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
COPY apps/www/package.json /temp/dev/apps/www/
COPY packages /temp/dev/packages/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy node_modules from install stage
# Then copy all source files and build
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Build the app
RUN bun docs:build

# Final stage: copy the build output and run the app
FROM base AS release
COPY --from=prerelease /usr/src/app/apps/www/.output .output
COPY --from=prerelease /usr/src/app/apps/www/package.json .

# Expose the port Nuxt runs on
EXPOSE 3000

# Run the app
ENTRYPOINT [ "bun", "run", ".output/server/index.mjs" ]
