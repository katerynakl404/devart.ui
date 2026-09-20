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
  sideOffset = 8,
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
          'z-50',
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
          // 8x4, not Radix's default 10x5. The arrow is drawn INTO the
          // `sideOffset` gap rather than beside it, so the distance a reader
          // actually sees is `sideOffset - arrowHeight`. With the stock 5px
          // arrow that came to 8 - 5 = 3px — and neither 5 nor 3 sits on the
          // 4px scale. At 4px high the tip lands exactly 4px from the trigger,
          // so all three numbers are on the grid.
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
