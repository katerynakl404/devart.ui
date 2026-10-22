import { Content, Portal } from '@radix-ui/react-popover';
import { type ComponentProps, useMemo } from 'react';
import { composeEventHandlers } from '../../lib/compose-event-handlers';
import { composeRefs } from '../../lib/compose-refs';
import { usePortalContainer } from '../../lib/portal-container';
import { cn } from '../../lib/utils';
import { type PopoverSide, usePopoverContext } from './context';
import { usePlacementSide } from './use-placement-side';

interface PopoverContentProps extends ComponentProps<typeof Content> {
  /**
   * Sides to try, in order, when `side` does not fit the viewport; measured
   * once per open from the trigger and the content's own size. Radix alone
   * only flips to the opposite side.
   */
  fallbackSides?: readonly PopoverSide[];
  /** Render the popover into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
}

/**
 * The popover container that holds the popover content, handling animations and positioning.
 */
const PopoverContent = ({
  portalContainer,
  className,
  align = 'center',
  side,
  sideOffset = 4,
  collisionPadding,
  fallbackSides,
  onPointerEnter,
  onPointerLeave,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onFocusOutside,
  ref,
  ...props
}: PopoverContentProps) => {
  const container = usePortalContainer(portalContainer);
  const context = usePopoverContext('PopoverContent');
  const placement = usePlacementSide({
    side,
    fallbackSides,
    sideOffset,
    collisionPadding,
    contentRef: context.contentRef,
    triggerRef: context.triggerRef,
  });

  const contentRef = useMemo(
    () => composeRefs(ref, placement.onContentNode),
    [ref, placement.onContentNode]
  );

  return (
    <Portal container={container}>
      <Content
        ref={contentRef}
        align={align}
        side={placement.side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        onPointerEnter={composeEventHandlers(
          onPointerEnter,
          context.onContentPointerEnter
        )}
        onPointerLeave={composeEventHandlers(
          onPointerLeave,
          context.onContentPointerLeave
        )}
        onOpenAutoFocus={composeEventHandlers(
          onOpenAutoFocus,
          context.onOpenAutoFocus
        )}
        onCloseAutoFocus={composeEventHandlers(
          onCloseAutoFocus,
          context.onCloseAutoFocus
        )}
        onFocusOutside={composeEventHandlers(
          onFocusOutside,
          context.onFocusOutside
        )}
        className={cn(
          'z-50 w-72 rounded-md border p-4 outline-none',
          // Surface/Card, like every other floating panel in the system.
          // It was Surface/Page: the colour the page itself is painted, so a
          // popover opened over a page had no edge of its own — only the
          // hairline border separated it from what it floated above, and on
          // a card it read as a hole. `DropdownMenu` has always used Card;
          // two overlays of the same family wearing different surfaces was
          // the defect, not the shade.
          'border-stroke bg-surface-card text-ink-primary',
          // Floating-surface elevation — theme-aware, unlike the stock shadows,
          // which are invisible against a dark card.
          'shadow-overlay-soft',

          // Closed state.
          //
          // `fill-mode-forwards` is load-bearing, not polish. Radix keeps the
          // panel mounted until the exit animation reports back, and the
          // `exit` keyframe carries only a `to` frame: with the default
          // `fill-mode: none` the panel snaps BACK to full opacity the instant
          // the 150ms run ends and sits there, fully painted, until the
          // unmount lands. Open a second popover in that window and two panels
          // are on screen at once — one of them belonging to a row you have
          // already left. `forwards` holds the faded-out end frame instead.
          'data-[state=closed]:animate-out',
          'data-[state=closed]:fill-mode-forwards',
          'data-[state=closed]:fade-out-0',
          'data-[state=closed]:zoom-out-95',

          // Opened state
          'data-[state=open]:animate-in',
          'data-[state=open]:fade-in-0',
          'data-[state=open]:zoom-in-95',

          // Side based animations
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',

          'origin-[--radix-popover-content-transform-origin]',
          className
        )}
        {...props}
      />
    </Portal>
  );
};

PopoverContent.displayName = Content.displayName;

export { PopoverContent };
export type { PopoverContentProps };
