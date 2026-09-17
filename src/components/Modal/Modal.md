A Radix dialog. It portals to `document.body`, so a scoped `.dark` on a subtree
does **not** reach it — put `dark` on `<html>` for a page-level theme.

## Size the dialog by what it holds

`<ModalContent size="sm | md | lg">` — never one width for everything.

| Size | Width | For |
|---|---|---|
| `sm` | 360px | a confirm the user only reads and answers |
| `md` | 480px (default) | anything the user fills in |
| `lg` | 576px | a multi-step wizard |

A rename dialog is `md`, not `sm` — the user types into it, so it is a form.

## Footer

Buttons are `size="sm"`, right-aligned, with Cancel `secondary` first and the
confirming action last (`primary`, or `destructive` for a destructive flow).

```jsx
<Modal>
  <ModalTrigger asChild><Button variant="destructiveTertiary">Delete</Button></ModalTrigger>
  <ModalContent size="sm">
    <ModalHeader>
      <ModalTitle>Delete connection?</ModalTitle>
      <ModalDescription>This removes the connection and its sync history.</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild><Button size="sm" variant="secondary">Cancel</Button></ModalClose>
      <Button size="sm" variant="destructive">Delete</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

`ModalBody` is the scrolling region for long content — it already carries
`min-h-0 flex-1`, so the header and footer stay pinned while the middle scrolls.

## The overlay contract

`ModalOverlay` stamps a bare `data-modal-overlay`. Consumers answer *"is any
dialog open?"* with `[data-modal-overlay][data-state="open"]` rather than
reading a store — `Sheet` stamps the same attribute. Nothing in the package
styles it; removing it changes consumer behaviour with nothing failing.
