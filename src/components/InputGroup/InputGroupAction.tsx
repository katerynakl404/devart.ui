import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

/**
 * The trailing action of a field — a clear ✕, a password toggle, a unit picker.
 *
 * It is a **sub-part of the field**, a sibling of `InputGroupAddon`, and
 * deliberately **not** an `IconButton`. An icon docked in a field has no
 * surface of its own: no background, no border, no hover pill, because the
 * field already owns hover, focus and press, and a second filled box inside
 * that one reads as a control sitting on top of the control. So it answers the
 * pointer the only way something without a box can — with colour, through the
 * `--ink-icon` / `--ink-icon-hover` pair the system keeps for exactly this.
 *
 * Geometry is the field's, not the icon-button ladder's: a 24px box around the
 * field's own 16px glyph, 8px from the right edge. `IconButton size="2xs"` is
 * the same 24px box but a 14px glyph and a hover fill, which is why reaching
 * for it here produced a control one step small and one surface too many.
 */
const InputGroupAction = ({
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'>) => (
  <button
    type={type}
    data-slot="input-group-action"
    className={cn(
      'inline-flex shrink-0 items-center justify-center',
      // A 24px box around the field's 16px glyph. The edge inset belongs to
      // the field — `InputGroup` swaps its `px-3` for `pe-2` when this is
      // present — so the action adds no margin of its own. Two insets on one
      // edge is how the glyph ends up further from the border than the one
      // opposite it.
      'size-6 p-0',
      'rounded-sm border-none bg-transparent',
      'cursor-pointer',
      'text-ink-icon transition-colors enabled:hover:text-ink-icon-hover',
      '[&>svg]:size-4 [&>svg]:shrink-0',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
      'disabled:pointer-events-none disabled:text-ink-inactive',
      className
    )}
    {...props}
  />
);

InputGroupAction.displayName = 'InputGroupAction';

export { InputGroupAction };
