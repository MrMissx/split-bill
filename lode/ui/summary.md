# UI

Routes: `src/routes/+layout.svelte` (Toaster, Header, Footer, SEO head) and `src/routes/+page.svelte` (editor left, receipt right; stacks on mobile).

Components:
- `lib/components/Receipt`: live receipt, totals, per-payer table, title input.
- `lib/components/SaveToClipboard`: "Copy Bill" button.
- `lib/components/ui/*`: shadcn-style primitives (button, input, label, form parts, sonner).
- `lib/layouts/Header`, `lib/layouts/Footer`.

Page-local state: `discount` and `services` are `$state` in +page.svelte, passed as props to Receipt. Receipt title is local `$state`.

```mermaid
graph TD
  Layout["+layout.svelte"] --> Header
  Layout --> Page["+page.svelte"]
  Layout --> Footer
  Page --> Editor["payer/item editor"]
  Page --> Receipt
  Receipt --> SaveToClipboard
```

Related: [receipt-export.md](receipt-export.md), [../billing/summary.md](../billing/summary.md), [../practices.md](../practices.md).
