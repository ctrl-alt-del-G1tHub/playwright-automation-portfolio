# Test Backlog

Scenarios surfaced during AI-assisted analysis that are valid but deferred — either because they require further investigation, a different testing approach, or a dedicated exploratory session before automation makes sense.

---

## Contact Form

| Scenario | Why deferred | Next step |
|----------|-------------|-----------|
| Subject field minimum length boundary | Actual minimum is unclear from UI and source; "min 5" not confirmed | Exploratory session + inspect validation error text |
| Description exactly at minimum (20 chars) | Ambiguous whether constraint is ≥20 or >20 | Check server-side validation response |
| Special characters / XSS in name field | High risk but needs security-focused session, not a pass/fail assertion | Add to security charter; test manually with `<script>alert(1)</script>` and `' OR 1=1--` |
| Very long description (10k+ chars) | No documented max length | Investigate API — does `/message/` have a length constraint in the schema? |
| Multiple rapid submissions (double-click / race) | Concurrency not suited to single-browser spec | Test via parallel API requests using `api-helpers.ts` |

---

## Admin — Room Management

| Scenario | Why deferred | Next step |
|----------|-------------|-----------|
| Room name with special characters | Not tested; potential display/encoding issue | Manual exploratory pass |
| Price field with decimal values (e.g. 99.99) | App may round or reject decimals | Investigate API schema for `roomPrice` type |
| Creating a room with duplicate name | Behaviour undefined — error or silent allow? | Exploratory session + API test |

---

## Bookings

| Scenario | Why deferred | Next step |
|----------|-------------|-----------|
| Booking with checkout before checkin | Should return 4xx; not yet verified | API test — add to `bookings.spec.ts` |
| Booking spanning a date already partially booked | Partial overlap edge case | API test with date arithmetic |
| Booking for a room that is subsequently deleted | Referential integrity — does the booking still return? | Investigate API behaviour |

---

## General / Cross-cutting

| Scenario | Why deferred | Next step |
|----------|-------------|-----------|
| Session token expiry mid-flow | Auth token has a TTL; expired token behaviour untested | Check `/auth/validate` response after deliberate delay |
| Admin panel with no rooms in the system | Edge state — does the UI handle an empty list gracefully? | Manual + automate once confirmed |
