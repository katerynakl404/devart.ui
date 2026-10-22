'use client';

import { ChevronUp } from 'lucide-react';
import { Children, isValidElement, type ReactElement, type ReactNode, useState } from 'react';
import { cn, focusRing } from '../../lib/utils';
import { Button } from '../Button';

type AlertVariant = 'success' | 'info' | 'warning' | 'error' | 'neutral';

/* the edge of a notice behind the first is drawn in that notice's own colours — the same
   --alert-bg-* / --alert-border-* surfaces `Alert`'s recipe paints with */
const EDGE: Record<AlertVariant, string> = {
  success: 'border-alert-border-success bg-alert-bg-success',
  info: 'border-alert-border-info bg-alert-bg-info',
  warning: 'border-alert-border-warning bg-alert-bg-warning',
  error: 'border-alert-border-error bg-alert-bg-error',
  neutral: 'border-stroke bg-surface-card2',
};

export interface AlertStackProps {
  /** The notices — `Alert`s, or anything that renders one and passes its `variant`. */
  children: ReactNode;
  /** @default (n) => `Show ${n} more notice(s)` */
  moreLabel?: (count: number) => string;
  /** @default 'Show Less' */
  lessLabel?: string;
  defaultOpen?: boolean;
  className?: string;
}

function variantOf(el: ReactNode): AlertVariant {
  const v = isValidElement(el) ? (el as ReactElement<{ variant?: AlertVariant }>).props.variant : undefined;
  return v && v in EDGE ? v : 'neutral';
}

/**
 * Several notices as one group. Folded, it is a deck: the first notice on top, the
 * next two lying behind it — each 8px lower and 12px narrower a side, so only their
 * bottom edges show, in their own colours. The page keeps one notice's height until
 * the person asks for the rest: the edges spread on hover, and a press opens the
 * pile; "Show Less" closes it. One notice is just that notice.
 *
 * The edges are the control — no extra "show more" button. The first edge takes the
 * focus and names what it opens.
 */
const AlertStack = ({
  children,
  moreLabel = (n) => `Show ${n} more ${n === 1 ? 'notice' : 'notices'}`,
  lessLabel = 'Show Less',
  defaultOpen = false,
  className,
}: AlertStackProps) => {
  const list = Children.toArray(children).filter(Boolean);
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState(false);
  if (list.length < 2) return <>{list[0] ?? null}</>;

  if (open)
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {list}
        <div className="flex">
          <Button
            variant="tertiary"
            size="xs"
            type="button"
            className="-my-1"
            aria-expanded
            rightSlot={<ChevronUp className="size-3.5" aria-hidden="true" />}
            onClick={() => setOpen(false)}
          >
            {lessLabel}
          </Button>
        </div>
      </div>
    );

  const edges = list.slice(1, 3);
  return (
    <div className={cn('relative isolate', edges.length === 2 ? 'pb-4' : 'pb-2', className)}>
      <div className="relative z-[2]">{list[0]}</div>
      {edges.map((el, i) => (
        <button
          // biome-ignore lint/suspicious/noArrayIndexKey: the deck's edges are positional
          key={i}
          type="button"
          aria-expanded={i ? undefined : false}
          aria-label={i ? undefined : moreLabel(list.length - 1)}
          aria-hidden={i ? true : undefined}
          tabIndex={i ? -1 : undefined}
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={cn(
            'absolute cursor-pointer rounded-lg border p-0 transition-transform duration-150 motion-reduce:transition-none',
            focusRing,
            EDGE[variantOf(el)],
            i === 0
              ? cn('inset-x-3 top-2 z-[1]', edges.length === 2 ? 'bottom-2' : 'bottom-0', hover && 'translate-y-1')
              : cn('inset-x-6 top-4 bottom-0 z-0', hover && 'translate-y-2')
          )}
        />
      ))}
    </div>
  );
};

export { AlertStack };
