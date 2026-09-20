'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { CircleAlert, CircleCheck, Inbox, Info, RefreshCw } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../Button';
import { Typography } from '../Typography';

const containerVariants = cva(
  'flex min-h-0 flex-1 flex-col items-center justify-center rounded-lg text-center',
  {
    variants: {
      // reference ladder: sm gap 8 / pad 16 · md gap 12 / pad 24 · lg gap 16 / pad 32
      size: {
        xs: 'gap-1 p-3',
        sm: 'gap-2 p-4',
        md: 'gap-3 p-6',
        lg: 'gap-4 p-8',
      },
      surface: {
        embedded: '',
        standalone: 'border border-stroke bg-surface-card',
      },
    },
    defaultVariants: {
      size: 'md',
      surface: 'standalone',
    },
  }
);

const haloVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full',
  {
    variants: {
      tone: {
        neutral: 'bg-state-hover text-ink-secondary',
        muted: 'bg-brand-primary/5 text-ink-secondary',
        error: 'bg-fb-red/10 text-fb-red-text',
        info: 'bg-brand-primary/10 text-brand-primary',
        success: 'bg-fb-green/10 text-fb-green',
        transparent: 'bg-transparent',
      },
      // reference circles: sm 32 · md 40 · lg 56; glyphs 16 · 20 · 28
      size: {
        xs: 'size-7 [&_svg]:size-4',
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-10 [&_svg]:size-5',
        lg: 'size-14 [&_svg]:size-7',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  }
);

/**
 * Reference type ladder — sm 13 / lg 16 for the title, sm 11 / lg 13 for the
 * description, md sitting on the base rung between them. Expressed on the
 * named `textStyle` scale (the nearest rung to each reference value), with the
 * semantic element chosen separately so the size never drives the tag.
 */
const TITLE_BY_SIZE = {
  xs: { element: 'span', textStyle: 'title12' },
  sm: { element: 'span', textStyle: 'title12' },
  md: { element: 'p', textStyle: 'title14' },
  lg: { element: 'h3', textStyle: 'title16' },
} as const;

const DESCRIPTION_BY_SIZE = {
  xs: 'body12',
  sm: 'body12',
  md: 'body12',
  lg: 'body14',
} as const;

/**
 * The standard empty-state artwork: a crisp top card fading into two ghosts —
 * the shape of the very list that is missing.
 *
 * Deliberately not a magnifier. "Nothing was found" is already said by the
 * title; a magnifier says it a second time and says nothing about what kind of
 * thing is absent. Mirroring the list instead makes the state read as "this
 * area is empty" rather than "an error happened".
 *
 * Every colour is a token, so it re-themes with the page and needs no dark
 * variant. Pass it as `icon` with `withIconHalo={false}`.
 *
 * These are a **pack, not a rule**. `StatusView` takes whatever you give its
 * `icon` slot — a lucide glyph, one of these, or a product's own artwork — and
 * the system ships two because two are what every list needs: one for "there is
 * nothing here yet" and one for "your search matched nothing". They are
 * different states and a single picture cannot say both.
 */
const EmptyStateIllustration = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={cn('h-auto w-[150px] shrink-0', className)}
    fill="none"
    viewBox="0 0 150 104"
  >
    <g className="[filter:drop-shadow(0_2px_5px_rgb(15_23_42/0.10))]">
      <rect
        className="fill-surface-card stroke-stroke"
        height="26"
        rx="8"
        width="132"
        x="9"
        y="4"
      />
      <rect
        className="fill-ink-inactive/55"
        height="12"
        rx="4"
        width="12"
        x="18"
        y="11"
      />
      <rect
        className="fill-ink-inactive/35"
        height="6"
        rx="3"
        width="80"
        x="36"
        y="14"
      />
    </g>
    <g opacity="0.55">
      <rect
        className="fill-surface-card stroke-stroke"
        height="26"
        rx="8"
        width="132"
        x="9"
        y="38"
      />
      <rect
        className="fill-ink-inactive/55"
        height="12"
        rx="4"
        width="12"
        x="18"
        y="45"
      />
      <rect
        className="fill-ink-inactive/35"
        height="6"
        rx="3"
        width="64"
        x="36"
        y="48"
      />
    </g>
    <g opacity="0.28">
      <rect
        className="fill-surface-card stroke-stroke"
        height="26"
        rx="8"
        width="132"
        x="9"
        y="72"
      />
      <rect
        className="fill-ink-inactive/55"
        height="12"
        rx="4"
        width="12"
        x="18"
        y="79"
      />
      <rect
        className="fill-ink-inactive/35"
        height="6"
        rx="3"
        width="72"
        x="36"
        y="82"
      />
    </g>
  </svg>
);

/**
 * Nothing matched the query — as opposed to nothing existing, which is
 * `EmptyStateIllustration`.
 *
 * The difference has to be visible or the pack is one illustration with two
 * names: this one draws the **search itself** — a field with a query in it —
 * over rows that have faded out, so it reads as "you asked, and the list came
 * back empty". The magnifier is part of the depicted field, not a symbol
 * standing in for "not found"; that is the distinction the list version's note
 * above is about.
 */
const EmptySearchIllustration = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={cn('h-auto w-[150px] shrink-0', className)}
    fill="none"
    viewBox="0 0 150 104"
  >
    <g className="[filter:drop-shadow(0_2px_5px_rgb(15_23_42/0.10))]">
      <rect
        className="fill-surface-card stroke-stroke"
        height="28"
        rx="8"
        width="132"
        x="9"
        y="4"
      />
      <circle
        className="stroke-ink-inactive/60"
        cx="24"
        cy="17"
        r="5"
        strokeWidth="1.5"
      />
      <path
        className="stroke-ink-inactive/60"
        d="M27.8 20.8 L31 24"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <rect
        className="fill-ink-inactive/35"
        height="6"
        rx="3"
        width="52"
        x="38"
        y="15"
      />
    </g>
    <g opacity="0.4">
      <rect
        className="fill-surface-card stroke-stroke"
        height="22"
        rx="8"
        width="132"
        x="9"
        y="44"
        strokeDasharray="4 4"
      />
    </g>
    <g opacity="0.2">
      <rect
        className="fill-surface-card stroke-stroke"
        height="22"
        rx="8"
        width="132"
        x="9"
        y="74"
        strokeDasharray="4 4"
      />
    </g>
  </svg>
);

type StatusTone =
  | 'neutral'
  | 'muted'
  | 'error'
  | 'info'
  | 'success'
  | 'transparent';

const TONE_DEFAULT_ICON: Record<StatusTone, ReactNode> = {
  neutral: <Inbox aria-hidden="true" />,
  muted: <Inbox aria-hidden="true" />,
  error: <CircleAlert aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
  success: <CircleCheck aria-hidden="true" />,
  transparent: null,
};

const DEFAULT_RETRY_BUTTON = {
  variant: 'secondary',
  size: 'sm',
  rounded: 'full',
  leftSlot: <RefreshCw />,
} as const satisfies ButtonProps;

export interface StatusViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof containerVariants> {
  tone?: StatusTone;
  icon?: ReactNode;
  withIconHalo?: boolean;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  actionsOrientation?: 'inline' | 'stacked';
  retryLabel?: string;
  retryButton?: ButtonProps;
  ref?: Ref<HTMLDivElement>;
  onRetry?: () => void;
}

const StatusView = ({
  tone = 'neutral',
  size,
  surface,
  icon,
  withIconHalo = true,
  title,
  description,
  actions,
  actionsOrientation = 'inline',
  retryLabel,
  retryButton,
  className,
  ref,
  onRetry,
  ...props
}: StatusViewProps) => {
  const isError = tone === 'error';
  const isCompact = size === 'xs';
  const titleStyle = TITLE_BY_SIZE[size ?? 'md'];

  const resolvedIcon = icon === null ? null : (icon ?? TONE_DEFAULT_ICON[tone]);

  const {
    variant: retryVariant = DEFAULT_RETRY_BUTTON.variant,
    size: retrySize = DEFAULT_RETRY_BUTTON.size,
    rounded: retryRounded = DEFAULT_RETRY_BUTTON.rounded,
    leftSlot: retryLeftSlot = DEFAULT_RETRY_BUTTON.leftSlot,
  } = retryButton ?? {};

  const resolvedActions =
    actions ??
    (onRetry && retryLabel ? (
      <Button
        variant={retryVariant}
        size={retrySize}
        rounded={retryRounded}
        leftSlot={retryLeftSlot}
        onClick={onRetry}
      >
        {retryLabel}
      </Button>
    ) : null);

  return (
    <div
      ref={ref}
      role={isError ? 'alert' : undefined}
      aria-live={isError ? 'assertive' : undefined}
      className={cn(containerVariants({ size, surface }), className)}
      {...props}
    >
      {resolvedIcon &&
        (withIconHalo ? (
          <span className={haloVariants({ tone, size })}>{resolvedIcon}</span>
        ) : (
          resolvedIcon
        ))}

      <div className="flex max-w-md flex-col items-center gap-1.5">
        <Typography
          align="center"
          element={titleStyle.element}
          textColor="primary"
          textStyle={titleStyle.textStyle}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            align="center"
            className={
              isCompact ? 'text-balance leading-normal' : 'leading-relaxed'
            }
            element="p"
            textColor="secondary"
            textStyle={DESCRIPTION_BY_SIZE[size ?? 'md']}
          >
            {description}
          </Typography>
        )}
      </div>

      {resolvedActions && (
        <div
          className={cn(
            'flex w-full max-w-xs',
            actionsOrientation === 'stacked'
              ? 'flex-col gap-3'
              : 'flex-row items-center justify-center gap-3'
          )}
        >
          {resolvedActions}
        </div>
      )}
    </div>
  );
};

StatusView.displayName = 'StatusView';

export {
  containerVariants,
  EmptySearchIllustration,
  EmptyStateIllustration,
  StatusView,
};
