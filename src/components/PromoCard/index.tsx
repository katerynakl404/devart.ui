import type { ComponentProps, ReactNode, Ref } from 'react';
import { cn } from '../../lib/utils';

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
export interface PromoCardProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Leading glyph. A 20px outline mark in Brand/Primary. */
  icon?: ReactNode;
  /** The offer, in two or three words. */
  title: ReactNode;
  /** One line of what it gives. */
  description?: ReactNode;
  /** Where the card goes. Rendered as an anchor when given, a button otherwise. */
  href?: string;
  onSelect?: () => void;
  /** Omit to render a card that cannot be dismissed. */
  onDismiss?: () => void;
  dismissLabel?: string;
  ref?: Ref<HTMLDivElement>;
}

function PromoCard({
  icon,
  title,
  description,
  href,
  onSelect,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  ref,
  ...props
}: PromoCardProps) {
  const Surface = href ? 'a' : 'button';

  return (
    <div
      ref={ref}
      data-slot="promo-card"
      className={cn('relative w-full', className)}
      {...props}
    >
      <Surface
        className={cn(
          'flex w-full items-start gap-2 rounded-md border p-2.5 pr-8 text-left',
          'border-stroke bg-surface-card',
          // The card hover is the package's card recipe, not a local one: no
          // recolouring of the title, which would read as the heading turning
          // into a link under the pointer.
          'transition-colors hover:bg-state-hover',
          'focus-visible:shadow-focus focus-visible:outline-none'
        )}
        href={href}
        onClick={onSelect}
        type={href ? undefined : 'button'}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="mt-px flex shrink-0 text-brand-primary [&_svg]:size-5"
          >
            {icon}
          </span>
        ) : null}

        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="font-semibold text-ink-primary text-xs leading-4">
            {title}
          </span>
          {description ? (
            <span className="font-normal text-ink-secondary text-xs leading-4">
              {description}
            </span>
          ) : null}
        </span>
      </Surface>

      {onDismiss ? (
        <button
          aria-label={dismissLabel}
          className={cn(
            'absolute top-1 right-1 flex size-6 items-center justify-center rounded-sm',
            'text-ink-secondary hover:bg-state-hover hover:text-ink-body',
            'focus-visible:shadow-focus focus-visible:outline-none',
            '[&_svg]:size-3.5'
          )}
          onClick={onDismiss}
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

PromoCard.displayName = 'PromoCard';

export { PromoCard };
