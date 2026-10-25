# Roadmap

## Known issues
- Store is in-memory only. Refresh loses all data.
- Store export is named `biling` (typo).
- `navigator.clipboard.write` not awaited. Success toast shows even on failure.
- `svelte-check` reports 13 errors from the unused `src/lib/components/ui/form/*` (imports `formsnap` + `sveltekit-superforms`, neither installed). Folder is dead code.
- `npm run lint` fails on `.svelte` files: `prettier-plugin-svelte` 3.5.2 (paired with Prettier 3.9.10) throws `getVisitorKeys is not a function` on every Svelte file. Pre-existing, unrelated to app code.

## Open
- None recorded yet. Add when user decides.
