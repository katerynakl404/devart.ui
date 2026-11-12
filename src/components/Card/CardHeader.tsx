import type { ComponentProps, ReactNode } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

/* 4px between the title and the description, not 6: off the 4px step, 6px is
   7.5 device pixels at 125% display scaling, and everything under the head —
   a separator, the next row — landed on a half pixel (§171). */
const cardHeaderVariants = cva('', {
  variants: {
    layout: {
      vertical: cn('flex flex-col space-y-1'),
      horizontal: cn('flex items-center gap-3.5'),
    },
  },
  defaultVariants: {
    layout: 'vertical',
  },
});

interface CardHeaderProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardHeaderVariants> {
  leftSlot?: ReactNode;
  /**
   * What the card's head offers, on its trailing edge: a "Permissions →"
   * link, an Export button, Delete Workspace. (2026-10-27)
   *
   * The slot is one title line tall — 24px, `CardTitle`'s line — and centres
   * what it holds on that line, so a link, a 24px icon button and a 32px
   * button all sit on the title's middle however many lines the description
   * under it runs to. It never shrinks; the title and description take what
   * is left (`min-w-0`) and wrap there. Card heads were built by hand as a
   * title, a sentence and a trailing action at eight places, because the
   * header had nowhere to put the action.
   *
   * The slot's text is 14px (`text-sm`): a `LinkButton` takes the size of the
   * text it sits in, so a head link is a step under the 16px title. Buttons
   * carry their own size.
   */
  actions?: ReactNode;
  /**
   * Where `actions` sit against a head with a description. `title` (default):
   * on the title's line — a link or a count that belongs to the title, over a
   * card whose content goes on below. `center`: on the middle of the title and
   * the description together — the card's one act, a card that is only the
   * head and its button (Delete connection). Without a description the two
   * are the same. (2026-11-03)
   *
   * With `center` the text keeps at least 20rem beside the act, and the act
   * goes under it, at the start, once there is less (2026-11-04).
   */
  actionsAlign?: 'title' | 'center';
}

const CardHeader = ({
  className,
  layout,
  leftSlot,
  actions,
  actionsAlign = 'title',
  children,
  ref,
  ...props
}: CardHeaderProps) => {
  const horizontal = layout === 'horizontal';
  // `cond && <Link />` and `cond ? <Link /> : null` both mean "none".
  const hasActions =
    actions !== undefined && actions !== null && actions !== false;
  /* The card's one act: the text keeps at least 20rem beside it, and the act
     goes under the text once there is less — not a sentence squeezed into a
     column a few words wide. Wrapped, it stands at the start. The Insightis
     kit's own row did this (2026-10-22, "кнопка мала опускатись під"); the
     LinkAI kit's squeezed (2026-11-04). 20rem, not the text's own width: a
     two-line sentence on a wide card keeps its button beside it. */
  const oneAct = hasActions && !horizontal && actionsAlign === 'center';

  return (
    <div
      ref={ref}
      className={cn(
        cardHeaderVariants({ layout }),
        // The vertical head turns into a row around its text column and the
        // actions; the column keeps the head's own 4px rhythm.
        hasActions && !horizontal && 'flex-row items-start gap-3 space-y-0',
        oneAct && 'flex-wrap items-center gap-y-4',
        className
      )}
      {...props}
    >
      {leftSlot}
      {horizontal ? (
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          {children}
        </div>
      ) : hasActions ? (
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col space-y-1',
            oneAct && 'basis-80'
          )}
        >
          {children}
        </div>
      ) : (
        children
      )}
      {hasActions ? (
        <div
          data-slot="card-header-actions"
          className={cn(
            'flex shrink-0 items-center gap-2 text-sm',
            !oneAct && 'ms-auto',
            actionsAlign === 'center' ? 'self-center' : 'h-6'
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

export { CardHeader, cardHeaderVariants };
