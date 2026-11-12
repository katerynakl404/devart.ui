import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentPropsWithRef } from 'react';
import { usePortalContainer } from '../../lib/portal-container';
import { cn } from '../../lib/utils';

interface TooltipContentProps
  extends ComponentPropsWithRef<typeof TooltipPrimitive.Content> {
  showArrow?: boolean;
  arrowClassName?: string;
  /** Render the tooltip into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
}

/**
 * The floating panel that contains the tooltip content.
 * Features automated entry/exit animations based on the current side and state.
 */
function TooltipContent({
  className,
  portalContainer,
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
          'z-[110]',
          'px-2 py-1',
          'w-max max-w-72 whitespace-normal text-left',
          'rounded-md bg-ink-primary',
          'text-surface-card text-xs',

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
          <TooltipPrimitive.Arrow
            className={cn(arrowClassName, 'fill-ink-primary')}
            width={8}
            height={4}
          />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { TooltipContent };
