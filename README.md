# Restful Booker — Playwright Test Suite

A portfolio-quality test automation project targeting the public [Restful Booker Platform](https://automationintesting.online) demo app — a full B&B booking system built for testing practice.

[![Playwright Tests](https://github.com/YOUR_USERNAME/restful-booker-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/YOUR_USERNAME/restful-booker-tests/actions/workflows/playwright.yml)

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
