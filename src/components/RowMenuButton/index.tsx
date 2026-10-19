'use client';

import { EllipsisVertical } from 'lucide-react';
import type { ReactNode } from 'react';
import { isButtonKey } from '../../lib/button-keyboard';
import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { IconButton, type IconButtonProps } from '../IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

export interface RowMenuButtonProps
  extends Omit<
    IconButtonProps,
    | 'aria-label'
    | 'asChild'
    | 'children'
    | 'isLoading'
    | 'rounded'
    | 'size'
    | 'variant'
  > {
  /** The menu — `DropdownMenuItem`s, separators, a label. */
  children: ReactNode;
  /**
   * Name the action, not the row. In a list of many, add the row's own name
   * ("More actions for Q1 revenue") so a screen reader can tell them apart.
   * @default 'More actions'
   */
  'aria-label'?: string;
  /**
   * Fade the trigger in on row hover, on keyboard focus anywhere in the row and
   * while its menu is open, instead of showing it at rest. Below `md` and on a
   * device with no hover it shows at rest either way. Set `false` where nothing
   * else reveals it.
   * @default true
   */
  reveal?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default true */
  modal?: boolean;
}

/**
 * The ⋮ at the end of a list row, and the menu it opens.
 *
 * The look is not new — it is the row-action `IconButton` (`tertiary`, `2xs`).
 * What this adds is the behaviour every row with a menu needs and each one used
 * to hand-roll:
 *
 * - **The reveal hangs off `group/row`**, the hook `Card variant="row"` and
 *   `TableRow` already stamp. Opacity only, never mounting: the trigger keeps
 *   its box at rest, so nothing in the row moves when it appears.
 * - **Its clicks stay its own.** The trigger sits inside a clickable row, and
 *   the menu is portalled out of the row in the DOM but not in React — so its
 *   clicks and keys bubble through the row's handlers unless they stop here.
 * - **An item that moves focus keeps it** (see `keepFocusWhereItMoved`).
 * - **It says what it is on hover** — a tooltip with its `aria-label`, the same
 *   as the sidebar chat row's ⋮ (`SidebarChatItem` `menuLabel`), so the two row
 *   menus in a product read alike. Needs a `TooltipProvider` above, as every
 *   Tooltip does.
 */
function RowMenuButton({
  children,
  'aria-label': ariaLabel = 'More actions',
  reveal = true,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  className,
  onClick,
  onKeyDown,
  ref,
  ...props
}: RowMenuButtonProps) {
  return (
    <DropdownMenu
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      {/* The tooltip writes its own `data-state` onto the button; nothing reads
          the menu's, because the open paint keys on `aria-expanded`. */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <IconButton
              {...props}
              ref={ref}
              aria-label={ariaLabel}
              data-slot="row-menu-button"
              variant="tertiary"
              size="2xs"
              className={cn(
                'shrink-0',
                // No transition here: the IconButton recipe's `transition-all`
                // already carries opacity, and naming one would replace it.
                reveal &&
                  cn(
                    'opacity-0',
                    'group-hover/row:opacity-100',
                    'group-focus-within/row:opacity-100',
                    'focus-visible:opacity-100',
                    // `aria-expanded`, not `data-state`: a tooltip around the
                    // trigger overwrites `data-state` (SPEC decision 6).
                    'aria-expanded:opacity-100',
                    // Nothing to hover with: a phone-width screen and a touch
                    // device show it at rest, or the menu is unreachable.
                    'max-md:opacity-100 [@media(hover:none)]:opacity-100'
                  ),
                className
              )}
              onClick={(event) => {
                event.stopPropagation();
                onClick?.(event);
              }}
              onKeyDown={(event) => {
                // Enter and Space open the menu; they must not also open the row.
                if (isButtonKey(event.key)) event.stopPropagation();
                onKeyDown?.(event);
              }}
            >
              <EllipsisVertical />
            </IconButton>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{ariaLabel}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        onCloseAutoFocus={keepFocusWhereItMoved}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Radix hands focus back to the trigger once the menu has finished animating
 * out — long after the chosen item's own handler ran. When that handler moved
 * focus on purpose (Rename opening a field in the row), the hand-back pulls the
 * caret out of the field it just opened, and a field that commits on blur
 * closes again at once.
 *
 * So the hand-back runs only when focus went nowhere: the menu took it with
 * it, and `document.body` is what is left. `DropdownMenuContent` then applies
 * its own keyboard-only rule on top.
 */
function keepFocusWhereItMoved(event: Event) {
  const active = document.activeElement;
  if (active && active !== document.body) event.preventDefault();
}

RowMenuButton.displayName = 'RowMenuButton';

export { RowMenuButton };
