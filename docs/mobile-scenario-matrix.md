# Mobile Test Scenario Matrix — Sauce Labs My Demo App (Android)

Maps functional requirements for the Android demo app to their Maestro flow files, risk, and automation status.

**App:** [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-android)  
**Package:** `com.saucelabs.mydemoapp.android`  
**Tooling:** [Maestro](https://maestro.mobile.dev)

**Status key:** `✅ Automated` `⏳ Pending` `🔁 Manual` `❌ Deferred`  
**Risk key:** `🔴 High` `🟡 Medium` `🟢 Low`

---

## REQ-M01 — Authentication

| ID | Scenario | Type | Risk | Status | Flow File |
|----|----------|------|------|--------|-----------|
| M01-01 | Valid credentials → land on product catalog | UI | 🔴 | ✅ Automated | `maestro/login-happy-path.yaml` |
| M01-02 | Wrong password → inline error message | UI | 🔴 | ✅ Automated | `maestro/login-invalid-credentials.yaml` |
| M01-03 | Logged-in user can log out; menu reverts to "Log In" | UI | 🔴 | ✅ Automated | `maestro/logout.yaml` |
| M01-04 | Empty username field → error or disabled login button | UI | 🟡 | ⏳ Pending | — |
| M01-05 | Empty password field → error or disabled login button | UI | 🟡 | ⏳ Pending | — |
| M01-06 | Session persists across app backgrounding | UI | 🟡 | 🔁 Manual | — |
| M01-07 | Locked/blocked user account shows specific error | UI | 🟡 | ⏳ Pending | — |

---

## REQ-M02 — Product Catalog Navigation

| ID | Scenario | Type | Risk | Status | Flow File |
|----|----------|------|------|--------|-----------|
| M02-01 | Catalog loads on app launch | UI | 🔴 | ✅ Automated | `maestro/product-catalog-navigation.yaml` |
| M02-02 | At least one product is visible | UI | 🔴 | ✅ Automated | `maestro/product-catalog-navigation.yaml` |
| M02-03 | Tapping a product opens its detail screen | UI | 🔴 | ✅ Automated | `maestro/product-catalog-navigation.yaml` |
| M02-04 | Detail screen shows product name and price | UI | 🟡 | ✅ Automated | `maestro/product-catalog-navigation.yaml` |
| M02-05 | Back navigation returns to catalog | UI | 🟡 | ✅ Automated | `maestro/product-catalog-navigation.yaml` |
| M02-06 | Sort / filter changes the displayed order | UI | 🟡 | ⏳ Pending | — |
| M02-07 | Catalog scrolls to load all products | UI | 🟢 | ⏳ Pending | — |

---

## REQ-M03 — Shopping Cart Management

| ID | Scenario | Type | Risk | Status | Flow File |
|----|----------|------|------|--------|-----------|
| M03-01 | Adding a product from detail screen puts it in cart | UI | 🔴 | ✅ Automated | `maestro/add-to-cart.yaml` |
| M03-02 | Cart screen lists all added items | UI | 🔴 | ✅ Automated | `maestro/add-to-cart.yaml` |
| M03-03 | Cart quantity shows correct count | UI | 🟡 | ✅ Automated | `maestro/add-to-cart.yaml` |
| M03-04 | "Proceed To Checkout" button is present in cart | UI | 🟡 | ✅ Automated | `maestro/add-to-cart.yaml` |
| M03-05 | Removing an item from cart updates total | UI | 🟡 | ⏳ Pending | — |
| M03-06 | Empty cart shows an appropriate empty state message | UI | 🟢 | ⏳ Pending | — |
| M03-07 | Adding the same item twice increments quantity | UI | 🟡 | ⏳ Pending | — |

---

## REQ-M04 — Error States and Access Control

| ID | Scenario | Type | Risk | Status | Flow File |
|----|----------|------|------|--------|-----------|
| M04-01 | Guest user attempting checkout is gated to login | UI | 🔴 | ✅ Automated | `maestro/checkout-requires-login.yaml` |
| M04-02 | Login with wrong password shows error without crash | UI | 🔴 | ✅ Automated | `maestro/login-invalid-credentials.yaml` |
| M04-03 | Network offline → app shows graceful error (not crash) | UI | 🟡 | 🔁 Manual | — |
| M04-04 | Very long input in checkout fields handled gracefully | UI | 🟢 | ❌ Deferred | Input length limits unspecified |
| M04-05 | Checkout form missing required field shows validation | UI | 🟡 | ⏳ Pending | — |

---

## Summary

| Requirement Area | Total Scenarios | Automated | Pending | Deferred/Manual |
|-----------------|-----------------|-----------|---------|-----------------|
| REQ-M01 Authentication | 7 | 3 | 3 | 1 |
| REQ-M02 Catalog Navigation | 7 | 5 | 2 | 0 |
| REQ-M03 Cart Management | 7 | 4 | 3 | 0 |
| REQ-M04 Error States | 5 | 2 | 1 | 2 |
| **Total** | **26** | **14 (54%)** | **9 (35%)** | **3 (12%)** |
