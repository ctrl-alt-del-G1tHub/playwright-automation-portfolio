# AI-Assisted Test Generation — Worked Example

**Feature:** Contact Form submission  
**App:** [Restful Booker Platform](https://automationintesting.online)  
**Resulting test file:** [`tests/ui/contact-form.spec.ts`](../../tests/ui/contact-form.spec.ts)

This document shows the full workflow: requirement → AI-generated scenario list → audit and refinement → final test code. The goal is to make the reasoning visible, not just the output.

---

## Step 1 — The requirement

The contact form on the homepage allows visitors to send a message to the hotel. It collects:

| Field | Constraint |
|-------|-----------|
| Name | Required |
| Email | Required, valid email format |
| Phone | Required |
| Subject | Required, min 5 chars |
| Description | Required, min 20 chars |

On success, the page displays a confirmation message containing the sender's name. On failure, validation errors appear inline.

---

## Step 2 — The prompt used

```
You are a senior QA engineer. Given the following feature requirement, generate a 
comprehensive list of test scenarios covering happy path, alternate valid flows, 
boundary conditions, invalid inputs and error states, and any implicit assumptions 
in the requirement that could hide defects.

Format each scenario as:
SCENARIO: [short name]
GIVEN: [precondition]
WHEN: [action]
THEN: [expected outcome]
RISK: [low / medium / high]

Requirement:
The contact form collects name, email, phone, subject (min 5 chars), and description 
(min 20 chars). All fields are required. On success, show a confirmation containing 
the sender's name. On failure, show inline validation errors.
```

---

## Step 3 — Raw AI output

The model returned 14 scenarios. Reproduced verbatim:

```
SCENARIO: Happy path submission
GIVEN: User is on the homepage, all fields are empty
WHEN: User fills all fields with valid data and clicks Submit
THEN: Confirmation message appears containing the sender's name
RISK: high

SCENARIO: Confirmation contains sender name
GIVEN: User submits the form with name "Jane Tester"
WHEN: Confirmation message appears
THEN: The message includes the text "Jane Tester"
RISK: medium

SCENARIO: Missing name field
GIVEN: All fields filled except name
WHEN: User clicks Submit
THEN: Validation error is shown for the name field
RISK: medium

SCENARIO: Missing email field
GIVEN: All fields filled except email
WHEN: User clicks Submit
THEN: Validation error is shown for the email field
RISK: medium

SCENARIO: Invalid email format
GIVEN: All fields filled, email set to "not-an-email"
WHEN: User clicks Submit
THEN: Validation error is shown for the email field
RISK: medium

SCENARIO: Subject below minimum length
GIVEN: All fields filled, subject set to "Hi" (2 chars)
WHEN: User clicks Submit
THEN: Validation error is shown for the subject field
RISK: medium

SCENARIO: Description below minimum length
GIVEN: All fields filled, description set to "Short" (5 chars)
WHEN: User clicks Submit
THEN: Validation error is shown for the description field
RISK: medium

SCENARIO: Subject exactly at minimum length
GIVEN: All fields filled, subject set to "Hello" (5 chars)
WHEN: User clicks Submit
THEN: Form submits successfully
RISK: high

SCENARIO: Description exactly at minimum length
GIVEN: All fields filled, description set to a 20-character string
WHEN: User clicks Submit
THEN: Form submits successfully
RISK: high

SCENARIO: All fields empty on submit
GIVEN: No fields filled
WHEN: User clicks Submit
THEN: Validation errors appear for all required fields
RISK: medium

SCENARIO: Special characters in name
GIVEN: Name set to "O'Brien & Müller <test>"
WHEN: User submits
THEN: Form submits successfully or shows appropriate error; no XSS execution
RISK: high

SCENARIO: Very long input in description
GIVEN: Description filled with 10,000 characters
WHEN: User submits
THEN: Form handles gracefully — either submits or shows a max-length error
RISK: medium

SCENARIO: Form resets after successful submission
GIVEN: Form submitted successfully
WHEN: User views the form area
THEN: Fields are cleared / form returns to initial state
RISK: low

SCENARIO: Multiple rapid submissions
GIVEN: Form filled with valid data
WHEN: User clicks Submit multiple times quickly
THEN: Only one message is sent; no duplicate submissions
RISK: medium
```

---

## Step 4 — Audit and decisions

Each scenario was reviewed before writing any code. Decisions documented here so the reasoning is auditable.

| # | Scenario | Decision | Reason |
|---|----------|----------|--------|
| 1 | Happy path | **Keep** | Core success path, non-negotiable |
| 2 | Confirmation contains sender name | **Merge with #1** | Redundant as a standalone test — added as a second assertion inside the happy path test |
| 3 | Missing name | **Keep, generalise** | Collapsed #3, #4 with #5, #6, #7 into a data-driven loop using `invalidContacts` array — avoids 5 near-identical test bodies |
| 4 | Missing email | **Keep, generalise** | See above |
| 5 | Invalid email format | **Keep, generalise** | See above |
| 6 | Subject below minimum | **Defer** | The app's actual minimum is unclear from the UI — added to backlog, needs charter test first |
| 7 | Description below minimum | **Keep, generalise** | Confirmed 20-char minimum from validation error text |
| 8 | Subject exactly at minimum | **Defer** | Same uncertainty as #6 |
| 9 | Description exactly at minimum | **Defer** | Boundary value is ambiguous — "min 20" could mean ≥20 or >20; needs exploratory session |
| 10 | All fields empty | **Defer** | Covered implicitly by the missing-field cases; the specific combined state adds little new information |
| 11 | Special characters / XSS | **Keep as backlog item** | High risk, but needs a security-focused session rather than a Playwright assertion — added to `docs/test-backlog.md` |
| 12 | Very long input | **Keep as backlog item** | Valid edge case but app doesn't document a max length; needs investigation |
| 13 | Form resets after success | **Keep (lightweight)** | Added as a smoke-level check — just asserts the submit button is still visible post-success |
| 14 | Multiple rapid submissions | **Defer** | Concurrency testing requires a different approach (parallel requests); not suited to a single-browser Playwright spec |

**Net result:** 14 raw scenarios → 5 implemented tests + 4 backlog items + 5 deferred/merged.

---

## Step 5 — What changed during implementation

Two things emerged during actual test writing that the AI didn't surface:

1. **The success message selector was ambiguous.** The model assumed a single `.alert-success` element. In practice, the app sometimes renders a `<h2>` with the sender's name instead. The test was written to handle both: `page.locator('.alert-success, .contact-us h2')`. This would not have been caught without running the tests against the live app.

2. **Scroll-into-view is required.** The contact form is below the fold. Without `scrollIntoViewIfNeeded()`, fill() calls succeeded silently but the submit click landed on the wrong element. This is a locator robustness issue the AI had no way to know about — it requires hands-on knowledge of the app.

Both are documented in [`pages/HomePage.ts`](../../pages/HomePage.ts) with inline comments.

---

## What this workflow produces

| | Without AI assist | With AI assist |
|--|-------------------|----------------|
| Time to initial scenario list | 30–45 min | 5 min |
| Scenarios generated | Typically 6–8 | 14 |
| Scenarios that became tests | — | 5 (kept) |
| Scenarios that informed backlog | — | 4 |
| Human judgment required | All of it | Audit + implementation |

The AI does not replace QA thinking. It removes the blank-page problem and front-loads the list so you spend your time on decisions rather than inventory.

---

## Related

- [Prompt library](../prompt-library.md) — the full set of prompts used across this project
- [Test backlog](../test-backlog.md) — deferred scenarios from this and other features
