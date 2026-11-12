import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentPropsWithRef } from 'react';
import { usePortalContainer } from '../../lib/portal-container';
import { cn } from '../../lib/utils';

interface TooltipContentProps
  extends ComponentPropsWithRef<typeof TooltipPrimitive.Content> {
  /** Render the tooltip into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
  showArrow?: boolean;
  arrowClassName?: string;
}

/**
 * The floating panel that contains the tooltip content.
 * Features automated entry/exit animations based on the current side and state.
 */
function TooltipContent({
  portalContainer,
  className,
  // The gap to the arrow's tip. Radix adds the arrow's height on top of it, so
  // the bubble sits `sideOffset + 4` away: 4px to the tip, 8px to the bubble.
  sideOffset = 4,
  showArrow = true,
  arrowClassName,
  children,
  ref,
  ...props
}: TooltipContentProps) {
  const container = usePortalContainer(portalContainer);
  return (
    <TooltipPrimitive.Portal container={container}>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          // z-[110]: above Modal (z-100), as Autocomplete's list and Select's
          // are. At z-50 a tooltip on a control inside a dialog opened behind
          // the dialog — only a sliver showed past its edge (§177).
          'z-[110]',
          'px-2 py-1',
          'rounded-md bg-ink-primary',
          'text-surface-card text-xs',

          // The bubble hugs short copy and wraps at 288px — the same width as a
          // medium menu — so a long tip gets two or three lines instead of
          // running off the viewport.
          'w-max max-w-72 whitespace-normal text-left',

          // Animation
          'fade-in-0 zoom-in-95 animate-in',
          'data-[state=closed]:fade-out-0',
          'data-[state=closed]:zoom-out-95',
          'data-[state=closed]:animate-out',

          // Slide based on side
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',

          'origin-[--radix-tooltip-content-transform-origin]',
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          // 8x4, not Radix's default 10x5: every number on the 4px scale. The
          // arrow is drawn BESIDE the `sideOffset` gap, not into it — measured,
          // the old `sideOffset = 8` put the tip 8px and the bubble 12px from
          // the trigger, and a tooltip read as detached. 4 + 4 = tip at 4px,
          // bubble at 8px. DESIGN-SYSTEM-CHANGES §13.
          <TooltipPrimitive.Arrow
            width={8}
            height={4}
            className={cn(arrowClassName, 'fill-ink-primary')}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { TooltipContent };
