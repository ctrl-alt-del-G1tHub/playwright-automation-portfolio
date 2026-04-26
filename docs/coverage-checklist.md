# Test Coverage Checklist

A feature-by-feature view of what is covered, what is pending, and what is explicitly out of scope. Use this alongside the [scenario matrix](scenario-matrix.md) — the matrix shows traceability, this shows completeness at a glance.

**Legend:** `✅ Done` `⏳ Pending` `🔁 Manual only` `❌ Out of scope`

---

## UI Testing

### Homepage
- ✅ Page title correct
- ✅ Hotel name visible
- ✅ Room cards render (≥1)
- ✅ Each room card has a Book button
- ✅ Contact section visible
- ✅ Mobile viewport (Pixel 5 via Playwright project)
- ⏳ Room images load without 404s
- ⏳ Room descriptions render correctly
- ❌ Visual regression / pixel diffing (out of scope — requires dedicated tooling e.g. Percy)

### Contact Form
- ✅ Happy path submission succeeds
- ✅ Success message contains sender's name
- ✅ Missing name → validation error
- ✅ Invalid email format → validation error
- ✅ Description too short → validation error
- ✅ Submit button still visible after success
- ⏳ Subject too short → validation error
- ⏳ Max-length input handling
- 🔁 XSS / injection in text fields (manual security session)
- 🔁 Paste vs. type behaviour differences
- ❌ Accessibility (ARIA, screen reader) — out of scope for this suite

### Admin Login
- ✅ Form elements visible
- ✅ Valid login redirects to `/admin/rooms`
- ✅ Wrong password → error
- ✅ Empty fields → error
- ✅ Unknown username → error
- ⏳ Session persistence across page refresh
- ⏳ Logout behaviour
- 🔁 Brute-force lockout (manual security session)

### Admin — Room Management
- ✅ Room list loads
- ✅ Create Single room → appears in list
- ✅ Create Suite with all features → appears in list
- ✅ Delete room → removed from list
- ✅ Create without price → validation error
- ⏳ Edit existing room details
- ⏳ Room with special characters in name
- ⏳ Accessible flag toggles correctly
- ⏳ Individual feature checkboxes persist after save
- ❌ Drag-and-drop room ordering (not implemented in app)

### Admin — Message Inbox
- ✅ Inbox loads with messages
- ✅ Contact form message appears in inbox (E2E)
- ✅ Clicking message opens detail view
- ⏳ Delete message → removed from list
- ⏳ Unread badge count decrements on read
- ⏳ Empty inbox state renders gracefully

### Booking UI
- ⏳ Booking calendar renders for an available room
- ⏳ Selecting valid dates enables the booking form
- ⏳ Submitting booking form shows confirmation
- ⏳ Selecting unavailable dates is prevented
- ⏳ Booking confirmation displays correct details

---

## API Testing

### Auth API (`/auth`)
- ✅ POST `/auth/login` — 200 with valid credentials
- ✅ POST `/auth/login` — 403 with wrong password
- ✅ POST `/auth/login` — 403 with unknown username
- ✅ POST `/auth/validate` — 200 with valid token
- ✅ POST `/auth/validate` — 403 with invalid token
- ⏳ Token TTL / expiry behaviour
- ⏳ POST `/auth/logout` invalidates token

### Rooms API (`/room`)
- ✅ GET `/room/` — 200, returns array with ≥1 room
- ✅ GET `/room/:id` — 200, returns single room object
- ✅ POST `/room/` — 201, creates room when authenticated
- ✅ POST `/room/` — 403 when unauthenticated
- ✅ DELETE `/room/:id` — 202, subsequent GET returns 404
- ✅ Response schema validation (all required fields present)
- ⏳ GET `/room/:id` — 404 for non-existent ID
- ⏳ PUT `/room/:id` — update existing room
- ⏳ POST `/room/` with missing required fields — 4xx
- ⏳ POST `/room/` with decimal price
- ⏳ POST `/room/` with duplicate room name

### Bookings API (`/booking`)
- ✅ GET `/booking/` — 200, returns list (authenticated)
- ✅ POST `/booking/` — creates booking for valid room
- ✅ POST `/booking/` — 409 for overlapping dates same room
- ✅ Response schema validation (all required fields present)
- ✅ DELETE `/booking/:id` — 202
- ⏳ POST `/booking/` — checkout before checkin → 4xx
- ⏳ POST `/booking/` — partial date overlap → 409
- ⏳ POST `/booking/` — booking for deleted room → 4xx
- ⏳ GET `/booking/:id` — returns single booking
- ⏳ PUT `/booking/:id` — update booking dates

### Messages API (`/message`)
- ⏳ GET `/message/` — returns list (authenticated)
- ⏳ POST `/message/` — creates message (mirrors contact form)
- ⏳ GET `/message/:id` — returns single message
- ⏳ DELETE `/message/:id` — removes message
- ⏳ POST `/message/` without required fields → 4xx

### Reports API (`/report`)
- ⏳ GET `/report/` — returns booking summary data
- ❌ Detailed report content validation — out of scope for this sprint

---

## Cross-cutting Concerns

### Security
- 🔁 XSS in contact form fields (manual)
- 🔁 SQL injection in login form (manual)
- 🔁 Auth token not exposed in URL or response body (manual API audit)
- ⏳ Unauthenticated access to admin API endpoints returns 403
- ❌ Penetration testing — out of scope

### Performance
- ❌ Load testing — out of scope (separate tooling e.g. k6)
- ❌ Response time SLA assertions — out of scope

### Accessibility
- ❌ WCAG compliance — out of scope for this suite

### Browser / Device Coverage
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit / Safari (Desktop)
- ✅ Mobile Chrome (Pixel 5)
- ⏳ Mobile Safari (iPhone)
- ❌ IE11 / legacy browsers — not supported by app

---

## Coverage at a Glance

| Area | Done | Pending | Manual/OOS |
|------|------|---------|------------|
| UI — Homepage | 5 | 2 | 1 |
| UI — Contact Form | 6 | 2 | 3 |
| UI — Admin Login | 5 | 2 | 1 |
| UI — Rooms | 5 | 5 | 0 |
| UI — Messages | 3 | 3 | 0 |
| UI — Booking Flow | 0 | 5 | 0 |
| API — Auth | 5 | 2 | 0 |
| API — Rooms | 6 | 5 | 0 |
| API — Bookings | 5 | 5 | 0 |
| API — Messages | 0 | 5 | 0 |
| Cross-cutting | 0 | 1 | 5+ |
| **Total** | **40** | **37** | **10+** |

> Coverage is a living document. Items in Pending become the sprint backlog for the next iteration. Items marked Out of Scope are explicit decisions, not omissions — each has a reason.
