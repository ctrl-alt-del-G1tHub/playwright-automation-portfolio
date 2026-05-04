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
| [Scenario Matrix](docs/scenario-matrix.md) | Requirements-to-test traceability across all 6 feature areas — 59 scenarios mapped with risk and automation status |
| [Coverage Checklist](docs/coverage-checklist.md) | Feature-by-feature view of what's done, pending, manual-only, and explicitly out of scope |
| [Prompt Library](docs/prompt-library.md) | 7 reusable prompts for scenario generation, edge case discovery, coverage gap analysis, API contract testing, and more |
| [AI-Assisted Worked Example — Web](docs/ai-assisted/contact-form-worked-example.md) | Full before/after: requirement → AI output → audit decisions → final tests, using the contact form as the case study |
| [AI-Assisted Worked Example — Mobile](docs/ai-assisted/maestro-flow-generation.md) | Same workflow applied to Maestro mobile flows: 18 raw scenarios → 5 flows + audit trail |
| [Mobile Scenario Matrix](docs/mobile-scenario-matrix.md) | Requirements-to-flow traceability for the Android demo app — 26 scenarios across 4 feature areas |
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
├── maestro/                           # Maestro mobile flows (Android)
│   ├── login-happy-path.yaml
│   ├── login-invalid-credentials.yaml
│   ├── product-catalog-navigation.yaml
│   ├── add-to-cart.yaml
│   ├── checkout-requires-login.yaml
│   └── logout.yaml
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

## Mobile testing — Maestro (Android)

The `maestro/` folder contains 5 flows for the **Sauce Labs My Demo App** — an Android app built specifically for automation practice, analogous to how Restful Booker is built for web testing.

| Flow | What it covers |
|------|---------------|
| `login-happy-path.yaml` | Valid credentials → product catalog |
| `login-invalid-credentials.yaml` | Wrong password → inline error; stays on login screen |
| `product-catalog-navigation.yaml` | Catalog loads, tap product, view detail, navigate back |
| `add-to-cart.yaml` | Add item from detail screen, verify cart badge and cart contents |
| `checkout-requires-login.yaml` | Guest attempting checkout is redirected to login (access control) |
| `logout.yaml` | Logged-in user logs out; menu reverts to guest state |

**App under test:**
- Source: https://github.com/saucelabs/my-demo-app-android
- Package: `com.saucelabs.mydemoapp.android`
- Credentials: `bod@example.com` / `10203040`

**Prerequisites:**
```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Start an Android emulator (API 29+ recommended), then:
adb install my-demo-app.apk
```

**Run all mobile flows:**
```bash
maestro test maestro/
```

**Run a single flow:**
```bash
maestro test maestro/login-happy-path.yaml
```

**Notes on selector strategy:** Flows use a mix of visible text (`"Log In"`, `"Products"`) and resource IDs (`menuIV`, `nameET`, `loginBtn`, `cartIV`). If resource IDs differ across APK versions, swap them for `text:` or `id:` matchers using Maestro's built-in hierarchy viewer (`maestro studio`). See [`docs/ai-assisted/maestro-flow-generation.md`](docs/ai-assisted/maestro-flow-generation.md) for full audit reasoning.

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
