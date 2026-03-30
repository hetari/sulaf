# House style

## Voice

- Use **second person** for the reader.
- Use **active voice** unless passive genuinely improves clarity.
- Use **present tense** for general behavior.
- Sound calm, competent, and direct.
- Be friendly without being chatty.

## Sentence style

- Prefer short, concrete sentences.
- One idea per sentence when possible.
- One main idea per paragraph.
- Avoid filler words such as "simply," "just," "obviously," and "easy."
- Replace vague nouns like "this," "it," and "thing" when they hide the actor or object.

## Headings

- Use **sentence case**.
- Make headings descriptive and task-based.
- Avoid cute headings.
- A reader should understand the page structure by scanning only the headings.

Good:

- `Set up local development`
- `Configure environment variables`
- `Handle webhook retries`

Bad:

- `Before you begin your journey`
- `A few notes`
- `More details`

## Links

- Use descriptive link text.
- Do not use bare "click here" or "read more."
- Link to the specific destination the reader needs next.

## Lists and callouts

- Use numbered steps for ordered actions.
- Use bullets for unordered facts.
- Use warnings only for real hazards.
- Use notes sparingly.

## Length guidance by page type

These are house targets, not hard laws.

### README / docs landing

- Target: 300–900 words.
- Goal: orient and route.
- Deep explanations belong elsewhere.

### Quickstart

- Target: 5–15 steps, usually 500–1,500 words.
- Must include a visible success state.

### Tutorial

- Target: 800–2,500 words.
- Longer is acceptable only if checkpoints keep the reader oriented.

### How-to guide

- Target: as short as the task allows.
- Often 400–1,200 words.

### Reference

- Length is dictated by completeness.
- Optimize for lookup, not for narrative flow.

### Explanation

- Long enough to form a mental model.
- Usually shorter than a tutorial, denser than a quickstart.

### Troubleshooting

- Keep each problem entry short.
- Let readers scan by symptom.

## Page patterns

Use the matching template in `assets/`.

### README or docs landing page pattern

Required elements:

1. Product name and one-sentence value proposition
2. What it does
3. Who it is for
4. Fastest starting point
5. Links to key paths:
   - quickstart
   - concepts
   - how-to guides
   - reference
   - troubleshooting
   - contribution or support
6. Minimal install or local run snippet if appropriate

Avoid:

- long architecture essays
- huge changelogs
- every configuration option
- duplicate content from deeper pages

### Quickstart pattern

Required elements:

1. Outcome
2. Time to complete (optional but recommended)
3. Prerequisites
4. One happy path
5. Expected result
6. Next steps

Rules:

- one package manager if possible
- one deployment target if possible
- explain why a step matters when the reason is not obvious
- prefer a project the reader can run locally

### Tutorial pattern

Required elements:

1. What you will build
2. What you will learn
3. Prerequisites
4. Step-by-step build path
5. Checkpoints after important milestones
6. Recap
7. Next steps

Rules:

- teach progressively
- do not mix every alternative approach into the main flow
- explain cause and effect around each major step

### How-to guide pattern

Required elements:

1. Goal
2. Before you begin
3. Steps
4. Verify the result
5. Variations or related tasks

Rules:

- assume baseline familiarity
- no long conceptual intro
- no encyclopedic reference dump

### Reference pattern

Required elements, as relevant:

- summary
- syntax
- parameters / props / options
- defaults
- return values / events / side effects
- examples
- errors
- compatibility / requirements
- related pages

Rules:

- be complete
- be precise
- be easy to skim
- do not bury behavior in prose if a table or list is clearer

### Explanation pattern

Required elements:

1. The problem space
2. The mental model
3. Important terms
4. How the parts relate
5. Trade-offs and design choices
6. Decision guidance
7. Links to how-to and reference pages

Rules:

- explain _why_
- avoid turning explanation into step-by-step instructions

### Troubleshooting pattern

Required elements:

1. Symptom
2. Likely cause
3. How to verify the cause
4. Fix
5. How to confirm the fix
6. Prevention tips when helpful

Rules:

- index by the words users actually search for
- prefer concrete error messages in headings or subheadings
- keep each entry self-contained

### Migration guide pattern

Required elements:

1. Who should read this
2. What changed
3. Breaking changes
4. Upgrade order
5. Before / after examples
6. Verification
7. Rollback or escape hatch if available

Rules:

- highlight irreversible changes
- be brutally explicit about renamed APIs, removed defaults, and changed behavior
