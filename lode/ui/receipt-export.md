# Receipt Export

`SaveToClipboard` finds `#receipt` in the DOM, renders it with `dom-to-image` `toBlob`, writes a `ClipboardItem` with `image/png`, and shows a sonner toast.

```ts
const node = document.getElementById("receipt")
const blob = await domtoimage.toBlob(node)
navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
toast("Receipt copied to clipboard", {})
```

## Invariants
- Export targets the element with id `receipt`. Renaming that id breaks export.
- Export captures whatever is rendered, so the receipt must stay in the DOM.

## Known gaps
- Clipboard write promise is not awaited. Success toast shows even if the write fails.

```mermaid
sequenceDiagram
  participant U as User
  participant SC as SaveToClipboard
  participant D as DOM
  participant DI as dom-to-image
  participant C as Clipboard
  U->>SC: click Copy Bill
  SC->>D: getElementById("receipt")
  SC->>DI: toBlob(node)
  DI-->>SC: PNG blob
  SC->>C: write image/png
  SC-->>U: toast
```

Related: [summary.md](summary.md), [../plans/roadmap.md](../plans/roadmap.md).
