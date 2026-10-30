'use client';

/**
 * The developers' `PromoCard`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/PromoCard/index.tsx`, import paths alone changed.
 * The Before half of the PromoCard page renders this file, so it is the
 * component the developer storybook ships, not a drawing of it. The
 * `IconButton` and `Typography` it imports are the live package's. Not
 * edited: replace it whole when the base moves.
 */

import { X } from 'lucide-react';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { IconButton } from '../../src/components/IconButton';
import { Typography } from '../../src/components/Typography';
import { cva } from '../../src/lib/cva';
import { cn } from '../../src/lib/utils';

const promoCardVariants = cva('', {
  variants: {
    part: {
      root: 'relative w-full',
      surface: cn(
        'flex w-full items-start gap-2 text-start',
        'rounded-md border border-stroke bg-surface-card px-3 py-2.5',
        'transition-colors hover:bg-state-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card'
      ),
      icon: 'mt-px flex shrink-0 text-brand-primary [&_svg]:size-5',
      copy: 'flex min-w-0 flex-col gap-0.5 pe-4',
      text: 'text-xs leading-4',
      dismiss: 'absolute end-1 top-1',
    },
  },
  defaultVariants: { part: 'root' },
});

export interface PromoCardProps
  extends Omit<ComponentProps<'div'>, 'title' | 'onSelect' | 'ref'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  dismissLabel?: string;
  ref?: Ref<HTMLElement>;
  onSelect?: () => void;
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
