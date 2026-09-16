# Coupon Engine Demo

A React + Vite prototype demonstrating a dual-source coupon system: company-wide
coupons created by an admin, and personal coupons created by individual "gurus."
Both share one validation engine at checkout.

No backend, no real database, no real authentication — everything is stored in
`localStorage` via a React Context (`src/context/DataContext.jsx`) which acts as
the shared "database" for the whole app.

## Running the project

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Project structure

- `src/context/DataContext.jsx` — shared "database" (coupons + usage records), persisted to localStorage.
- `src/utils/couponValidation.js` — the **one shared validation function** (`validateCoupon`) used by checkout regardless of coupon source. Source-specific tagging (campaignId vs guruId) only happens afterwards, when a usage record is logged.
- `src/utils/mockData.js` — mock gurus, customers, prices, and dropdown options.
- `src/components/CouponForm.jsx` — shared coupon-creation form used by both the Admin and Guru panels.
- `src/pages/` — one file per screen: `AdminPanel`, `GuruPanel`, `Checkout`, `AdminDashboard`, `GuruDashboard`, `DebugView`.

## Pages

| Route | Page |
|---|---|
| `/admin` | Admin Panel — create company coupons |
| `/guru` | Guru Panel — create a guru's own coupons (pick which guru is "logged in") |
| `/checkout` | Customer Checkout — mock cart + coupon application |
| `/admin-dashboard` | Admin Dashboard — company campaign analytics |
| `/guru-dashboard` | Guru Dashboard — per-guru analytics |
| `/debug` | Global Debug View — every usage record, both sources, in one table |

## How to test the full demo script

1. **Create a company coupon.** Go to **Admin Panel** (`/admin`). Create:
   - Code: `SITEWIDE25`, Discount: `25` (percentage), Applicable On: `Both`, Max Total Uses: `1000`, Max Uses Per Customer: `1`, any valid date range covering today.
   - It should appear in the table below with a `campaignId` and Usage Count `0`.

2. **Create a guru coupon.** Go to **Guru Panel** (`/guru`). Select **Guru Ravi** from the "Logged in as" dropdown. Create:
   - Code: `GURU_RAVI20`, Discount: `20` (percentage), Applicable On: `Consultation only`, Max Total Uses: `500`, Max Uses Per Customer: `1`, any valid date range covering today.
   - It should appear in Guru Ravi's table (no campaignId field — it's auto-tagged to his guru ID internally).

3. **Meena books a consultation with GURU_RAVI20.** Go to **Checkout** (`/checkout`). Select customer **Meena**, purchase type **Booking a consultation**. Enter `GURU_RAVI20` and click **Apply Coupon** → should succeed and show the discounted amount. Click **Confirm Booking**.

4. **Meena tries GURU_RAVI20 on a product.** Still on Checkout, switch to customer **Meena** (this resets the applied coupon) and purchase type **Buying a product**. Enter `GURU_RAVI20` again → should fail with *"This code doesn't apply to products."*

5. **Sanjay buys a product with SITEWIDE25.** Select customer **Sanjay**, purchase type **Buying a product**. Enter `SITEWIDE25` → should succeed. Click **Confirm Order**.

6. **Meena tries stacking both coupons.** Select customer **Meena**, any purchase type. Apply `SITEWIDE25` first (succeeds), then — without removing it — try applying `GURU_RAVI20` too → should fail with the stacking error (*"A coupon is already applied to this order..."*). Click **Remove coupon** to clear it if you want to keep testing.

7. **Check Admin Dashboard** (`/admin-dashboard`). You should see `SITEWIDE25`'s usage (Sanjay's purchase, and Meena's if confirmed), with total uses and total discount given. Filter by campaign ID to isolate it.

8. **Check Guru Ravi's Dashboard** (`/guru-dashboard`, with Guru Ravi selected). You should see only `GURU_RAVI20`'s usage (Meena's consultation booking) — **not** any `SITEWIDE25` data.

9. **Check the Global Debug View** (`/debug`). You should see every usage record from both sources in one combined table, with a badge distinguishing `company` vs `guru` source types, and the correct campaign ID or guru name in the "Campaign / Guru" column.

There's a **Reset all data** button on the Debug View if you want to start the demo over from a clean state.

## Validation rules (checked in this order)

Implemented once in `validateCoupon()` in `src/utils/couponValidation.js`:

1. Is another coupon already applied to this order? (no stacking)
2. Does the code exist?
3. Is it within its `validFrom`/`validTo` window?
4. Has it hit its total `maxUses`?
5. Has this customer already used it `maxUsesPerCustomer` times?
6. Does `applicableOn` match the current purchase type?
7. Does the order value meet `minOrderValue`?

If all checks pass, the discount and final payable amount are returned. The
coupon's `sourceType` (`company` or `guru`) and its `campaignId`/`guruId` are
only used afterward, when the confirmed order writes a `CouponUsage` record —
the validation logic itself never branches on source type.
