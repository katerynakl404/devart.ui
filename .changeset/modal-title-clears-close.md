---
'@devart/ui-react': patch
---

`Modal` — a long title no longer runs under the close button (§185). `ModalHeader` reserves its end
padding while the dialog draws one, and `ModalTitle` breaks a name with no spaces instead of running
out of the dialog. The title is not truncated. `ConfirmationDialog` drops the reserve it carried by
hand; the `break-words` patches in the product kits are no longer needed.
