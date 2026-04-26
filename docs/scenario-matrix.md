# Test Scenario Matrix

Maps each functional requirement to its test scenarios, test type, location, and automation status. Use this as the traceability layer between what the app is supposed to do and what the test suite actually covers.

**Status key:** `✅ Automated` `⏳ Pending` `🔁 Manual` `❌ Deferred`  
**Risk key:** `🔴 High` `🟡 Medium` `🟢 Low`

---

## REQ-01 — Homepage loads and displays rooms

| ID | Scenario | Type | Risk | Status | Test Location |
|----|----------|------|------|--------|---------------|
| 01-01 | Page title contains "Restful Booker" | UI | 🟢 | ✅ Automated | `tests/ui/homepage.spec.ts` |
| 01-02 | Hotel name is visible on load | UI | 🟢 | ✅ Automated | `tests/ui/homepage.spec.ts` |
| 01-03 | At least one room card is rendered | UI | 🔴 | ✅ Automated | `tests/ui/homepage.spec.ts` |
| 01-04 | Every room card has a Book button | UI | 🔴 | ✅ Automated | `tests/ui/homepage.spec.ts` |
| 01-05 | Contact section is present below the fold | UI | 🟢 | ✅ Automated | `tests/ui/homepage.spec.ts` |
| 01-06 | Room images load without 404 errors | UI | 🟡 | ⏳ Pending | `docs/test-backlog.md` |
| 01-07 | Page is responsive on mobile viewport | UI | 🟡 | ✅ Automated | `playwright.config.ts` (mobile-chrome project) |

---

## REQ-02 — Contact form submission

| ID | Scenario | Type | Risk | Status | Test Location |
|----|----------|------|------|--------|---------------|
| 02-01 | Valid submission shows success confirmation | UI | 🔴 | ✅ Automated | `tests/ui/contact-form.spec.ts` |
| 02-02 | Success message contains sender's name | UI | 🟡 | ✅ Automated | `tests/ui/contact-form.spec.ts` |
| 02-03 | Missing name shows validation error | UI | 🟡 | ✅ Automated | `tests/ui/contact-form.spec.ts` |
| 02-04 | Invalid email format shows validation error | UI | 🟡 | ✅ Automated | `tests/ui/contact-form.spec.ts` |
| 02-05 | Description below minimum length shows error | UI | 🟡 | ✅ Automated | `tests/ui/contact-form.spec.ts` |
| 02-06 | Subject below minimum length shows error | UI | 🟡 | ⏳ Pending | `docs/test-backlog.md` |
| 02-07 | All fields empty shows validation errors | UI | 🟢 | ❌ Deferred | Covered implicitly by 02-03 |
| 02-08 | Special characters / XSS in name field | Security | 🔴 | 🔁 Manual | `docs/test-backlog.md` |
| 02-09 | Very long input in description (10k+ chars) | UI | 🟡 | ⏳ Pending | `docs/test-backlog.md` |
| 02-10 | Submit button visible after successful send | UI | 🟢 | ✅ Automated | `tests/ui/contact-form.spec.ts` |
| 02-11 | Duplicate rapid submissions prevented | UI | 🟡 | ❌ Deferred | Needs concurrency approach |

---

## REQ-03 — Admin authentication

| ID | Scenario | Type | Risk | Status | Test Location |
|----|----------|------|------|--------|---------------|
| 03-01 | Login form fields and button are visible | UI | 🟢 | ✅ Automated | `tests/ui/admin/login.spec.ts` |
| 03-02 | Valid credentials redirect to admin panel | UI | 🔴 | ✅ Automated | `tests/ui/admin/login.spec.ts` |
| 03-03 | Wrong password shows error message | UI | 🔴 | ✅ Automated | `tests/ui/admin/login.spec.ts` |
| 03-04 | Empty credentials shows error message | UI | 🟡 | ✅ Automated | `tests/ui/admin/login.spec.ts` |
| 03-05 | Unknown username shows error message | UI | 🟡 | ✅ Automated | `tests/ui/admin/login.spec.ts` |
| 03-06 | POST /auth/login 200 with valid credentials | API | 🔴 | ✅ Automated | `tests/api/auth.spec.ts` |
| 03-07 | POST /auth/login 403 with wrong password | API | 🔴 | ✅ Automated | `tests/api/auth.spec.ts` |
| 03-08 | POST /auth/login 403 with unknown username | API | 🟡 | ✅ Automated | `tests/api/auth.spec.ts` |
| 03-09 | POST /auth/validate accepts valid token | API | 🔴 | ✅ Automated | `tests/api/auth.spec.ts` |
| 03-10 | POST /auth/validate rejects garbage token | API | 🔴 | ✅ Automated | `tests/api/auth.spec.ts` |
| 03-11 | Token expiry mid-session behaviour | API | 🔴 | ⏳ Pending | `docs/test-backlog.md` |

---

## REQ-04 — Admin room management

| ID | Scenario | Type | Risk | Status | Test Location |
|----|----------|------|------|--------|---------------|
| 04-01 | Room list loads with at least one room | UI | 🔴 | ✅ Automated | `tests/ui/admin/rooms.spec.ts` |
| 04-02 | Create a Single room — appears in list | UI | 🔴 | ✅ Automated | `tests/ui/admin/rooms.spec.ts` |
| 04-03 | Create a Suite with all features checked | UI | 🟡 | ✅ Automated | `tests/ui/admin/rooms.spec.ts` |
| 04-04 | Delete a room — removed from list | UI | 🔴 | ✅ Automated | `tests/ui/admin/rooms.spec.ts` |
| 04-05 | Create room without price shows error | UI | 🟡 | ✅ Automated | `tests/ui/admin/rooms.spec.ts` |
| 04-06 | GET /room/ returns list with correct schema | API | 🔴 | ✅ Automated | `tests/api/rooms.spec.ts` |
| 04-07 | GET /room/:id returns a single room | API | 🟡 | ✅ Automated | `tests/api/rooms.spec.ts` |
| 04-08 | POST /room/ creates room (authenticated) | API | 🔴 | ✅ Automated | `tests/api/rooms.spec.ts` |
| 04-09 | POST /room/ returns 403 without auth token | API | 🔴 | ✅ Automated | `tests/api/rooms.spec.ts` |
| 04-10 | DELETE /room/:id removes room; GET returns 404 | API | 🔴 | ✅ Automated | `tests/api/rooms.spec.ts` |
| 04-11 | Room response includes all required fields | API | 🟡 | ✅ Automated | `tests/api/rooms.spec.ts` |
| 04-12 | Room name with special characters | UI | 🟡 | ⏳ Pending | `docs/test-backlog.md` |
| 04-13 | Decimal room price (e.g. 99.99) | API | 🟡 | ⏳ Pending | `docs/test-backlog.md` |
| 04-14 | Duplicate room name behaviour | API | 🟡 | ⏳ Pending | `docs/test-backlog.md` |

---

## REQ-05 — Booking creation and management

| ID | Scenario | Type | Risk | Status | Test Location |
|----|----------|------|------|--------|---------------|
| 05-01 | GET /booking/ returns booking list (authenticated) | API | 🟡 | ✅ Automated | `tests/api/bookings.spec.ts` |
| 05-02 | POST /booking/ creates booking for valid room | API | 🔴 | ✅ Automated | `tests/api/bookings.spec.ts` |
| 05-03 | Overlapping booking for same room returns 409 | API | 🔴 | ✅ Automated | `tests/api/bookings.spec.ts` |
| 05-04 | Booking response includes all required fields | API | 🟡 | ✅ Automated | `tests/api/bookings.spec.ts` |
| 05-05 | DELETE /booking/:id removes the booking | API | 🔴 | ✅ Automated | `tests/api/bookings.spec.ts` |
| 05-06 | Checkout date before checkin date returns 4xx | API | 🔴 | ⏳ Pending | `docs/test-backlog.md` |
| 05-07 | Booking spanning partially-booked dates | API | 🔴 | ⏳ Pending | `docs/test-backlog.md` |
| 05-08 | Booking for a deleted room | API | 🟡 | ⏳ Pending | `docs/test-backlog.md` |
| 05-09 | UI booking calendar renders for available room | UI | 🔴 | ⏳ Pending | — |
| 05-10 | UI booking form submits and shows confirmation | UI | 🔴 | ⏳ Pending | — |

---

## REQ-06 — Admin message inbox

| ID | Scenario | Type | Risk | Status | Test Location |
|----|----------|------|------|--------|---------------|
| 06-01 | Inbox loads and displays messages | UI | 🟡 | ✅ Automated | `tests/ui/admin/messages.spec.ts` |
| 06-02 | Contact form message appears in admin inbox (E2E) | E2E | 🔴 | ✅ Automated | `tests/ui/admin/messages.spec.ts` |
| 06-03 | Clicking a message opens detail view | UI | 🟡 | ✅ Automated | `tests/ui/admin/messages.spec.ts` |
| 06-04 | Deleting a message removes it from inbox | UI | 🟡 | ⏳ Pending | `docs/test-backlog.md` |
| 06-05 | Unread message count badge updates on read | UI | 🟡 | ⏳ Pending | — |
| 06-06 | Inbox behaviour with zero messages | UI | 🟢 | ⏳ Pending | `docs/test-backlog.md` |

---

## Summary

| Requirement Area | Total Scenarios | Automated | Pending | Deferred/Manual |
|-----------------|-----------------|-----------|---------|-----------------|
| REQ-01 Homepage | 7 | 6 | 1 | 0 |
| REQ-02 Contact Form | 11 | 6 | 2 | 3 |
| REQ-03 Authentication | 11 | 10 | 1 | 0 |
| REQ-04 Room Management | 14 | 11 | 3 | 0 |
| REQ-05 Bookings | 10 | 5 | 5 | 0 |
| REQ-06 Messages | 6 | 3 | 3 | 0 |
| **Total** | **59** | **41 (69%)** | **15 (25%)** | **3 (5%)** |
