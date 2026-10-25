# Practices

- Svelte 5 runes (`$state`, `$derived`, `$props`) in components. Store reads still use `$store` syntax in pages and Receipt.
- Mutate billing state through `biling` methods. Exception: `bind:value={$biling[i]...}` writes straight into the store.
- Styling: Tailwind utility classes. Merge classes with `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).
- UI primitives in `src/lib/components/ui/` (shadcn-svelte style). Import via aliases `@component/ui/...`, `$lib/...`, `@layouts/...`.
- Each component folder has `Component.svelte` + `index.ts` barrel. Follow that for new components.
- Icons: `~icons/mdi/<name>` via unplugin-icons.
- Money math: always `?? 0` on nullable prices and fees. Format only via `IdrFormat`.
- Checks: `npm run format`, `npm run lint` (prettier + eslint), `npm run check` (svelte-check). Match the surrounding file's style.
- Lockfile: `bun.lockb` present. Use the package manager already in use.

## Invariants
- Store always holds an array of payers. A payer always has at least one item (UI disables delete when `bills.length === 1`).
- Discount is always <= 0 in math regardless of input sign.
- Per-person totals sum to grand total only when subtotal > 0. See [billing/split-calculation.md](billing/split-calculation.md).

## Lessons
- Nested `people.bills` from derived totals did not re-render. Receipt iterates `$biling[id].bills` instead (comment in Receipt).
- `navigator.clipboard.write` is not awaited in SaveToClipboard. Failures are silent.

Related: [summary.md](summary.md), [ui/receipt-export.md](ui/receipt-export.md).
