import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { TableCell } from './TableCell';

interface TableActionsCellProps extends ComponentProps<'td'> {
  /**
   * Fade the actions in on row hover / keyboard focus instead of showing them
   * at rest. The column keeps its width either way, so nothing reflows when
   * they appear. Set `false` for actions that must always be visible.
   */
  reveal?: boolean;
}

/**
 * The trailing column of row actions — a kebab, or one or two icon buttons.
 *
 * Three things make an actions column behave, and all three are easy to miss
 * when it is hand-rolled out of a plain `TableCell`:
 *
 * - **It is a fixed 48px and right-aligned.** A content-sized actions column is
 *   why table columns appear to jump: the widest row decides the width, so it
 *   changes with the data.
 * - **The width is reserved whether or not the buttons are showing.** Revealing
 *   a kebab by mounting it on hover reflows the whole table under the pointer;
 *   this fades opacity instead, so the layout never moves.
 * - **It stacks above its neighbours while a menu is open**, so a dropdown is
 *   not painted under the next row.
 *
 * Size the buttons `2xs` — a 24px box around a 14px glyph is the row-action
 * step, one below the shared Button/IconButton ladder.
 *
 * ```jsx
 * <TableActionsCell>
 *   <IconButton aria-label="Row actions" size="2xs" variant="tertiary">
 *     <MoreHorizontal />
 *   </IconButton>
 * </TableActionsCell>
 * ```
 */
function TableActionsCell({
  className,
  reveal = true,
  ...props
}: TableActionsCellProps) {
  return (
    <TableCell
      data-slot="table-actions-cell"
      className={cn(
        // TableCell clips its overflow to truncate text; an actions cell holds
        // controls, and a menu anchored here must not be cut off.
        'relative w-12 overflow-visible pe-2 text-right',
        // An open menu must out-stack the rows below it, and the trigger has to
        // stay visible while its menu is open even once the pointer has left.
        'has-[[aria-expanded=true]]:z-30',

        // An action only ever appears over a *hovered* row, so its own hover
        // has to clear the fill the row is already painting. At rest the two
        // are one step apart; on a hovered row they are not. Measured against
        // the live tokens, a neutral tertiary hovering inside a hovered row is
        // a 1.83 dL* step on light — and exactly 0.00 on dark, where
        // `--tbl-row-hover` and `--state-hover` are the same value, so the
        // hover is invisible. Lifting it one rung restores 3.33 / 3.60.
        'group-hover/row:[&>[data-variant=tertiary]:hover]:bg-state-pressed',
        'group-hover/row:[&>[data-variant=destructiveTertiary]:hover]:bg-destructiveTertiary-bg-press',
        reveal &&
          cn(
            '[&>*]:opacity-0 [&>*]:transition-opacity [&>*]:duration-fast',
            'group-hover/row:[&>*]:opacity-100',
            'group-focus-within/row:[&>*]:opacity-100',
            '[&>[aria-expanded=true]]:opacity-100'
          ),
        className
      )}
      {...props}
    />
  );
}

export { TableActionsCell, type TableActionsCellProps };
