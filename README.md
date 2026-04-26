# Restful Booker — Playwright Test Suite

Built by a senior QA professional with 10 years of enterprise testing experience to demonstrate modern Playwright automation architecture. This suite reflects real-world practices including Page Object Model structure, custom fixture design, data-driven testing, API validation, and CI/CD integration — matching the same patterns used in production QA work across large-scale CRM systems and AI-native product builds.

[![Playwright Tests](https://github.com/ctrl-alt-del-G1tHub/playwright-automation-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/ctrl-alt-del-G1tHub/playwright-automation-portfolio/actions/workflows/playwright.yml)
![Tests](https://img.shields.io/badge/tests-160-blue)
![Playwright](https://img.shields.io/badge/Playwright-1.44-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript&logoColor=white)

---

## Documentation

| Doc | What it contains |
|-----|-----------------|
| [Prompt Library](docs/prompt-library.md) | 7 reusable prompts for scenario generation, edge case discovery, coverage gap analysis, API contract testing, and more |
| [AI-Assisted Worked Example](docs/ai-assisted/contact-form-worked-example.md) | Full before/after: requirement → AI output → audit decisions → final tests, using the contact form as the case study |
| [Test Backlog](docs/test-backlog.md) | Deferred scenarios surfaced during AI analysis, with rationale and next steps |

---

## What's covered

| Layer | Scope |
|-------|-------|
| **UI — Homepage** | Page loads, room cards, contact section visibility |
| **UI — Contact Form** | Happy path submission, validation errors (data-driven) |
| **UI — Admin Login** | Valid login, wrong password, empty fields, unknown user |
| **UI — Room Management** | Create / delete rooms, validation, accessible flag |
| **UI — Message Inbox** | Inbox loads, end-to-end: submit contact → verify in inbox |
| **API — Auth** | Login 200/403, token validation |
| **API — Rooms** | GET list, GET single, POST create, DELETE, schema validation |
| **API — Bookings** | POST create, overlapping date conflict (409), DELETE, schema |

---

## Project structure

```
restful-booker-tests/
├── .github/workflows/playwright.yml   # CI — runs on push, PR, and nightly
├── fixtures/
│   └── auth.fixture.ts                # Pre-authenticated page objects + API token
├── pages/                             # Page Object Model
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── AdminLoginPage.ts
│   ├── AdminRoomsPage.ts
│   └── AdminMessagesPage.ts
├── test-data/
│   ├── contact.ts                     # Valid + invalid contact payloads
│   └── rooms.ts                       # Room fixture data
├── tests/
│   ├── ui/
│   │   ├── homepage.spec.ts
│   │   ├── contact-form.spec.ts
│   │   └── admin/
│   │       ├── login.spec.ts
│   │       ├── rooms.spec.ts
│   │       └── messages.spec.ts
│   └── api/
│       ├── auth.spec.ts
│       ├── rooms.spec.ts
│       └── bookings.spec.ts
├── utils/
│   └── api-helpers.ts                 # Reusable request helpers
└── playwright.config.ts
```

---

## Key design decisions

- **Page Object Model** — all locators and actions live in `pages/`. Tests stay thin and readable.
- **Custom fixtures** (`fixtures/auth.fixture.ts`) — handle authentication once, inject ready-to-use page objects. No duplicated login logic across specs.
- **API tests via Playwright's `request` context** — no extra libraries needed; keeps the stack minimal.
- **Data-driven contact form tests** — `invalidContacts` array drives multiple negative test cases from a single `for` loop.
- **Cleanup in `afterAll`** — API tests create resources and track their IDs, then delete them regardless of pass/fail to keep the shared demo app clean.
- **Parallelism** — `fullyParallel: true` in config; CI matrix runs chromium, firefox, and API project concurrently.

---

## Running locally

```bash
# Install dependencies and browsers
npm install
npx playwright install --with-deps

# Run all tests
npm test

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run in headed mode (watch the browser)
npm run test:headed

# Open the HTML report
npm run test:report
```

---

## CI / GitHub Actions

The workflow (`.github/workflows/playwright.yml`) runs on:
- Every push to `main` / `develop`
- Every pull request to `main`
- Nightly at midnight UTC (scheduled)

It uses a matrix strategy to run Chromium, Firefox, and API tests in parallel. Test reports and failure artifacts (screenshots, traces, videos) are uploaded as workflow artifacts and retained for 30 days.

---

## Application under test

- **Live demo:** https://automationintesting.online
- **Source code:** https://github.com/mwinteringham/restful-booker-platform
- **Admin credentials:** `admin` / `password`
- **API base URL:** `https://automationintesting.online`

---

## Tech stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.44 | Browser automation + API testing |
| TypeScript | ^5.4 | Type safety |
| GitHub Actions | — | CI/CD |
