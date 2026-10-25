# Terminology

- Payer - person sharing the bill. `{ name, bills }` in store (`BillingSchema`).
- Item - one purchased line `{ product, price }` (`ItemSchema`). Lives in a payer's `bills` array.
- Bills (field) - a payer's list of items. Not a separate invoice. Prefer "items" in prose.
- Price - item amount in IDR. `null` = unset, treated as 0 in math.
- Subtotal - sum of all item prices across all payers, before fee and discount.
- Service Fee - extra charge added to grand total (`services`), split proportionally.
- Discount - user types a positive number; used as negative (`trueDiscount = -abs(discount)`).
- Grand Total - `subtotal + services + trueDiscount`.
- Share - payer's `subTotal / subtotal`. Ratio used to split fee, discount, grand total.
- Person Total - payer's `grandTotal * share`.
- Receipt - the `#receipt` figure rendered live on the right; also the exported image.
- Copy Bill - button that exports `#receipt` as PNG to clipboard.
- biling - exported store object in `src/lib/store.ts` (typo of "billing", kept; see [billing/state-store.md](billing/state-store.md)).
- IDR / Rp. - Indonesian Rupiah, formatted with `Intl.NumberFormat("en-US", { currency: "IDR" })`.
