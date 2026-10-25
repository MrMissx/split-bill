# Billing Domain

Owns payers, items, and all money math. Pure client state, no server.

```mermaid
graph TD
  Payers["payers[]"] --> P1["Payer: name, bills[]"]
  P1 --> I1["Item: product, price"]
  Payers --> Calc["derived totals"]
  Calc --> Subtotal
  Calc --> Share
  Share --> Fee
  Share --> Disc
```

Files:
- [state-store.md](state-store.md) - store shape and mutations
- [split-calculation.md](split-calculation.md) - `calculateTotals`: allocation, clamping, invariants

Related: [../terminology.md](../terminology.md), [../ui/summary.md](../ui/summary.md).
