import type { ComponentProps, ReactNode } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';

const cardHeaderVariants = cva('', {
  variants: {
    layout: {
      vertical: cn('flex flex-col space-y-1.5'),
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
   */
  actions?: ReactNode;
}

const CardHeader = ({
  className,
  layout,
  leftSlot,
  actions,
  children,
  ref,
  ...props
}: CardHeaderProps) => {
  const horizontal = layout === 'horizontal';
  // `cond && <Link />` and `cond ? <Link /> : null` both mean "none".
  const hasActions =
    actions !== undefined && actions !== null && actions !== false;

  return (
    <div
      ref={ref}
      className={cn(
        cardHeaderVariants({ layout }),
        // The vertical head turns into a row around its text column and the
        // actions; the column keeps the head's own 6px rhythm.
        hasActions && !horizontal && 'flex-row items-start gap-3 space-y-0',
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
        <div className="flex min-w-0 flex-1 flex-col space-y-1.5">
          {children}
        </div>
      ) : (
        children
      )}
      {hasActions ? (
        <div
          data-slot="card-header-actions"
          className="ms-auto flex h-6 shrink-0 items-center gap-2"
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

export { CardHeader, cardHeaderVariants };
