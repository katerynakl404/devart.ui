'use client';

import {
  type AnimationEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { ProgressBar } from '../ProgressBar';
import { Typography } from '../Typography';
import { useActivityTray } from './ActivityTrayContext';
import type { ActivityTrayItemProps } from './ActivityTrayItem.types';

const activityTrayItemVariants = cva('relative flex gap-2.5 rounded-md p-2', {
  variants: {
    interactive: {
      true: cn(
        'cursor-pointer',
        'transition-colors duration-fast',
        'hover:bg-state-hover',
        'active:bg-state-pressed'
      ),
      false: '',
    },
    layout: {
      single: 'items-center',
      multiline: 'items-start',
    },
    leaving: {
      true: cn(
        'pointer-events-none animate-row-out overflow-hidden',
        'motion-reduce:[animation-duration:1ms]'
      ),
      false: null,
    },
  },
  defaultVariants: {
    interactive: false,
    layout: 'single',
    leaving: false,
  },
});

const activityTrayItemIconVariants = cva(
  'flex size-4 shrink-0 items-center justify-center text-ink-secondary [&_svg]:size-4',
  {
    variants: {
      layout: {
        single: null,
        multiline: 'mt-0.5',
      },
    },
    defaultVariants: {
      layout: 'single',
    },
  }
);

const activityTrayItemRightSlotVariants = cva(
  'relative flex shrink-0 items-center gap-1 text-ink-secondary text-xs tabular-nums',
  {
    variants: {
      error: {
        true: '-mr-1',
        false: null,
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

const activityTrayItemTrailingIconVariants = cva(
  'relative flex shrink-0 items-center [&_svg]:size-4',
  {
    variants: {
      layout: {
        single: null,
        multiline: 'mt-0.5 self-start',
      },
    },
    defaultVariants: {
      layout: 'single',
    },
  }
);

const ActivityTrayItem = ({
  title,
  icon,
  errorText,
  description,
  descriptionClassName,
  rightSlot,
  trailingIcon,
  dismissible = false,
  className,
  ref,
  hasProgress = false,
  progress,
  progressLabel,
  onActivate,
  onAnimationEnd,
  ...props
}: ActivityTrayItemProps) => {
  const itemRef = useRef<HTMLLIElement | null>(null);
  const unregisterRef = useRef<(() => void) | null>(null);

  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  const { autoDismiss, autoDismissDelay, registerItem } = useActivityTray();

  const layout =
    hasProgress || Boolean(description) || Boolean(errorText)
      ? 'multiline'
      : 'single';
  const shouldAutoDismiss = autoDismiss && dismissible;

  const setItemRef = useCallback(
    (node: HTMLLIElement | null) => {
      itemRef.current = node;

      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const handleAnimationEnd = (event: AnimationEvent<HTMLLIElement>) => {
    onAnimationEnd?.(event);

    if (!leaving || event.target !== event.currentTarget) return;

    setGone(true);
    unregisterRef.current?.();
    unregisterRef.current = null;
  };

  useEffect(() => {
    unregisterRef.current = registerItem();

    return () => {
      unregisterRef.current?.();
      unregisterRef.current = null;
    };
  }, [registerItem]);

  useEffect(() => {
    if (!shouldAutoDismiss) return;

    const timeout = setTimeout(() => {
      const item = itemRef.current;

      if (item?.checkVisibility?.() === false) {
        setGone(true);
        unregisterRef.current?.();
        unregisterRef.current = null;

        return;
      }

      if (item) {
        item.style.setProperty('--row-height', `${item.offsetHeight}px`);
      }
      setLeaving(true);
    }, autoDismissDelay);

    return () => clearTimeout(timeout);
  }, [shouldAutoDismiss, autoDismissDelay]);

  if (gone) return null;

  return (
    <li
      data-slot="activity-tray-item"
      data-leaving={leaving ? '' : undefined}
      ref={setItemRef}
      className={cn(
        activityTrayItemVariants({
          interactive: Boolean(onActivate) && !leaving,
          layout,
          leaving,
        }),
        className
      )}
      onAnimationEnd={handleAnimationEnd}
      {...props}
    >
      {icon && (
        <span
          data-slot="activity-tray-item-icon"
          className={activityTrayItemIconVariants({ layout })}
        >
          {icon}
        </span>
      )}

      <div
        data-slot="activity-tray-item-body"
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        {onActivate ? (
          <Typography
            element="button"
            type="button"
            data-slot="activity-tray-item-title"
            variant="span"
            weight="normal"
            textColor="body"
            className={cn(
              'truncate',
              'cursor-pointer border-none bg-transparent p-0',
              'after:absolute after:inset-0',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset'
            )}
            onClick={onActivate}
          >
            {title}
          </Typography>
        ) : (
          <Typography
            data-slot="activity-tray-item-title"
            variant="span"
            weight="normal"
            textColor="body"
            className="truncate"
          >
            {title}
          </Typography>
        )}

        {hasProgress && (
          <ProgressBar
            aria-label={
              progressLabel ?? (typeof title === 'string' ? title : undefined)
            }
            className="w-full"
            size="md"
            value={progress}
          />
        )}

        {errorText && (
          <Typography
            data-slot="activity-tray-item-error-text"
            variant="span"
            weight="normal"
            textColor="destructive"
            // `text-balance` — the kit's `.upl-item-err{text-wrap:balance}`.
            className="text-balance text-xs"
          >
            {errorText}
          </Typography>
        )}

        {!errorText && description && (
          <Typography
            data-slot="activity-tray-item-description"
            variant="span"
            weight="normal"
            textColor="secondary"
            className={cn('text-balance text-xs', descriptionClassName)}
          >
            {description}
          </Typography>
        )}
      </div>

      {rightSlot && (
        <span
          data-slot="activity-tray-item-right"
          className={activityTrayItemRightSlotVariants({
            error: Boolean(errorText),
          })}
        >
          {rightSlot}
        </span>
      )}

      {trailingIcon && (
        <span
          data-slot="activity-tray-item-trailing-icon"
          className={activityTrayItemTrailingIconVariants({ layout })}
        >
          {trailingIcon}
        </span>
      )}
    </li>
  );
};

ActivityTrayItem.displayName = 'ActivityTrayItem';

export {
  ActivityTrayItem,
  activityTrayItemIconVariants,
  activityTrayItemRightSlotVariants,
  activityTrayItemTrailingIconVariants,
  activityTrayItemVariants,
};
export type { ActivityTrayItemProps } from './ActivityTrayItem.types';
