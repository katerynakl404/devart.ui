'use client';

import type { ComponentProps } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { useInputGroup } from './InputGroupContext';

const inputGroupActionVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center',
    // The edge inset belongs to the field — `InputGroup` swaps its `px-3`
    // for `pe-2` when this is present — so the action adds no margin of its
    // own. Two insets on one edge is how the glyph ends up further from the
    // border than the one opposite it.
    'p-0',
    'rounded-sm border-none bg-transparent',
    'cursor-pointer',
    // No surface: it answers the pointer with colour only, on the pair the
    // system keeps for a glyph without a box (the kit's `.igrp-act`).
    'text-ink-icon transition-colors enabled:hover:text-ink-icon-hover',
    '[&>svg]:shrink-0',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
    'disabled:pointer-events-none disabled:text-ink-inactive'
  ),
  {
    variants: {
      // Read from the group, not passed by the caller. A 24px box around the
      // field's 16px glyph; at `xs` the field's glyph is 14px and the box is
      // that glyph — no inner air — so with the field's own 8px trailing
      // inset the ✕ sits 8px in, as the search icon does across from it.
      size: {
        xs: 'size-3.5 [&>svg]:size-3.5',
        sm: 'size-6 [&>svg]:size-4',
        md: 'size-6 [&>svg]:size-4',
        lg: 'size-6 [&>svg]:size-4',
        xl: 'size-6 [&>svg]:size-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Trailing action of a field, such as clear or reveal: a bare button with a
 * 24px hit area around a 16px glyph that reacts by colour only.
 * Place it as a direct child of InputGroup, after the input — not inside an addon.
 *
 * Deliberately **not** an `IconButton`: an icon docked in a field has no
 * surface of its own — the field already owns hover, focus and press, and a
 * second filled box inside it reads as a control on top of a control.
 * `IconButton size="2xs"` is the same 24px box but a 14px glyph and a hover
 * fill. The box follows the group's size (`xs` is the 14px glyph itself).
 */
function InputGroupAction({
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'>) {
  const { size } = useInputGroup();

  return (
    <button
      type={type}
      data-slot="input-group-action"
      className={cn(inputGroupActionVariants({ size }), className)}
      {...props}
    />
  );
}

export { InputGroupAction, inputGroupActionVariants };
