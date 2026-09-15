'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn, focusRing } from '../../lib/utils';
import { Typography } from '../Typography';

const BANNER_ROOT_LAYOUT = cn(
  'group/banner relative flex items-center gap-5 rounded-xl',
  'max-md:flex-col max-md:items-start max-md:gap-3.5',
  'px-6 py-6',
  'max-md:px-5 max-md:py-5',
  'max-sm:p-4'
);

const ICON_BASE = cn(
  'box-border overflow-visible',
  'flex shrink-0 items-center justify-center',
  'rounded-full border-[1.5px] border-solid',
  'size-[3.75rem]',
  '[&_svg]:size-7',
  'max-md:size-11',
  'max-md:[&_svg]:size-[22px]'
);

const ACTION_LAYOUT = cn(
  'shrink-0 max-md:flex max-md:w-full',
  'max-md:[&_button]:max-w-48 max-md:[&_button]:flex-1',
  'max-md:[&_button]:justify-center',
  'max-sm:[&_button]:max-w-none'
);

const GRADIENT_PRIMARY_ACTION = cn(
  '[&_button]:border-transparent',
  '[&_button]:bg-banner-grad-text',
  '[&_button]:text-banner-grad-btn-text',
  '[&_button:hover]:bg-banner-grad-sub',
  '[&_button:hover]:text-banner-grad-btn-text',
  '[&_button:active]:bg-banner-grad-sub',
  '[&_button:active]:text-banner-grad-btn-text'
);

/**
 * The gradient surfaces paint white-on-teal, so icon, title, description and
 * close button all switch to the `--banner-grad-*` on-gradient tokens. The
 * `default` surface is a plain card and must read with ordinary ink tokens.
 */
const GRADIENT_ICON = cn(
  'border-banner-grad-ic-border',
  'bg-banner-grad-ic-bg text-banner-grad-text',
  'shadow-banner-grad-ic'
);

const SOLID_ICON = cn(
  'border-transparent',
  'bg-brand-primary text-content-on-solid',
  'shadow-banner-ic'
);

const GRADIENT_CLOSE = cn(
  'text-banner-grad-sub',
  'hover:bg-banner-grad-ic-bg hover:text-banner-grad-text'
);

const SOLID_CLOSE = cn(
  'text-ink-secondary',
  'hover:bg-state-hover hover:text-ink-primary'
);

const bannerVariants = cva(BANNER_ROOT_LAYOUT, {
  variants: {
    variant: {
      default: cn('border border-stroke bg-surface-card'),
      horizontalWide: cn('border-none', 'bg-banner-grad-horizontal-wide'),
      diagonalAiry: cn('border-none', 'bg-banner-grad-diagonal-airy'),
      diagonalFade: cn('border-none', 'bg-banner-grad-diagonal-fade'),
      horizontalSlab: cn('border-none', 'bg-banner-grad-horizontal-slab'),
    },
    size: {
      default: '',
      sm: cn(
        'px-5 py-4',
        '[&_[data-slot=banner-icon]]:size-10',
        '[&_[data-slot=banner-icon]_svg]:size-5',
        '[&_[data-slot=banner-title]]:text-sm',
        '[&_[data-slot=banner-title]]:leading-5',
        '[&_[data-slot=banner-action]]:gap-2'
      ),
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const bannerIconVariants = cva(ICON_BASE, {
  variants: {
    variant: {
      default: SOLID_ICON,
      horizontalWide: GRADIENT_ICON,
      diagonalAiry: GRADIENT_ICON,
      diagonalFade: GRADIENT_ICON,
      horizontalSlab: GRADIENT_ICON,
    },
  },
  defaultVariants: { variant: 'default' },
});

const bannerTitleVariants = cva('m-0 text-base', {
  variants: {
    variant: {
      default: 'text-ink-primary',
      horizontalWide: 'text-banner-grad-text',
      diagonalAiry: 'text-banner-grad-text',
      diagonalFade: 'text-banner-grad-text',
      horizontalSlab: 'text-banner-grad-text',
    },
  },
  defaultVariants: { variant: 'default' },
});

const bannerDescriptionVariants = cva(
  cn('max-w-[39.5rem] leading-normal', '[&_b]:font-semibold'),
  {
    variants: {
      variant: {
        default: 'text-ink-secondary [&_b]:text-ink-primary',
        horizontalWide: 'text-banner-grad-sub [&_b]:text-banner-grad-text',
        diagonalAiry: 'text-banner-grad-sub [&_b]:text-banner-grad-text',
        diagonalFade: 'text-banner-grad-sub [&_b]:text-banner-grad-text',
        horizontalSlab: 'text-banner-grad-sub [&_b]:text-banner-grad-text',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

const bannerCloseVariants = cva(
  cn(
    'absolute top-3 right-3',
    'inline-flex size-8 items-center justify-center',
    'rounded-md transition-colors',
    '[&_svg]:size-4',
    focusRing
  ),
  {
    variants: {
      variant: {
        default: SOLID_CLOSE,
        horizontalWide: GRADIENT_CLOSE,
        diagonalAiry: GRADIENT_CLOSE,
        diagonalFade: GRADIENT_CLOSE,
        horizontalSlab: GRADIENT_CLOSE,
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title: string;
  description?: ReactNode;
  descriptionClassName?: string;
  titleClassName?: string;
  icon?: ReactNode;
  iconClassName?: string;
  action?: ReactNode;
  actionClassName?: string;
  /** Renders the corner dismiss button described by the reference anatomy. */
  onDismiss?: () => void;
  /** Accessible label for the corner dismiss button. */
  dismissLabel?: string;
  ref?: Ref<HTMLDivElement>;
}

const Banner = ({
  title,
  description,
  descriptionClassName,
  titleClassName,
  icon,
  iconClassName,
  action,
  actionClassName,
  onDismiss,
  dismissLabel = 'Dismiss',
  variant = 'default',
  size,
  className,
  ref,
  ...props
}: BannerProps) => {
  const resolvedVariant = variant ?? 'default';

  return (
    <div
      ref={ref}
      className={cn(
        bannerVariants({ variant: resolvedVariant, size }),
        // reserves the corner the close button occupies, so it clears the CTA
        onDismiss && 'pr-14 max-sm:pr-14 max-md:pr-14',
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            bannerIconVariants({ variant: resolvedVariant }),
            iconClassName
          )}
          data-slot="banner-icon"
        >
          {icon}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Typography
          className={cn(
            bannerTitleVariants({ variant: resolvedVariant }),
            titleClassName
          )}
          data-slot="banner-title"
          variant="h6"
          weight="semibold"
        >
          {title}
        </Typography>

        {description && (
          <Typography
            className={cn(
              bannerDescriptionVariants({ variant: resolvedVariant }),
              descriptionClassName
            )}
            data-slot="banner-description"
            variant="p"
            weight="normal"
          >
            {description}
          </Typography>
        )}
      </div>

      {action && (
        <div
          className={cn(
            ACTION_LAYOUT,
            (resolvedVariant === 'horizontalWide' ||
              resolvedVariant === 'diagonalAiry') &&
              GRADIENT_PRIMARY_ACTION,
            actionClassName
          )}
          data-slot="banner-action"
        >
          {action}
        </div>
      )}

      {onDismiss && (
        <button
          aria-label={dismissLabel}
          className={bannerCloseVariants({ variant: resolvedVariant })}
          data-slot="banner-close"
          onClick={onDismiss}
          type="button"
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

Banner.displayName = 'Banner';

export {
  Banner,
  bannerCloseVariants,
  bannerDescriptionVariants,
  bannerIconVariants,
  bannerTitleVariants,
  bannerVariants,
};
