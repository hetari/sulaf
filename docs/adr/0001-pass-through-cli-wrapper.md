# 1. Pass-Through Wrapper Architecture for Sulaf CLI

Status: Accepted

We decided to implement the `@sulaf/cli` as a zero-dependency pass-through wrapper delegating directly to `shadcn-vue@latest add <registry-url>` rather than building a custom installation/AST transformation engine. This avoids duplicating component installation logic and guarantees 100% ecosystem compatibility with `shadcn-vue` registries while keeping CLI maintenance effort minimal.
