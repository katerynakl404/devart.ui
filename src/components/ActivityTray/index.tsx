'use client';

import {
  type AnimationEvent,
  type ComponentProps,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Collapsible } from '../Collapsible';
import { ActivityTrayContent } from './ActivityTrayContent';
import { ActivityTrayContext } from './ActivityTrayContext';
import { ActivityTrayHeader } from './ActivityTrayHeader';
import { ActivityTrayItem, activityTrayItemVariants } from './ActivityTrayItem';
import type { ActivityTrayItemProps } from './ActivityTrayItem.types';

const DEFAULT_DISMISS_LABEL = 'Dismiss';
const DEFAULT_AUTO_DISMISS_DELAY = 4000;

/* The kit's `.upl-tray`: 26rem, a 10px radius (the kit's own value, not a step
   on the scale), `--shadow-overlay-soft`, clipped. The kit caps a 100% width
   at 26rem; here 26rem is a WIDTH, because a cap measured against a
   shrink-to-fit dock let the plate narrow as its rows left. `max-w-full` keeps
   it inside a narrower viewport. The header's focus ring is inset because of
   `overflow-hidden` — an outside ring on a full-bleed bar would be clipped. */
const activityTrayVariants = cva(
  cn(
    'w-[26rem] max-w-full',
    'border border-stroke bg-surface-card',
    'rounded-[0.625rem] shadow-overlay-soft',
    'overflow-hidden'
  ),
  {
    variants: {
      leaving: {
        true: cn(
          'pointer-events-none animate-panel-out',
          'motion-reduce:[animation-duration:1ms]'
        ),
        false: null,
      },
    },
    defaultVariants: {
      leaving: false,
    },
  }
);

interface ActivityTrayProps
  extends Omit<ComponentProps<typeof Collapsible>, 'title'> {
  headerTitle: ReactNode;
  headerIcon?: ReactNode;
  children?: ReactNode;
  /** When `false`, header is not a toggle; list stays open. */
  isCollapsible?: boolean;
  /** `aria-label` for the ✕. Defaults to `"Dismiss"`. */
  dismissLabel?: string;
  /** `aria-label` for the collapse trigger; falls back to title text. */
  toggleLabel?: string;
  /** Auto-remove `dismissible` rows; tray leaves after the last one. */
  autoDismiss?: boolean;
  /** Delay before a dismissible row leaves. Defaults to `4000`. */
  autoDismissDelay?: number;
  /** Classes for the scrollable list. */
  contentClassName?: string;
  /** Shows ✕; called on ✕ click or after auto-dismiss leave. */
  onDismiss?: () => void;
}

/**
 * A plate whose header expands into a list of `ActivityTrayItem` rows. It is
 * positioning-neutral (the consumer docks it) and paints no state of its own:
 * every glyph and colour arrives through slots.
 */
const ActivityTray = ({
  headerTitle,
  headerIcon,
  children,
  isCollapsible = true,
  open,
  defaultOpen = true,
  dismissLabel = DEFAULT_DISMISS_LABEL,
  toggleLabel,
  autoDismiss = false,
  autoDismissDelay = DEFAULT_AUTO_DISMISS_DELAY,
  className,
  contentClassName,
  onOpenChange,
  onDismiss,
  onAnimationEnd,
  ...props
}: ActivityTrayProps) => {
  const itemCountRef = useRef(0);
  const latestRef = useRef({ autoDismiss, onDismiss });

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [leaving, setLeaving] = useState(false);

  const isOpen = !isCollapsible || (open ?? uncontrolledOpen);

  const registerItem = useCallback(() => {
    itemCountRef.current += 1;
    let registered = true;

    return () => {
      if (!registered) return;

      registered = false;
      itemCountRef.current -= 1;

      if (itemCountRef.current > 0) return;

      queueMicrotask(() => {
        const latest = latestRef.current;
        if (
          itemCountRef.current === 0 &&
          latest.autoDismiss &&
          latest.onDismiss
        ) {
          setLeaving(true);
        }
      });
    };
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);

    onOpenChange?.(nextOpen);
  };

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    onAnimationEnd?.(event);

    if (leaving && event.target === event.currentTarget) onDismiss?.();
  };

  const contextValue = useMemo(
    () => ({ autoDismiss, autoDismissDelay, registerItem }),
    [autoDismiss, autoDismissDelay, registerItem]
  );

  useLayoutEffect(() => {
    latestRef.current = { autoDismiss, onDismiss };
  }, [autoDismiss, onDismiss]);

  return (
    <Collapsible
      data-slot="activity-tray"
      data-leaving={leaving ? '' : undefined}
      open={isOpen}
      onOpenChange={isCollapsible ? handleOpenChange : undefined}
      className={cn(activityTrayVariants({ leaving }), className)}
      onAnimationEnd={handleAnimationEnd}
      {...props}
    >
      <ActivityTrayContext.Provider value={contextValue}>
        <ActivityTrayHeader
          title={headerTitle}
          icon={headerIcon}
          isCollapsible={isCollapsible}
          dismissLabel={dismissLabel}
          toggleLabel={toggleLabel}
          onDismiss={onDismiss}
        />

        <ActivityTrayContent open={isOpen} contentClassName={contentClassName}>
          {children}
        </ActivityTrayContent>
      </ActivityTrayContext.Provider>
    </Collapsible>
  );
};

ActivityTray.displayName = 'ActivityTray';

export {
  ActivityTray,
  ActivityTrayItem,
  type ActivityTrayItemProps,
  type ActivityTrayProps,
  activityTrayItemVariants,
  activityTrayVariants,
};
