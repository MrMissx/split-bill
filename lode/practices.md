# Practices

- Svelte 5 runes (`$state`, `$derived`, `$props`) in components. Store reads still use `$store` syntax in pages and Receipt.
- Mutate billing state through `biling` methods. Exception: `bind:value={$biling[i]...}` writes straight into the store.
- Styling: Tailwind utility classes. Merge classes with `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).
- UI primitives in `src/lib/components/ui/` (shadcn-svelte style). Import via aliases `@component/ui/...`, `$lib/...`, `@layouts/...`.
- Each component folder has `Component.svelte` + `index.ts` barrel. Follow that for new components.
- Icons: `~icons/mdi/<name>` via unplugin-icons.
- Money math: always `?? 0` on nullable prices and fees. Format only via `IdrFormat`.
- All totals come from `calculateTotals` in `src/lib/billing/calculate.ts`. Never re-derive a total inside a component.
- Checks: `npm run format`, `npm run lint` (prettier + eslint, see `.svelte` caveat in [plans/roadmap.md](plans/roadmap.md)), `npm run check` (svelte-check), `npm run test` (node --test).
- Tests: plain `node --test test/*.test.ts`. Node 22+ strips types natively, so a pure module in `src/lib` is testable with zero extra deps. Only pure modules qualify — `$lib/*` aliases resolve through `.svelte-kit/tsconfig.json`, which node ignores.
- Lockfile: `bun.lockb` present. Use the package manager already in use.

## Invariants
- Store always holds an array of payers. A payer always has at least one item (UI disables delete when `bills.length === 1`).
- Discount is always >= 0 in the store/input and subtracted once in `calculateTotals`; the receipt renders it as `-discount`. It is clamped to the subtotal.
- Per-person totals always sum to grand total. See [billing/split-calculation.md](billing/split-calculation.md).

## Lessons
- Rounding must be allocated, not computed per person. See [billing/split-calculation.md](billing/split-calculation.md).
- `navigator.clipboard.write` is not awaited in SaveToClipboard. Failures are silent.

Related: [summary.md](summary.md), [ui/receipt-export.md](ui/receipt-export.md).
