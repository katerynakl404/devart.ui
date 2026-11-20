'use client';

import { CircleX, Info, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn, glyphStroke } from '../../lib/utils';

/* StatusMark — the glyph that says a state and nothing else: the triangle for
   a warning, the cross in a circle for an error, the tick for success, the ⓘ
   for a note. Decoration, always: it is `aria-hidden`, takes no focus and
   carries no words, because the words beside it already say the thing — a
   status line's mark, the mark on a row.

   Three tones, and only three: the note (grey — a description, what a field
   is for), the warning that has not cost anything yet (amber), the failure
   that has (red). They take `Alert`'s inks so a state reads the same in a
   banner and beside a name, but NOT `Alert`'s whole scale. `info` and
   `success` were carried over from it and neither earned its place: `info`
   was the same ⓘ as `neutral` in another colour, and a description is grey
   `success` had zero call sites in either
   product, and a green tick beside a name marks the thing nobody needs
   marked.

   It does NOT explain itself. A mark whose meaning has to be revealed is
   `IconHint`, which is a button and renders this inside it — that is what the
   `interactive` axis is for: the neutral ⓘ steps up a shade as its button is
   hovered or focused, and standalone it never does. Splitting the two is what
   `IconHint` was before: one component with a `tooltip` prop that
   swapped the whole render — a focusable `role="img"` with it, an
   `aria-hidden` span without — which is two jobs and two accessibility
   contracts behind one prop. */

const statusMarkVariants = cva(
  cn('inline-flex shrink-0 rounded-sm', glyphStroke),
  {
    variants: {
      variant: {
        /** The note and the description: grey, the icon ink. */
        neutral: 'text-ink-icon transition-colors duration-fast',
        /** Will cost an answer and has not yet. */
        warning: 'text-fb-attention',
        /** Has happened. */
        error: 'text-fb-red-text',
      },
      size: {
        /** 14px — beside a 14px name: a row, a list, a tree. */
        sm: '[&_svg]:size-3.5',
        /** 16px — beside a 16px title. */
        md: '[&_svg]:size-4',
      },
      /**
       * Inside a control that can be hovered or focused — `IconHint`'s
       * button, which carries `group/icon-hint`. Only the neutral note has a
       * step to take: a state's colour is the state, and brightening it would
       * read as the state changing.
       */
      interactive: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'neutral',
        interactive: true,
        class: cn(
          'group-hover/icon-hint:text-ink-icon-hover',
          'group-focus-visible/icon-hint:text-ink-icon-hover'
        ),
      },
    ],
    defaultVariants: { variant: 'neutral', size: 'sm', interactive: false },
  }
);

const GLYPH = {
  neutral: Info,
  warning: TriangleAlert,
  error: CircleX,
} as const;

export interface StatusMarkProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof statusMarkVariants> {
  ref?: Ref<HTMLSpanElement>;
}

export function StatusMark({
  variant,
  size,
  interactive,
  className,
  ...props
}: StatusMarkProps) {
  const Glyph = GLYPH[variant ?? 'neutral'];

  return (
    <span
      data-slot="status-mark"
      aria-hidden
      className={cn(
        statusMarkVariants({ variant, size, interactive }),
        className
      )}
      {...props}
    >
      <Glyph />
    </span>
  );
}

export { statusMarkVariants };
