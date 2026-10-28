'use client';

import { Description } from '@radix-ui/react-dialog';
import type { ComponentPropsWithRef } from 'react';

import { Typography } from '../Typography';

interface ModalDescriptionProps
  extends ComponentPropsWithRef<typeof Typography> {}

/**
 * The sentence under a dialog's title: what the dialog is for ("Link
 * connections to Finance"), or what answering it does. (2026-10-27)
 *
 * `Modal.md` documented it and the package never had it, so every dialog
 * with a line under its title wrapped `ModalTitle` and a `Typography` in a
 * div of its own inside `ModalHeader` — a second gap beside the header's,
 * and a sentence no screen reader tied to the dialog. On Radix
 * `Dialog.Description`: the dialog's `aria-describedby` points at it while it
 * is mounted, and at nothing when it is not.
 *
 * `body14` in `--ink-secondary`, under the `heading20` title. It goes inside
 * `ModalHeader`, after `ModalTitle`, and takes the header's own gap (6px) —
 * no wrapper. A shorter or iconed line passes its own `textStyle` or
 * children.
 */
export function ModalDescription({
  className,
  ref,
  ...props
}: ModalDescriptionProps) {
  return (
    <Description asChild>
      <Typography
        ref={ref}
        data-slot="modal-description"
        element="p"
        textStyle="body14"
        textColor="secondary"
        className={className}
        {...props}
      />
    </Description>
  );
}

ModalDescription.displayName = 'ModalDescription';
