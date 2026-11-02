'use client';

import { CircleAlert, CircleCheck, Inbox, Info, RefreshCw } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../Button';
import { Typography } from '../Typography';

const containerVariants = cva(
  'flex min-h-0 flex-1 flex-col items-center justify-center rounded-lg text-center',
  {
    variants: {
      /* `lg` and `sm` are the kit's two empty states, copied from
         `.empty-state` and `.empty-state.is-sm`: 48/24 padding at gap 8, and
         24/16 at gap 6. `xs` and `md` have no counterpart in the kit — they
         are the package's own rungs for a status block inside a card, and are
         marked as such in StatusView.md rather than presented as kit values. */
      size: {
        xs: 'gap-1 p-3',
        sm: 'gap-1.5 px-4 py-6',
        md: 'gap-3 p-6',
        lg: 'gap-2 px-6 py-12',
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
        success: 'bg-fb-green/10 text-fb-green-text',
        transparent: 'bg-transparent',
      },
      /* The halo is the package's own; the kit's page-level empty state has
         no chip at all — `.empty-ic` is a bare 48px glyph in `--ink-inactive`
         (32px at `.is-sm`). Reach for `withIconHalo={false}` to get that, which
         is also what the illustrations need. The chip that IS in the kit is
         `.cl-menu-empty-ic`: 28px, `--icon-wrapper-bg`, a border, a 16px glyph.
         The `xs` rung is that size; its fill comes from `tone`, not from here,
         because a size axis that also sets a colour cannot be composed.

         `base` is upstream's (1.4.0), at upstream's values: a 48px halo with a
         24px glyph. Upstream puts it between its `sm` (40) and `md` (56); on
         this ladder 48 falls between `md` (40) and `lg` (56). */
      size: {
        xs: 'size-7 [&_svg]:size-4',
        sm: 'size-8 [&_svg]:size-4',
        base: 'size-12 [&_svg]:size-6',
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
 * The title and description block. `width` is upstream's `contentWidth`
 * (1.4.0): `md` is the 28rem the block always had, `sm` a narrower 24rem.
 */
const contentVariants = cva('flex flex-col items-center gap-1.5', {
  variants: {
    width: {
      sm: 'max-w-sm',
      md: 'max-w-md',
    },
  },
  defaultVariants: {
    width: 'md',
  },
});

/**
 * Reference type ladder — sm 13 / lg 16 for the title, sm 11 / lg 13 for the
 * description, md sitting on the base rung between them. Expressed on the
 * named `textStyle` scale (the nearest rung to each reference value), with the
 * semantic element chosen separately so the size never drives the tag.
 *
 * `base` is upstream's (1.4.0) and reachable only through `titleSize`: a
 * `text-base` semibold span, which on this scale is `title16` — the face of
 * `lg`'s title, without its heading tag.
 */
const TITLE_BY_SIZE = {
  xs: { element: 'span', textStyle: 'title12' },
  sm: { element: 'span', textStyle: 'title12' },
  base: { element: 'span', textStyle: 'title16' },
  md: { element: 'p', textStyle: 'title14' },
  lg: { element: 'h3', textStyle: 'title16' },
} as const;

/**
 * The kit sets the CTA's own offset on top of the block's gap — `.empty-state
 * .btn{margin-top:.75rem}` over a gap of 8, and `.5rem` over 6 at `.is-sm`.
 * So the action sits 12 below the text at `lg` and 8 at `sm`, not at the
 * block's gap. `xs` and `md` have no kit value and take none.
 */
const ACTIONS_OFFSET_BY_SIZE = {
  xs: '',
  sm: 'mt-0.5',
  md: '',
  lg: 'mt-1',
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
        className="fill-surface-card stroke-stroke-hover"
        height="28"
        rx="8"
        width="132"
        x="9"
        y="4"
      />
      <circle
        className="stroke-ink-inactive"
        cx="24"
        cy="17"
        r="5"
        strokeWidth="1.5"
      />
      <path
        className="stroke-ink-inactive"
        d="M27.8 20.8 L31 24"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <rect
        className="fill-ink-inactive/55"
        height="6"
        rx="3"
        width="52"
        x="38"
        y="15"
      />
    </g>
    <g>
      <rect
        className="fill-surface-card stroke-stroke-hover"
        height="22"
        rx="8"
        width="132"
        x="9"
        y="44"
        strokeDasharray="4 4"
      />
    </g>
    <g opacity="0.5">
      <rect
        className="fill-surface-card stroke-stroke-hover"
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
  iconSize?: VariantProps<typeof haloVariants>['size'];
  withIconHalo?: boolean;
  title: string;
  titleSize?: keyof typeof TITLE_BY_SIZE;
  contentWidth?: VariantProps<typeof contentVariants>['width'];
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
  iconSize,
  withIconHalo = true,
  title,
  titleSize,
  contentWidth,
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
  const titleStyle = TITLE_BY_SIZE[titleSize ?? size ?? 'md'];
  // The message's 48ch cap applies inside the default `md` block only.
  const capsMessage = (contentWidth ?? 'md') === 'md';

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
          <span className={haloVariants({ tone, size: iconSize ?? size })}>
            {resolvedIcon}
          </span>
        ) : (
          resolvedIcon
        ))}

      <div className={contentVariants({ width: contentWidth })}>
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
            /* `.empty-msg` in the kit: `max-width:32ch` and
               `text-wrap:balance`, on every size. Both were conditional here —
               balance only on `xs`, and the width came from the block's own
               `max-w-md` (448px) — which is how a message ends up breaking one
               word onto a line of its own.

               The cap is on the MESSAGE, not on the block: the kit gives the
               title no max-width, because a title short enough to be a title
               does not need one.

               48ch, not the kit's 32: a two-sentence message — what is empty
               and what to do about it — broke into three or four short lines
               at 32 and read as a column of fragments. `text-balance` stays,
               so the wider measure still never leaves one word on a line.

               Upstream's `contentWidth` now sets the block. The cap stays only
               where it says something the block does not: inside `md` (448px)
               a 12px message stops at 48ch, about 388px in DM Sans. `sm`
               (384px) is already that measure, so there the cap is dropped. */
            className={cn(
              capsMessage && 'max-w-[48ch]',
              'text-balance',
              isCompact ? 'leading-normal' : 'leading-relaxed'
            )}
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
          /* One action or two, and no more. One is the thing the state is
             missing; two is that plus its alternative — never two primaries,
             and never a third, because an empty state that offers three ways
             out is a menu with a picture on it.

             `max-w-xs` caps the row so a stacked pair does not stretch to the
             width of the block. */
          className={cn(
            'flex w-full max-w-xs',
            ACTIONS_OFFSET_BY_SIZE[size ?? 'md'],
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
  contentVariants,
  EmptySearchIllustration,
  EmptyStateIllustration,
  haloVariants,
  StatusView,
};
