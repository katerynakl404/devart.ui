'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn, glyphStroke } from '../../lib/utils';

/* Alert is the package's third feedback surface, and the one it was missing.
   Banner is a large onboarding/marketing card — 60px icon, 24px padding, gradient
   artwork — and Toast floats over the page and takes itself away. Neither fits a
   condition that has to sit INSIDE a surface, state itself quietly, and offer the
   way out: "the queue is paused because the assistant is waiting for you", "the
   last reply failed", "you are out of credits". That block is what this is.

   Its colours, its glyphs and its roster are TOAST'S, token for token. Alert is
   the same feedback family standing still instead of floating, and a family that
   changes colour when it stops moving is two families. One deliberate difference:
   Info is Brand/Tertiary where Toast uses Brand/Primary, so an inline notice does
   not read as the product's own voice.

   No accent rail. A 2px left border following an 8px radius reads as a thick,
   half-rounded edge rather than as a cue, and the wash plus a variant-specific
   glyph already carry the meaning — including without colour (WCAG 1.4.1). A
   hairline all the way round does the job the rail was reaching for: it gives the
   block an edge of its own instead of letting a wash bleed into the surface. */
const alertVariants = cva(
  /* px stays wider than py. It was tightened to px-2 for one pass, to put the title on the
     same vertical as unboxed text beside it — a bordered block's inner text only joins that
     column when its own inset is subtracted. Reverted: the side gaps read as too tight. */
  cn('flex items-start', 'rounded-lg border'),
  {
    variants: {
      /* TWO SIZES, because an Alert does two jobs. Tucked inside another surface — a queue
         band, a card — it is a footnote and reads at 12. Standing on a page, above a table,
         speaking about the whole screen, it occupies a full row, and 12px there is a whisper
         from something large. Every rung moves together — type, glyph, padding and gap — so md
         is a SIZE, not an Alert with a bigger font. */
      size: {
        sm: 'gap-2.5 px-3 py-2.5',
        md: 'gap-3 px-3.5 py-3',
      },
      /* The four tinted surfaces come from --alert-bg-* / --alert-border-*, which
         have the same shape Toast's do: a color-mix() over Surface/Card, so the
         block does not take the colour of whatever it is dropped onto, and the
         wash steps 5% -> 8% in dark inside the token rather than in a class here. */
      variant: {
        success: 'border-alert-border-success bg-alert-bg-success',
        info: 'border-alert-border-info bg-alert-bg-info',
        warning: 'border-alert-border-warning bg-alert-bg-warning',
        error: 'border-alert-border-error bg-alert-bg-error',
        /* Neutral is Alert's own — Toast has no counterpart, because nothing
           floats over the page to say something colourless. It is the one variant
           with no colour to wash with, and a 5% grey is not a surface, it is a
           smudge, so it takes a quiet surface and the ordinary border instead.
           Surface/Card2, not Surface/Chips: on dark, Chips resolves to the SAME
           grey as Stroke/Border, so fill and edge collapsed into one bright slab
           while on light they sat clearly apart — the themes stopped agreeing. */
        /* `border-stroke`, not `border-stroke-border`: the key is
           `stroke.DEFAULT`, so the latter named nothing, generated no CSS, and
           left the bare `border` in the base string painting Tailwind's own
           default (#E5E7EB). On light that is 1.13 against the fill — within a
           hundredth of the token it was meant to be, so the defect was
           invisible. On dark it is 12.86: a white hairline round a near-black
           block, and the one variant whose themes did not match. */
        neutral: 'border-stroke bg-surface-card2',
      },
    },
    /* sm is the default: every inline use of Alert predates md, and the component was drawn for
       the footnote case first. */
    defaultVariants: { variant: 'neutral', size: 'sm' },
  }
);

/* The size's other three rungs. They sit beside ICON_TONE as plain maps rather than inside the
   cva above, because cva styles the ROOT and these land on children — the same shape the tone
   map already uses. */
const SIZE_TITLE = {
  sm: 'text-xs leading-4',
  md: 'text-sm leading-5',
} as const;

const SIZE_DESCRIPTION = {
  sm: 'text-xs leading-4',
  md: 'text-sm leading-5',
} as const;

/* The glyph box equals the title's line box, which is what aligns them: 16/16 at sm, 20/20 at md.
   The stroke does NOT follow the size. It was 1.5 at sm for a while, so the 16px mark matched
   the weight of the 20px one; that made Alert the one place a 16px glyph drew lighter than the
   same glyph in a button beside it. It takes `glyphStroke` like every other control. */
const SIZE_ICON = {
  sm: '[&_svg]:size-4',
  md: '[&_svg]:size-5',
} as const;

const ICON_TONE = {
  success: 'text-fb-green',
  info: 'text-brand-tertiary',
  warning: 'text-fb-attention',
  error: 'text-fb-red-text',
  neutral: 'text-ink-secondary',
} as const;

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title: string;
  description?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  /** Leading glyph. Use the mark Toast uses for the same variant — circle-check,
   *  circle-i, triangle-!, circle-x — so one event reads as one event wherever it
   *  surfaces. The SHAPE is what carries the reason when colour is unavailable
   *  (WCAG 1.4.1); the accent only reinforces it. */
  icon?: ReactNode;
  iconClassName?: string;
  /** Trailing controls. House rule: the primary action goes LAST, on the right. */
  actions?: ReactNode;
  actionsClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

const Alert = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
  icon,
  iconClassName,
  actions,
  actionsClassName,
  variant = 'neutral',
  size = 'sm',
  className,
  ref,
  ...props
}: AlertProps) => (
  /* `status`, not `alert`: these announce a state change politely and must not
     interrupt what the person is doing. A true `alert` role is for something
     that cannot wait, which none of these are. */
  <div
    ref={ref}
    role="status"
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  >
    {icon ? (
      /* No nudge: the glyph box is 16px and so is the title's line box, so they
         align by being the same box. */
      <span
        aria-hidden="true"
        className={cn(
          'flex shrink-0',
          SIZE_ICON[size ?? 'sm'],
          glyphStroke,
          ICON_TONE[variant ?? 'neutral'],
          iconClassName
        )}
      >
        {icon}
      </span>
    ) : null}

    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span
        className={cn(
          'font-semibold text-ink-primary',
          SIZE_TITLE[size ?? 'sm'],
          titleClassName
        )}
      >
        {title}
      </span>
      {description ? (
        <span
          className={cn(
            'font-normal text-ink-secondary',
            SIZE_DESCRIPTION[size ?? 'sm'],
            descriptionClassName
          )}
        >
          {description}
        </span>
      ) : null}
    </div>

    {actions ? (
      <div
        className={cn(
          'flex shrink-0 items-center gap-1.5 self-center',
          // Under `sm` the actions drop under the copy instead of squeezing it
          // into a column of single words.
          'max-sm:w-full max-sm:self-start max-sm:pl-6',
          actionsClassName
        )}
      >
        {actions}
      </div>
    ) : null}
  </div>
);

Alert.displayName = 'Alert';

export { Alert, alertVariants };
