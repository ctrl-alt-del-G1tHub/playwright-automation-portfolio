# AI-Assisted Test Generation — Maestro Mobile Flows

**Feature:** Authentication, product navigation, cart, and error states  
**App:** [Sauce Labs My Demo App (Android)](https://github.com/saucelabs/my-demo-app-android)  
**Tooling:** [Maestro](https://maestro.mobile.dev)  
**Resulting flows:** `maestro/*.yaml`

This document shows the same workflow used for the Restful Booker contact form — requirement → AI-generated scenario list → audit → final flow files — applied to mobile testing for the first time in this portfolio.

---

## Step 1 — The requirement

The Sauce Labs My Demo App is an Android app specifically built for automation practice. For the purposes of this exercise, the requirements were extracted by running the app manually for 20 minutes and noting the functional areas:

| Area | Description |
|------|-------------|
| Authentication | Users can log in with username/password. Wrong credentials show an inline error. Logged-in users can log out via the side menu. |
| Product catalog | The catalog screen loads on launch. Users can scroll through products, tap one to open a detail screen, and navigate back. |
| Shopping cart | Users add products from the detail screen. The cart screen lists items with quantities. Checkout is accessible from the cart. |
| Error / access control | Guests attempting checkout are redirected to login. Wrong login credentials show an error without crashing. |

**Credentials for the demo app:**  
- Valid: `bod@example.com` / `10203040`  
- No locked-user account is documented publicly — M01-07 is pending manual investigation.

---

## Step 2 — The prompt used

```
You are a senior mobile QA engineer. Given the following app description, generate a 
comprehensive list of Maestro test scenarios for an Android app. Cover:
- Happy path flows
- Error states and validation feedback
- Navigation flows (forward and back)
- Access control (gated features)

Format each scenario as:
SCENARIO: [short name]
GIVEN: [precondition]
WHEN: [action sequence]
THEN: [expected outcome]
RISK: [low / medium / high]
MAESTRO FLOW: [suggested flow file name]

App: Sauce Labs My Demo App (Android)
Functional areas: authentication (login/logout), product catalog, shopping cart, checkout gate.
```

---

## Step 3 — Raw AI output

The model returned 18 scenarios. Reproduced verbatim (lightly trimmed for length):

```
SCENARIO: Happy path login
GIVEN: App is launched, user is on the catalog screen
WHEN: User opens menu, taps Log In, enters valid credentials, taps Login
THEN: User lands on product catalog, no error is shown
RISK: high
MAESTRO FLOW: login-happy-path.yaml

SCENARIO: Wrong password shows error
GIVEN: App is launched, user is on the login screen
WHEN: User enters valid username but wrong password, taps Login
THEN: Inline error message appears, user stays on login screen
RISK: high
MAESTRO FLOW: login-invalid-credentials.yaml

SCENARIO: Empty username
GIVEN: User is on the login screen
WHEN: Username field is blank, password is filled, user taps Login
THEN: Error is shown or Login button is disabled
RISK: medium
MAESTRO FLOW: login-empty-username.yaml

SCENARIO: Empty password
GIVEN: User is on the login screen
WHEN: Password field is blank, username is filled, user taps Login
THEN: Error is shown or Login button is disabled
RISK: medium
MAESTRO FLOW: login-empty-password.yaml

SCENARIO: Logout
GIVEN: User is logged in
WHEN: User opens menu and taps Log Out
THEN: Menu reverts to showing "Log In"; user is in guest state
RISK: high
MAESTRO FLOW: logout.yaml

SCENARIO: Session persists after backgrounding
GIVEN: User is logged in
WHEN: User presses Home, then returns to app
THEN: User is still logged in
RISK: medium
MAESTRO FLOW: session-persistence.yaml (manual)

SCENARIO: Catalog loads on launch
GIVEN: App is freshly launched
WHEN: No action taken
THEN: Product catalog is visible with at least one item
RISK: high
MAESTRO FLOW: product-catalog-navigation.yaml

SCENARIO: Tap product opens detail
GIVEN: User is on the catalog
WHEN: User taps a product
THEN: Detail screen shows product name and price
RISK: high
MAESTRO FLOW: product-catalog-navigation.yaml

SCENARIO: Back from detail returns to catalog
GIVEN: User is on a product detail screen
WHEN: User presses back
THEN: Catalog is visible again
RISK: medium
MAESTRO FLOW: product-catalog-navigation.yaml

SCENARIO: Add to cart increments badge
GIVEN: User is on a product detail screen
WHEN: User taps Add To Cart
THEN: Cart badge count increases by 1
RISK: high
MAESTRO FLOW: add-to-cart.yaml

SCENARIO: Cart lists added items
GIVEN: User added a product to cart
WHEN: User opens the cart
THEN: Cart screen shows the product name and quantity
RISK: high
MAESTRO FLOW: add-to-cart.yaml

SCENARIO: Remove item updates cart
GIVEN: Cart has one item
WHEN: User removes the item
THEN: Cart is empty or shows empty-state message
RISK: medium
MAESTRO FLOW: remove-from-cart.yaml

SCENARIO: Add same item twice increments quantity
GIVEN: Cart already has one unit of a product
WHEN: User adds the same product again
THEN: Quantity shows 2, not two separate line items
RISK: medium
MAESTRO FLOW: cart-quantity-increment.yaml

SCENARIO: Guest checkout gated to login
GIVEN: User is not logged in, has items in cart
WHEN: User taps Proceed To Checkout
THEN: App redirects to login or shows a login prompt
RISK: high
MAESTRO FLOW: checkout-requires-login.yaml

SCENARIO: Checkout form validation — missing field
GIVEN: User is logged in and on the checkout form
WHEN: User submits without filling a required field
THEN: Validation error is shown for that field
RISK: medium
MAESTRO FLOW: checkout-validation.yaml

SCENARIO: Network offline — graceful error
GIVEN: Device has no network connectivity
WHEN: User attempts to load the catalog
THEN: App shows an error message, not a crash
RISK: medium
MAESTRO FLOW: (manual only — cannot toggle network in Maestro without adb)

SCENARIO: Sort / filter changes catalog order
GIVEN: User is on the catalog with default sort
WHEN: User changes the sort option
THEN: Product order changes accordingly
RISK: low
MAESTRO FLOW: catalog-sort.yaml

SCENARIO: Long input in checkout fields
GIVEN: User is on the checkout form
WHEN: User enters 500+ characters in a text field
THEN: App handles gracefully — truncates or shows error; no crash
RISK: low
MAESTRO FLOW: checkout-long-input.yaml
```

---

## Step 4 — Audit and decisions

| # | Scenario | Decision | Reason |
|---|----------|----------|--------|
| 1 | Happy path login | **Keep** | Core flow — non-negotiable |
| 2 | Wrong password error | **Keep** | Highest-value error state |
| 3 | Empty username | **Defer to pending** | Behavior unclear without running app; added to matrix as ⏳ |
| 4 | Empty password | **Defer to pending** | Same as above |
| 5 | Logout | **Keep** | Completes the auth lifecycle; catches session state bugs |
| 6 | Session persistence | **Manual only** | Requires backgrounding the app; Maestro cannot control device Home button reliably |
| 7-9 | Catalog load + detail + back | **Merge into one flow** | These are sequential steps, not independent scenarios; one flow reads better |
| 10-11 | Add to cart + cart verification | **Merge into one flow** | Same reason — natural user journey |
| 12 | Remove item | **Defer to pending** | Valid scenario; deferred to keep initial set focused |
| 13 | Quantity increment | **Defer to pending** | Valid; deferred |
| 14 | Guest checkout gate | **Keep** | Good error/access-control case — different category from login error |
| 15 | Checkout form validation | **Defer to pending** | Needs login + full checkout flow as precondition; higher setup cost |
| 16 | Network offline | **Manual only** | Cannot toggle connectivity in Maestro without adb — noted in matrix |
| 17 | Sort / filter | **Defer to pending** | Lower risk; no selector knowledge yet |
| 18 | Long input | **Defer (explicitly out of scope)** | Max-length limits not documented; speculative |

**Net result:** 18 raw scenarios → 5 flow files covering 14 assertions + 9 pending + 3 manual/deferred.

---

## Step 5 — What changed during implementation

Three things emerged during flow writing that the AI didn't surface:

1. **Resource IDs are not publicly documented.** The AI generated clean flow outlines, but every `tapOn` had to reference either visible text or a resource ID from the APK. For text-visible elements (`"Log In"`, `"Products"`, `"Add To Cart"`) this worked immediately. For inputs and icon buttons, resource IDs (`menuIV`, `nameET`, `passwordET`, `loginBtn`, `cartIV`) were taken from community-documented sources and will need validation against the actual running APK.

2. **`clearState: true` is essential.** Without clearing app state on launch, a previously logged-in session carries over into the "guest" error state test — producing a false pass. The AI did not include this by default. All five flows now use `clearState: true`.

3. **The checkout gate behavior is app-version dependent.** Some versions of the app show a modal; others navigate directly to the login screen. The `assertVisible: "Log In"` assertion covers both cases since the login screen or modal both contain that text — but this needed verification by reading community notes, not the AI output.

---

## What this workflow produces

| | Without AI assist | With AI assist |
|--|-------------------|----------------|
| Time to initial scenario list | 30–45 min | ~5 min |
| Scenarios generated | Typically 6–8 | 18 |
| Flows implemented | — | 5 |
| Scenarios that informed matrix | — | 9 (pending) + 3 (manual) |
| Human judgment required | All of it | Audit + selector research + `clearState` fix |

The same pattern holds for mobile as for web: AI removes the blank-page problem and front-loads the list. The QA engineer's job is deciding which scenarios are real, which are duplicates, and which hit platform limits the model doesn't know about.

---

## Related

- [Mobile Scenario Matrix](../mobile-scenario-matrix.md) — requirements-to-flow traceability for the Android demo app
- [Prompt Library](../prompt-library.md) — reusable prompts including the one used above
- [Contact Form Worked Example](contact-form-worked-example.md) — same workflow applied to web/Playwright
