# QA Prompt Library — AI-Assisted Test Engineering

A curated set of prompts I use in active QA work to accelerate scenario generation, surface edge cases, and identify coverage gaps. Each prompt includes the context it works best in and notes on how to audit the output before it becomes real test coverage.

These prompts are tool-agnostic — they work with Claude, ChatGPT, Copilot, or any capable LLM. The value is in knowing *when* to use them and *how* to critically evaluate what comes back.

---

## 1. Requirements → Test Scenarios

**When to use:** You have a user story, acceptance criteria, or a feature spec and need to generate a comprehensive scenario list quickly.

```
You are a senior QA engineer. Given the following feature requirement, generate a 
comprehensive list of test scenarios covering:
- Happy path (primary success flow)
- Alternate valid flows
- Boundary conditions
- Invalid inputs and error states
- State-dependent behaviour (e.g. actions that depend on prior steps)
- Any implicit assumptions in the requirement that could hide defects

Format each scenario as:
SCENARIO: [short name]
GIVEN: [precondition]
WHEN: [action]
THEN: [expected outcome]
RISK: [low / medium / high — how likely this scenario is to hide a real defect]

Requirement:
[paste requirement here]
```

**Audit checklist before promoting to tests:**
- [ ] Remove any scenario where the THEN is "it should work" — force specificity
- [ ] Cross-check RISK ratings; the LLM tends to mark everything medium
- [ ] Flag scenarios that require test data you don't yet have
- [ ] Collapse near-duplicates; LLMs pad lists with subtle rewording

---

## 2. Edge Case Discovery

**When to use:** You have a first-pass scenario list and want to pressure-test it before writing any code.

```
You are a senior QA engineer reviewing a test scenario list for a [feature name] feature.
Your job is to find what's missing — not to restate what's already there.

Focus specifically on:
- Concurrency and race conditions (two users acting simultaneously)
- Session and authentication edge cases (token expiry mid-flow, concurrent sessions)
- Network/timing edge cases (slow response, timeout, partial failure)
- Data edge cases (empty strings, max-length values, special characters, Unicode, SQL injection patterns)
- Integration boundary cases (what happens if a downstream service returns unexpected data)
- UI-specific edge cases (rapid clicks, browser back/forward, page refresh mid-flow)

Existing scenarios:
[paste scenario list]

Return ONLY the gaps — scenarios not already covered above. For each, state why it's worth testing.
```

**Audit note:** The concurrency and integration boundary suggestions are usually the highest signal. UI edge cases (double-click, back button) are often raised but skipped in practice — make an explicit decision to include or defer rather than letting them silently drop.

---

## 3. Coverage Gap Analysis

**When to use:** You have an existing test suite and want an outside perspective on what's untested before a release or major refactor.

```
You are a QA architect performing a coverage gap analysis. I will give you:
1. A description of the feature under test
2. The existing test file(s)

Your job is to identify meaningful gaps — areas of behaviour that are not exercised by 
the existing tests and that carry real defect risk.

Do NOT suggest:
- Tests that are already present under a different name
- Trivially low-risk scenarios (e.g. "what if the user doesn't move the mouse")
- Performance or load testing (out of scope)

For each gap, state:
GAP: [what's not tested]
RISK: [what could go wrong if it's missing]
SUGGESTED TEST: [one-line scenario]

Feature description:
[describe the feature]

Existing tests:
[paste test file or list of test names]
```

**Audit note:** Pay close attention to gaps flagged around auth token handling and error recovery — those are where this prompt consistently surfaces real defects in enterprise systems.

---

## 4. API Contract Validation

**When to use:** You have an API response (real or documented) and need to define what a proper contract test should assert.

```
You are a senior API test engineer. Given the following API response payload, generate 
a complete list of assertions for a contract test. Cover:

- Required fields (must always be present)
- Field types (string, number, boolean, array, object, null)
- Value constraints (non-empty, positive number, valid enum, valid date format, etc.)
- Relationships between fields (e.g. if status is "cancelled", refund_amount must be present)
- Fields that should NOT be present (e.g. internal IDs, passwords, tokens leaked in response)

Format as a numbered assertion list. Flag any field whose contract is ambiguous and 
needs clarification from the team.

API endpoint: [METHOD /path]
Response payload:
[paste JSON]
```

**Audit note:** The "fields that should NOT be present" category is routinely missed by human reviewers and consistently surfaced by this prompt. It's caught real data-exposure issues in production API audits.

---

## 5. Regression Impact Analysis

**When to use:** A developer has made a change and you need to decide which tests to prioritise or whether existing tests need updating.

```
You are a QA engineer assessing regression risk for a code change.

Given the diff below, identify:
1. Which existing test areas are most likely to be impacted (and why)
2. Any new scenarios that should be added to cover the changed behaviour
3. Any existing tests that may now give false confidence (i.e. they pass but no longer 
   test the right thing)

Be specific about file names and test names where you can infer them.

Code diff:
[paste diff]

Existing test coverage summary:
[paste test names or describe coverage]
```

---

## 6. Exploratory Testing Charters

**When to use:** You're planning an exploratory testing session and want structured charters rather than unguided exploration.

```
You are a senior QA engineer preparing exploratory testing charters for a sprint demo 
or pre-release session.

Generate 5 exploratory testing charters for the following feature. Each charter should 
follow the format:

EXPLORE: [area or component]
WITH: [tool, technique, or approach]
TO DISCOVER: [what risks or information you're looking for]
TIME BOX: [suggested duration]

Prioritise charters that target integration points, auth flows, and data persistence — 
those are highest defect density in most systems.

Feature:
[describe the feature]
```

---

## 7. Test Data Generation

**When to use:** You need realistic, varied test data for a specific domain and don't want to hand-craft it.

```
Generate test data for the following scenario. Include:
- 3 valid examples (mainstream cases)
- 2 valid edge cases (boundary values, unusual but allowed input)
- 3 invalid examples with the specific validation rule each one violates
- 1 adversarial example (input designed to probe security or injection risks)

Return as a JSON array with a "label" field on each object describing the case.

Domain: [e.g. hotel booking, user registration, payment form]
Fields needed: [list field names and any known constraints]
```

---

## How I use these in practice

1. **Start with prompt #1** on any new feature to get a scenario skeleton within minutes
2. **Run prompt #2** on that output before writing a single line of test code — it reliably adds 3–5 scenarios I would have missed
3. **Use prompt #4** on every new API endpoint as part of the definition-of-done conversation with developers
4. **Before a release**, run prompt #3 against the actual test files to get an honest gap report I can show to stakeholders
5. **All output gets audited** — none of it goes directly into a test file. The LLM drafts; I decide.

The discipline is in the audit step. AI output without human review adds noise. With review, it compresses hours of scenario analysis into minutes and lets you spend your expertise on the judgment calls, not the list-making.
