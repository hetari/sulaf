# Documentation information architecture template

Use this when planning a docs site or docs section.

## Audience segments

- New evaluator
- First-time implementer
- Daily user
- Advanced integrator
- Maintainer / contributor
- Operator / deployer

## Entry points

- README or docs home
- Quickstart
- Tutorials
- How-to guides
- Concepts / architecture
- Reference
- Troubleshooting
- Migration / release notes
- Contributing

## Recommended top-level structure

- Start here
  - What this product is
  - Quickstart
  - Installation / setup
- Learn
  - Tutorials
  - Core concepts
- Solve tasks
  - How-to guides
- Reference
  - API / CLI / config / components
- Troubleshooting
- Migrate
- Contribute

## Page inventory

| Page            | Page type       | Audience            | Goal                            | Priority |
| --------------- | --------------- | ------------------- | ------------------------------- | -------- |
| Docs home       | Landing         | All                 | Route readers to the right path | P0       |
| Quickstart      | Quickstart      | New users           | First successful run            | P0       |
| Core concepts   | Explanation     | New + intermediate  | Mental model                    | P1       |
| Common task 1   | How-to          | Existing users      | Complete a real task            | P1       |
| Reference       | Reference       | Existing + advanced | Precise lookup                  | P1       |
| Troubleshooting | Troubleshooting | Blocked users       | Diagnose issues                 | P1       |
| Migration guide | Migration       | Existing users      | Upgrade safely                  | P2       |

## Routing rules

- New readers should never need the reference first.
- Experts should be able to jump directly to reference.
- Tutorials teach.
- How-to guides solve.
- Reference specifies.
- Explanations orient.
- Troubleshooting unblocks.

## Authoring order

1. Docs home
2. Quickstart
3. Reference stubs
4. Troubleshooting
5. Concept pages
6. High-value how-to guides
7. Deep tutorials
8. Migration / contributor docs
