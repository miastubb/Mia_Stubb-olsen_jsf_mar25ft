# AI Use Log — Next Store

**Project:** Next Store — Noroff JS Frameworks assignment  
**Repository:** [miastubb/Mia_Stubb-olsen_jsf_mar25ft](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft)  
**Development period covered:** 18 October–17 November 2026  
**AI tools:** OpenAI ChatGPT (referred to as “Ada” in development discussions) and OpenAI Codex (repository QA)  

## Purpose and working method

This document describes how I used generative AI while developing and quality-assuring Next Store. It records representative uses and significant decisions rather than every individual prompt. The entries are reconstructed from development discussions, test results, and the repository's pull-request history; example questions are paraphrased, not verbatim transcripts.

I used ChatGPT as a tutor, research assistant, debugging partner, and code reviewer. It helped explain unfamiliar concepts, compare implementation options, suggest code and tests, and review errors. I also used Codex to inspect the repository and identify possible quality issues. AI-generated suggestions were not treated as authoritative: I reviewed their relevance, checked code and framework behavior, made implementation decisions, and verified changes with tests and browser checks. Some AI suggestions were incorrect and had to be revised or rejected.

## Selected development log

| Period | Area | AI assistance | My evaluation and actions |
| --- | --- | --- | --- |
| **18–23 Oct** | Project setup and architecture | Discussed Next.js App Router, TypeScript, component structure, API fetching, shared layouts, and debugging build errors. AI helped explain framework behavior and propose solutions. | Implemented the project in branches, checked build/lint/type errors, and tested the UI. For example, I investigated Next.js rendering and remote-image configuration problems instead of assuming suggested changes were correct. |
| **25–29 Oct** | Product catalogue, pagination, search, cart, and checkout | Used AI for implementation planning, reusable state and storage patterns, accessibility questions, navigation behavior, and code review. | Implemented and tested the features, including server-side pagination, cart persistence, keyboard-accessible search, and simulated checkout. Evaluated UI behavior across screen sizes and keyboard interactions. |
| **30 Oct–2 Nov** | Cart pricing precision | Researched JavaScript floating-point arithmetic following QA feedback from Ole, including why `0.1 + 0.2` is not exactly `0.3`. AI explained options for safer currency arithmetic and helped review test cases. | Chose to calculate money in integer **øre** and centralize the logic in `utils/cartCalculations.ts`. Added eight targeted Vitest tests. When TypeScript reported 432 errors, investigated the actual file paths and found an accidentally duplicated file containing invalid content; avoided rewriting otherwise valid calculations. See [PR #19](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/19). |
| **3–8 Nov** | Component tests, UX, and accessibility | Used AI to discuss Vitest/React Testing Library, cart storage, form validation, toast notifications, mini-cart behavior, error handling, focus management, and responsive design. | Added regression tests and implemented contact-form validation, mini-cart controls, and accessibility improvements. Manually checked focus order, Escape behavior, links, form errors, and responsive layouts. AI advice supported decisions but did not replace browser testing. |
| **9–10 Nov** | Documentation and first final-QA tickets | Used ChatGPT to help structure the README, review dependency-audit findings, design checkout tests, and investigate product API failure scenarios and cart hydration. | Reviewed and edited documentation; checked dependency fixes before acceptance. Added checkout regression coverage and a client-side navigation guard. A suggested `"use client"` approach conflicted with page metadata; I changed to a Server Component plus a separate Client Component. Added API timeout/error handling and hydration tests. See [PR #28](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/28) and [PR #29](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/29). |
| **12 Nov** | Repository-wide QA and sorting | Used Codex for a broader repository inspection and ChatGPT to critically discuss its findings. Issues investigated included checkout storage failures, focus handling, nested main landmarks, and cart quantity-limit feedback. AI also supported analysis of sorting and pagination edge cases. | Treated audit findings as hypotheses to verify. Implemented and tested price sorting with query-parameter validation, API-side ordering, and preserved pagination state; verified ordering against the live API and in the browser. See [PR #30](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/30). |
| **16 Nov** | Final QA, accessibility, and dependencies | Used Codex and ChatGPT for further inspection of error recovery, checkout failure behavior, semantic landmarks, text contrast, missing ratings, and dependency health. AI identified potential issues, including a Next.js error-boundary API mismatch that required verification. | Reviewed changes before accepting them, tested critical shopping flows, corrected accessibility and error-handling issues, and updated Next.js from 16.4.2 to 16.4.6. Codex also modified files unexpectedly during a review; I stopped to inspect the working-tree changes and reinforced the rule that AI audit work must not make unapproved edits. See [PR #32](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/32), [PR #33](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/33), and [PR #34](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/34). |

## Examples of critical evaluation

### 1. Financial calculations: understanding before changing code

The pricing audit began with a question raised during human QA, not an instruction to generate a new cart. I researched floating-point precision and compared approaches. The chosen solution converts prices to integer øre for calculation and converts the result to kroner for presentation. Tests were used to check discounts, quantities, rounding, and consistency. The important contribution of AI was explanation and discussion; the implementation still required review and validation.

### 2. A plausible fix was incompatible with Next.js

While correcting direct access to `/checkout-success`, a suggestion to make the page a Client Component conflicted with its `metadata` export. I did not keep the incompatible change. We re-evaluated the component boundary and separated the client-only behavior into `CheckoutSuccessClient.tsx`, preserving the server page and metadata. Regression tests and manual navigation checks were part of the verification.

### 3. Code-generation or review output can itself introduce risk

During final QA, Codex made file changes when I intended it to inspect and advise. This was not acceptable for my workflow. I inspected the Git working tree and required explicit review of any proposed change. My working rule is: **AI may investigate and propose; I decide what to edit, test, commit, and merge.**

### 4. Automated tests cannot prove the entire user experience

Vitest and jsdom are valuable for logic and component regressions, but they do not replace a real browser, screen-reader assessment, performance testing, or checks of external API behavior. I complemented automated tests with keyboard navigation, focus behavior, responsive layout, cart/checkout journeys, invalid-input checks, and manual API verification. Accessibility was considered throughout development, including permanent, temporary, and situational impairments.

## Testing and verification

The project uses TypeScript, ESLint, Vitest, React Testing Library, jsdom, and a Next.js production build. The `npm run check` script runs type-checking, linting, tests, and the production build in sequence.

**Latest recorded verification, 16 November 2026 ([PR #34](https://github.com/miastubb/Mia_Stubb-olsen_jsf_mar25ft/pull/34)):**

- 60 automated tests passing across 13 test files.
- TypeScript validation, ESLint, and production build passing.
- `npm audit --omit=dev` reporting **zero known production dependency vulnerabilities**.
- Seven moderate findings remained in development dependencies at that checkpoint.
- Some hydration tests still emitted `act(...)` environment warnings despite passing.
- Production Lighthouse verification was still pending after deployment and must not be recorded as completed here.

The checkout is a demonstration flow, not a real payment integration. Its `sessionStorage` confirmation marker is a navigation guard, not proof of a secure transaction.

## AI-related project file: `AGENTS.md`

The repository includes an `AGENTS.md` file generated or maintained by Next.js development tooling. It instructs coding agents to consult the installed framework documentation because Next.js APIs and conventions may differ between versions. Its presence does **not** mean that an AI agent authored the application, and it is separate from this disclosure of actual AI use.

## Reflection on AI use and responsibility

AI was most valuable for explaining unfamiliar TypeScript/Next.js concepts, identifying edge cases I might have overlooked, encouraging focused regression tests, and offering a second perspective during QA. It was less reliable when it assumed framework behavior without checking the installed version, diagnosed errors before inspecting the actual files, or proposed code that conflicted with existing architecture.

I learned to ask *why* a solution works, inspect the files and diffs, use small Git branches and pull requests, and verify changes rather than trusting a confident answer. I used AI-generated explanations, suggested snippets, test ideas, and documentation drafts selectively, while retaining responsibility for the design decisions, implementation, manual testing, commits, and final submission.

**Scope note:** This is a representative use log, not a complete transcript of prompts or a claim that every change was AI-assisted. Where a result was not independently rechecked, the document identifies it as a previously recorded verification rather than a fresh test run.
