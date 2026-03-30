# Research notes: what makes great web-development docs work

This file summarizes the patterns behind documentation that developers consistently find useful.

## What I studied

### 1. Diátaxis / Divio

Core lesson:

- Great docs separate four jobs: tutorials, how-to guides, reference, and explanation.
- Each kind of page needs a different writing mode and should stay distinct.

Why it matters:

- Readers arrive with different intents.
- A page that tries to teach, solve, specify, and philosophize at the same time usually does all four poorly.

Sources:

- https://diataxis.fr/
- https://docs.divio.com/documentation-system/introduction/

### 2. GitHub Docs and style guidance

Core lesson:

- Start from user needs.
- Choose the correct content type.
- Write for readability and scannability.

Why it matters:

- Busy readers scan first.
- Strong docs make the page legible through headings, code blocks, lists, and clear first sentences.

Sources:

- https://docs.github.com/en/contributing/writing-for-github-docs/best-practices-for-github-docs
- https://docs.github.com/en/contributing/style-guide-and-content-model/style-guide

### 3. Google and Microsoft style guidance

Core lesson:

- Active voice, present tense, second person, clear hierarchy, descriptive links, and accessible images all improve clarity.
- Good code samples need context and should be easy to scan.

Why it matters:

- Technical writing works best when the reader always knows who does what, in what order, and what to expect.

Sources:

- https://developers.google.com/style
- https://developers.google.com/style/voice
- https://developers.google.com/style/tense
- https://developers.google.com/style/code-samples
- https://learn.microsoft.com/en-us/style-guide/grammar/person
- https://learn.microsoft.com/en-us/style-guide/developer-content/reference-documentation

### 4. MDN Web Docs

Patterns worth copying:

- Clear beginner entry points
- Structured learning path
- Practice and “test your skills” checkpoints
- Runnable examples through MDN Playground
- Code examples available in GitHub
- Visible page freshness and contribution links

Why developers like it:

- It gives beginners a safe path from zero to competence.
- It lets readers learn by editing real code.
- It makes the content feel alive and maintainable.

Sources:

- https://developer.mozilla.org/en-US/docs/Learn_web_development
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website

### 5. React docs

Patterns worth copying:

- A clear split between “Learn” and “Reference”
- The quick start explicitly states what the page teaches
- The reference is clearly marked as lookup material

Why developers like it:

- New users can learn without drowning in API detail.
- Experienced users can jump straight to the reference.

Sources:

- https://react.dev/learn
- https://react.dev/reference/react

### 6. Next.js docs

Patterns worth copying:

- Up-front system requirements
- Supported browser information
- Quick-start commands very near the top
- “Last updated” context on the page
- Edit-on-GitHub affordances

Why developers like it:

- Operational facts are not buried.
- The reader knows exactly what environment the docs assume.
- The content signals freshness and maintainability.

Sources:

- https://nextjs.org/docs/app/getting-started
- https://nextjs.org/docs/app/getting-started/installation

### 7. Stripe docs

Patterns worth copying:

- Quickstarts collected in one place
- Interactive, end-to-end code samples
- Multiple language and framework options where genuinely useful
- Test mode separated from live mode

Why developers like it:

- The docs are close to real integration work.
- It is easy to go from reading to trying.
- The product’s risky or irreversible contexts are made explicit.

Sources:

- https://docs.stripe.com/api
- https://docs.stripe.com/quickstarts
- https://docs.stripe.com/get-started

### 8. TypeScript docs

Patterns worth copying:

- Several “get started” paths based on reader background
- A handbook that can be read from top to bottom
- Clear distinction between introductory paths and deeper handbook material

Why developers like it:

- Readers do not all start from the same place.
- Background-based entry points reduce intimidation.

Sources:

- https://www.typescriptlang.org/docs/handbook/
- https://www.typescriptlang.org/docs/handbook/intro.html

### 9. Supabase docs

Patterns worth copying:

- Multiple framework-specific entry points
- Strong separation between getting started material and reference material

Why developers like it:

- Readers can begin from the stack they actually use.
- The docs match the way web developers think in frameworks and runtimes.

Sources:

- https://supabase.com/docs
- https://supabase.com/docs/reference/javascript/introduction

## Repeating patterns across the best docs

### 1. They route readers immediately

Great docs do not ask the reader to figure out the information architecture on their own.
They provide clear paths such as:

- start here
- quickstart
- learn
- reference
- troubleshoot
- migrate

### 2. They separate learning from lookup

This may be the single most important pattern.

- Tutorials and quickstarts are for doing and learning.
- Reference is for exact answers.
- Explanation builds mental models.
  Mixing them creates slow, confusing pages.

### 3. They front-load the happy path

The best docs show the smallest useful success first.
They do not start with every option, every caveat, or every supported stack.

### 4. They show environment assumptions

Runtimes, versions, browsers, package managers, and prerequisites are stated early.
This prevents many avoidable failures.

### 5. They make examples usable

Developers like examples that can be copied, run, and modified.
The best docs use examples to solve real tasks, not to show off every feature.

### 6. They make scanning easy

Headings, short paragraphs, lists, code blocks, warnings, and tables let readers find what matters quickly.

### 7. They build trust

Visible version context, last-updated signals, contribution links, and honest limitations make docs more believable.

### 8. They support maintenance

Good docs are tied closely enough to the product that they can be updated with the code.

## What this skill intentionally turns into rules

From the research above, this skill bakes in the following defaults:

- choose the page type before writing
- write for one audience and one primary job
- separate landing, quickstart, tutorial, how-to, reference, explanation, troubleshooting, and migration pages
- lead with the fastest successful path
- state versions, assumptions, and prerequisites
- prefer active voice, present tense, second person, and descriptive headings
- make code examples minimal, realistic, and runnable
- review for scannability, accessibility, and freshness
- treat docs like something that must be maintained, not just published once
