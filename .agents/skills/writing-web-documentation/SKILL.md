---
name: writing-web-documentation
description: Write, rewrite, review, and organize developer-facing documentation for web software projects. Use when creating or improving README files, docs homepages, quickstarts, tutorials, how-to guides, API/reference pages, conceptual explanations, migration guides, or troubleshooting content for frontend, backend, full-stack, SDK, API, or framework-based web products. This skill applies strong information architecture, task-first page structure, clear voice, runnable examples, version and prerequisite hygiene, accessibility rules, and docs-as-code maintenance habits. Do not use it for marketing copy, legal text, or non-technical customer-support articles.
license: MIT
---

# Writing web documentation

Use this skill when the user wants excellent technical documentation for a web project, not merely "some text around the code." The job is to produce documentation that is easy to enter, easy to scan, easy to trust, and easy to maintain.

Good documentation is not a dump of product facts. It is a guided path through the product for a reader with a specific goal.

## What this skill optimizes for

1. **Fast first success**
   A new reader should reach a working result quickly.

2. **Clear routing by intent**
   A beginner learning the product and an expert checking an option should not have to fight the same page.

3. **Low ambiguity**
   Commands, file names, versions, prerequisites, expected outcomes, and failure states should be explicit.

4. **Scannability**
   Busy developers skim before they read. Headings, intros, lists, tables, and code blocks should make the page navigable at a glance.

5. **Maintenance**
   Docs should age gracefully, be easy to update with code changes, and make stale information obvious.

## Non-goals

Do **not** optimize for:

- hype
- marketing language
- exhaustive background on every page
- showing every supported variation in the first document
- clever prose
- giant code dumps with little explanation

## First decide: what kind of page is this?

Never draft before choosing the page type. Keep page types distinct.

### README or docs landing page

Use for orientation and routing.

- Answer: What is this? Who is it for? Where do I start?
- Keep it short.
- Push deep detail into child pages.

### Quickstart

Use for the fastest happy path to a working result.

- One path.
- One main environment.
- Minimal branching.
- Clear prerequisites and a visible success state.

### Tutorial

Use to teach by doing.

- The reader builds something meaningful.
- Include checkpoints and a recap.
- Explain enough for learning, not enough for encyclopedia coverage.

### How-to guide

Use to solve one concrete problem.

- Assumes the reader already knows the basics.
- Focus on outcome, not background theory.

### Reference

Use to answer precise factual questions.

- Syntax, options, defaults, parameters, return values, events, errors, limits, compatibility.
- Dry, complete, easy to scan.

### Explanation / concept page

Use to build mental models.

- Why the system works this way.
- Architecture, trade-offs, invariants, decision rules.
- Link outward to task docs and reference docs.

### Troubleshooting page

Use to diagnose problems by symptom.

- Symptom -> likely cause -> fix -> verify -> prevention.

### Migration guide

Use when versions, APIs, or architecture change.

- Make breakage explicit.
- Show before/after.
- Give a safe order of operations.
- Include rollback guidance when relevant.

## The default workflow

Follow this workflow unless the user asks for something narrower.

### 1) Identify the reader and job

Infer or state:

- reader type: beginner, experienced user, maintainer, integrator, API consumer, platform engineer
- task: learn, set up, integrate, customize, debug, migrate, deploy, contribute
- environment: framework, runtime, package manager, OS, browser, hosting target
- success state: what the reader should be able to do after finishing

If any important fact is missing, do **not** block forever. Make the narrowest reasonable assumption and label it clearly.

### 2) Inventory facts before prose

Collect the facts that often go stale:

- package names
- install commands
- runtime and framework versions
- supported browsers or environments
- environment variables
- URLs, endpoints, ports, callback paths
- permissions, auth requirements, keys, tokens
- build, test, and deploy commands
- breaking changes or constraints

If you cannot verify a fact, avoid inventing it. Use a clearly marked placeholder or assumption.

### 3) Build the page skeleton first

Before writing full paragraphs, create a skeleton with the exact sections the page needs.

Preferred order:

- context
- prerequisites
- steps or body
- verification / expected result
- next steps / related pages

### 4) Write for the first successful run

Every task page should help the reader get one successful outcome as early as possible.

That means:

- front-load the shortest working path
- minimize branching
- postpone advanced options
- prefer one package manager and one framework unless the project truly supports several first-class entry points
- show what success looks like

### 5) Make examples runnable

Examples should be copy-pasteable or easy to adapt.

- Use real filenames and realistic directories.
- Label code fences.
- Keep examples minimal but complete.
- Add comments only where they remove ambiguity.
- If a command is destructive or billable, warn first.
- Show expected output or visible result after important steps.

### 6) Tighten the prose

After the draft exists:

- shorten intros
- split long paragraphs
- convert vague headings into task-based headings
- remove duplicated explanation
- move theory out of procedural pages
- move detail out of landing pages

### 7) Run the review checklist

Use `assets/review-checklist.md` before delivering.

## Reference files

Load these on demand based on current task:

| Reference                                                              | Purpose                                                                                |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **[references/house-style.md](references/house-style.md)**             | Voice, sentence style, headings, length targets, page-type patterns                    |
| **[references/web-project-rules.md](references/web-project-rules.md)** | Web-project checklists, code example rules, anti-patterns, accessibility, docs-as-code |
| **[references/research-notes.md](references/research-notes.md)**       | Research synthesis from strong documentation sites and style guides                    |

**DO NOT load all files at once.** Load only what's relevant to your current task.

## How to respond in common task modes

### When asked to write a page from scratch

Deliver:

1. the appropriate page type
2. a polished Markdown draft
3. clearly marked assumptions if any important facts are unknown

### When asked to improve existing docs

Do this in order:

1. identify the current page type
2. remove mixed modes
3. tighten structure
4. rewrite for clarity
5. preserve technical meaning
6. call out factual gaps or staleness risks

### When asked to review docs

Return:

- the page type
- the top issues in priority order
- exact rewrite suggestions
- missing sections
- any staleness or trust issues

### When asked to design a docs site

Return:

- audience segments
- entry points
- page types needed
- sitemap
- priority order for authoring
- gaps and risks

## Files in this skill

- `assets/documentation-brief-template.md` — collect facts before writing
- `assets/docs-ia-template.md` — structure a docs site or section
- `assets/docs-home-template.md` — landing page skeleton
- `assets/readme-template.md` — README skeleton
- `assets/quickstart-template.md` — happy-path setup guide
- `assets/tutorial-template.md` — learning-by-doing guide
- `assets/how-to-template.md` — task-focused guide
- `assets/reference-template.md` — API/reference skeleton
- `assets/explanation-template.md` — mental-model page
- `assets/troubleshooting-template.md` — symptom-first troubleshooting
- `assets/migration-guide-template.md` — upgrade/migration page
- `assets/review-checklist.md` — final quality gate
- `references/house-style.md` — voice, length targets, page-type patterns
- `references/web-project-rules.md` — web-project checklists, code rules, anti-patterns
- `references/research-notes.md` — why these rules exist

## Final instruction

The best documentation pages feel easy because the writer made a hundred careful choices for the reader:

- what belongs on this page
- what does not
- what comes first
- what to cut
- what to verify
- what to explain
- what to defer

Make those choices deliberately.
