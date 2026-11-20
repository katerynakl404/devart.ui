import type { ComponentProps, ReactNode } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

/* 4px between the title and the description, not 6: off the 4px step, 6px is
   7.5 device pixels at 125% display scaling, and everything under the head —
   a separator, the next row — landed on a half pixel. */
const cardHeaderVariants = cva('', {
  variants: {
    layout: {
      vertical: cn('flex flex-col space-y-1'),
      horizontal: cn('flex items-center gap-3.5'),
    },
    /* The vertical head turns into a row around its text column and the
       actions; the column keeps the head's own 4px rhythm. */
    withActions: { true: '', false: '' },
    actionsAlign: { title: '', center: '' },
  },
  compoundVariants: [
    {
      layout: 'vertical',
      withActions: true,
      class: 'flex-row items-start gap-3 space-y-0',
    },
    /* The card's one act: the text keeps at least 20rem beside it and the act
       goes under it once there is less. */
    {
      layout: 'vertical',
      withActions: true,
      actionsAlign: 'center',
      class: 'flex-wrap items-center gap-y-4',
    },
  ],
  defaultVariants: {
    layout: 'vertical',
    withActions: false,
    actionsAlign: 'title',
  },
});

/** The text column, which gives way to the act beside it. */
const cardHeaderTextVariants = cva('flex min-w-0 flex-1 flex-col space-y-1', {
  variants: {
    oneAct: { true: 'basis-80', false: '' },
  },
  defaultVariants: { oneAct: false },
});

/** The trailing slot: one title line tall, or centred on title and description. */
const cardHeaderActionsVariants = cva(
  'flex shrink-0 items-center gap-2 text-sm',
  {
    variants: {
      align: { title: 'h-6', center: 'self-center' },
      oneAct: { true: '', false: 'ms-auto' },
    },
    defaultVariants: { align: 'title', oneAct: false },
  }
);

interface CardHeaderProps
  extends ComponentProps<'div'>,
    Omit<VariantProps<typeof cardHeaderVariants>, 'withActions'> {
  leftSlot?: ReactNode;
  /**
   * What the card's head offers, on its trailing edge: a "Permissions →"
   * link, an Export button, Delete Workspace.
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
   * are the same.
   *
   * With `center` the text keeps at least 20rem beside the act, and the act
   * goes under it, at the start, once there is less.
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
     kit's own row did this; the
     LinkAI kit's squeezed it instead. 20rem, not the text's own width: a
     two-line sentence on a wide card keeps its button beside it. */
  const oneAct = hasActions && !horizontal && actionsAlign === 'center';

  return (
    <div
      ref={ref}
      className={cn(
        cardHeaderVariants({
          layout,
          withActions: hasActions,
          actionsAlign,
        }),
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
        <div className={cardHeaderTextVariants({ oneAct })}>{children}</div>
      ) : (
        children
      )}
      {hasActions ? (
        <div
          data-slot="card-header-actions"
          className={cardHeaderActionsVariants({
            align: actionsAlign,
            oneAct,
          })}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

export {
  CardHeader,
  cardHeaderActionsVariants,
  cardHeaderTextVariants,
  cardHeaderVariants,
};
