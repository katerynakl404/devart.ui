'use client';

import { X } from 'lucide-react';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

/* One recipe, one `part` per element. The values are the kit's `.promo-card`
   (`kit-theme.css`): 10/12 inset, 8px between glyph and copy, a 20px glyph 1px
   off the top, 2px between the two 12/16 lines, the dismiss 4px in from the
   corner. */
const promoCardVariants = cva('', {
  variants: {
    part: {
      /* The card's hover hangs on the ROOT (`group/promo-card`), not on the
         link: the dismiss sits over the link's corner, and with `hover:` on the
         link the pointer reaching it took the hover off the card it is part of
         (§116). */
      root: 'group/promo-card relative w-full',
      surface: cn(
        'flex w-full items-start gap-2 text-start',
        'rounded-md border border-stroke bg-surface-card px-3 py-2.5',
        // The card hover is the package's card recipe, not a local one: no
        // recolouring of the title, which would read as the heading turning
        // into a link under the pointer. It follows the ROOT, so it holds
        // while the pointer is on the dismiss (a sibling over this corner).
        'transition-colors group-hover/promo-card:bg-state-hover',
        // `shadow-focus` is not a class the preset generates, so the ring this
        // used to name never drew. The package's own ring recipe instead.
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
      ),
      icon: 'mt-px flex shrink-0 text-brand-primary [&_svg]:size-5',
      // pe-4 keeps the text clear of the dismiss, which sits over the corner.
      copy: 'flex min-w-0 flex-col gap-0.5 pe-4',
      text: 'text-xs leading-4',
      dismiss: 'absolute end-1 top-1',
    },
  },
  defaultVariants: { part: 'root' },
});

/**
 * A small promotional card: a glyph, what is on offer, one line of what it gives,
 * and a dismiss. Its first home is a sidebar, directly above the footer, but the
 * offer is not the point of the shape — an upgrade, an invitation, a trial that
 * is ending all fit it, which is why it is named for the job and not for a plan.
 *
 * It is the shape a sidebar has room for. A one-line pill was tried first and
 * said almost nothing in a 15rem column; a banner belongs to a page, not to a
 * rail. This states the offer and the reason in two lines and gets out of the
 * way — the dismiss is the point, not an afterthought.
 *
 * **It does not name the plan the person is on.** The account row directly
 * below it already does, and the same word twice in 40px of column is noise
 * rather than emphasis. The title is the offer; the line under it is what the
 * money buys.
 *
 * The dismiss is a SIBLING of the link, never nested inside it — a button
 * inside an anchor is not markup, and the whole card is the link's hit area.
 *
 * ```jsx
 * <PromoCard
 *   icon={<Sparkles />}
 *   title="Upgrade to Pro"
 *   description="Unlimited sources and 15,000 credits a month"
 *   href="/settings/plan"
 *   onDismiss={() => setPromo(false)}
 * />
 * ```
 */
export interface PromoCardProps
  extends Omit<ComponentProps<'div'>, 'title' | 'onSelect' | 'ref'> {
  /** Leading glyph. A 20px outline mark in Brand/Primary. */
  icon?: ReactNode;
  /** The offer, in two or three words. */
  title: ReactNode;
  /** One line of what it gives. */
  description?: ReactNode;
  /** Where the card goes. Rendered as an anchor when given, a button otherwise. */
  href?: string;
  dismissLabel?: string;
  /** Points at the link or the button, so `ref.current.focus()` focuses the card. */
  ref?: Ref<HTMLElement>;
  onSelect?: () => void;
  /** Omit to render a card that cannot be dismissed. The dismiss unmounts
   *  with the card, so the consumer moves focus after dismissing. */
  onDismiss?: () => void;
}

const PromoCard = ({
  icon,
  title,
  description,
  href,
  dismissLabel = 'Dismiss',
  className,
  ref,
  onSelect,
  onDismiss,
  ...props
}: PromoCardProps) => {
  const surfaceClassName = promoCardVariants({ part: 'surface' });

  const content = (
    <>
      {icon ? (
        <span
          aria-hidden="true"
          data-slot="promo-card-icon"
          className={promoCardVariants({ part: 'icon' })}
        >
          {icon}
        </span>
      ) : null}

      <span
        data-slot="promo-card-copy"
        className={promoCardVariants({ part: 'copy' })}
      >
        <Typography
          variant="span"
          weight="semibold"
          align={null}
          data-slot="promo-card-title"
          className={promoCardVariants({ part: 'text' })}
        >
          {title}
        </Typography>

        {description ? (
          <Typography
            variant="span"
            weight="normal"
            textColor="secondary"
            align={null}
            data-slot="promo-card-description"
            className={promoCardVariants({ part: 'text' })}
          >
            {description}
          </Typography>
        ) : null}
      </span>
    </>
  );

  return (
    <div
      data-slot="promo-card"
      className={cn(promoCardVariants({ part: 'root' }), className)}
      {...props}
    >
      {href ? (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          data-slot="promo-card-surface"
          className={surfaceClassName}
          onClick={onSelect}
        >
          {content}
        </a>
      ) : (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          data-slot="promo-card-surface"
          className={surfaceClassName}
          onClick={onSelect}
        >
          {content}
        </button>
      )}

      {onDismiss ? (
        // The shared row kebab's button — IconButton tertiary 2xs — so its
        // hover, pressed and focus are the package's, not a local copy.
        <IconButton
          aria-label={dismissLabel}
          data-slot="promo-card-dismiss"
          className={promoCardVariants({ part: 'dismiss' })}
          onClick={onDismiss}
          size="2xs"
          variant="tertiary"
        >
          <X />
        </IconButton>
      ) : null}
    </div>
  );
};

PromoCard.displayName = 'PromoCard';

export { PromoCard, promoCardVariants };
