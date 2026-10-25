# Roadmap

## Known issues
- Store is in-memory only. Refresh loses all data.
- Per-person share divides by subtotal. Subtotal 0 gives NaN internally (see [../billing/split-calculation.md](../billing/split-calculation.md)).
- Store export is named `biling` (typo).
- `navigator.clipboard.write` not awaited. Success toast shows even on failure.

## Open
- None recorded yet. Add when user decides.
