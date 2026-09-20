import { Content, Portal } from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';
import { usePortalContainer } from '../../lib/portal-container';
import { cn } from '../../lib/utils';

/**
 * The popover container that holds the popover content, handling animations and positioning.
 */
export interface PopoverContentProps extends ComponentProps<typeof Content> {
  /** Render the popover into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
}

const PopoverContent = ({
  portalContainer,
  className,
  align = 'center',
  sideOffset = 4,
  ref,
  ...props
}: PopoverContentProps) => {
  const container = usePortalContainer(portalContainer);
  return (
    <Portal container={container}>
      <Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 rounded-md border p-4 outline-none',
          'border-stroke bg-surface-page text-ink-primary',
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
