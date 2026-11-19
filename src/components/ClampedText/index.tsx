'use client';

import {
  type KeyboardEvent,
  type MouseEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/utils';
import { LinkButton } from '../LinkButton';
import { Typography, type TypographyProps } from '../Typography';

/* ClampedText — a text cut to a number of lines, with "See more" when there
   is more, and only then.

   Two ways to read the rest:
   - in place: See more opens the text where it stands, See less folds it;
   - handed over (`onMore`): See more asks the caller to show the whole text
     elsewhere — a dialog from a hover panel, where opening in place would
     grow a panel that is meant to stay a glance.

   Whether the text is cut is MEASURED, on every resize of its box, not
   guessed from its length: in a popover the first layout happens before the
   panel has its width, and one measurement there found nothing cut.

   A press on See more stops there: it sits in rows and panels whose own
   press opens something else. */

const CLAMP = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
} as const;

export interface ClampedTextProps {
  text: string;
  /** How many lines show before See more. @default 3 */
  lines?: keyof typeof CLAMP;
  /** @default 'body14' */
  textStyle?: TypographyProps['textStyle'];
  /** @default 'primary' */
  textColor?: TypographyProps['textColor'];
  /** Show the whole text somewhere else instead of opening it in place. */
  onMore?: () => void;
  /** @default 'See more' */
  moreLabel?: string;
  /** @default 'See less' */
  lessLabel?: string;
  className?: string;
}

export function ClampedText({
  text,
  lines = 3,
  textStyle = 'body14',
  textColor = 'primary',
  onMore,
  moreLabel = 'See more',
  lessLabel = 'See less',
  className,
}: ClampedTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [clamped, setClamped] = useState(false);
  const [open, setOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the text changes
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || open) return undefined;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, open, lines]);

  const press = (e: MouseEvent) => {
    e.stopPropagation();
    if (onMore) onMore();
    else setOpen((v) => !v);
  };

  return (
    <span
      data-slot="clamped-text"
      className={cn('flex flex-col items-start gap-1', className)}
    >
      <Typography
        ref={ref}
        element="span"
        textStyle={textStyle}
        textColor={textColor}
        className={open ? undefined : CLAMP[lines]}
      >
        {text}
      </Typography>
      {clamped || open ? (
        <LinkButton
          className="text-sm"
          onClick={press}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
          }}
        >
          {open ? lessLabel : moreLabel}
        </LinkButton>
      ) : null}
    </span>
  );
}
