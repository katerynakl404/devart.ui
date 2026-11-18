import { Content, Portal } from '@radix-ui/react-dropdown-menu';
import { type ComponentProps, useContext, useRef } from 'react';
import { composeEventHandlers } from '../../lib/compose-event-handlers';
import { cva } from '../../lib/cva';
import { restoreFocus } from '../../lib/focus-modality';
import { usePortalContainer } from '../../lib/portal-container';
import { cn } from '../../lib/utils';
import { DropdownMenuContext } from './context';

const dropdownMenuContentVariants = cva(
  cn(
    'z-50 rounded-lg border p-1',
    'max-h-[var(--radix-dropdown-menu-content-available-height)]',
    // Fluid width — menu hugs its longest item label within bounds.
    'w-max min-w-[140px] max-w-[320px]',
    'border-stroke bg-surface-card text-ink-body',
    // Floating-surface elevation — the one shadow role that is redeclared
    // for dark; `shadow-dropdown` is light-only and all but vanishes there.
    'shadow-overlay-soft',
    'overflow-y-auto overflow-x-hidden',
    // The kit's own menu scrollbar — `.cl-menu-scroll`.
    'scrollbar-thin',

    // Performance optimizations to reduce forced reflows
    'will-change-[transform,opacity]',
    '[transform:translateZ(0)]',
    '[backface-visibility:hidden]',

    //Closed state
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=closed]:zoom-out-95',

    //Opened state
    'data-[state=open]:animate-in',
    'data-[state=open]:fade-in-0',
    'data-[state=open]:zoom-in-95',

    //Side based animations
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',

    'origin-[--radix-dropdown-menu-content-transform-origin]'
  )
);

type InteractOutsideEvent = Parameters<
  NonNullable<ComponentProps<typeof Content>['onInteractOutside']>
>[0];

/** Right-click, or Ctrl+click — the macOS right-click. */
const isContextMenuClick = (event: Event) =>
  event instanceof MouseEvent &&
  (event.button === 2 || (event.button === 0 && event.ctrlKey));

/**
 * The popover container that holds all dropdown items, handling animations and positioning.
 */
export interface DropdownMenuContentProps
  extends ComponentProps<typeof Content> {
  /** Render the menu into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
}

const DropdownMenuContent = ({
  portalContainer,
  className,
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  ref,
  onCloseAutoFocus,
  onInteractOutside,
  ...props
}: DropdownMenuContentProps) => {
  const container = usePortalContainer(portalContainer);
  const context = useContext(DropdownMenuContext);
  const skipFocusRestoreRef = useRef(false);

  // Radix's rule: after any outside interaction with a non-modal menu, or a
  // right-click outside, focus stays where the user put it.
  const handleInteractOutside = (event: InteractOutsideEvent) => {
    if (!context) return;

    const isContextMenu = isContextMenuClick(event.detail.originalEvent);
    if (!context.modal || isContextMenu) skipFocusRestoreRef.current = true;
  };

  // Radix refocuses the trigger with a plain `focus()`, and browsers' own
  // `:focus-visible` rules then often show the ring after a mouse pick. The
  // ring is decided from the last interaction instead, and Radix's
  // outside-interaction rule is kept.
  const handleCloseAutoFocus = (event: Event) => {
    // Not composed through the helper on purpose: the flag is read and reset
    // before the consumer's handler runs, so one that prevents the event
    // cannot leave it stale.
    const skipFocusRestore = skipFocusRestoreRef.current;
    skipFocusRestoreRef.current = false;

    onCloseAutoFocus?.(event);
    const trigger = context?.triggerRef.current;
    if (event.defaultPrevented || !trigger) return;

    event.preventDefault();
    if (!skipFocusRestore && document.activeElement === document.body) {
      restoreFocus(trigger);
    }
  };

  return (
    <Portal container={container}>
      <Content
        ref={ref}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        onCloseAutoFocus={handleCloseAutoFocus}
        onInteractOutside={composeEventHandlers(
          onInteractOutside,
          handleInteractOutside
        )}
        className={cn(dropdownMenuContentVariants(), className)}
        {...props}
      />
    </Portal>
  );
};

DropdownMenuContent.displayName = Content.displayName;

export { DropdownMenuContent, dropdownMenuContentVariants };
