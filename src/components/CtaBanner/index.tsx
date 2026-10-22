'use client';

import type { ReactNode, Ref } from 'react';
import { Banner, type BannerProps } from '../Banner';
import { Button, type ButtonProps } from '../Button';

interface CtaBannerProps {
  title: string;
  description?: ReactNode;
  ctaLabel: string;
  variant?: BannerProps['variant'];
  actionVariant?: ButtonProps['variant'];
  size?: BannerProps['size'];
  icon?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  onClick: () => void;
}

/**
 * A `Banner` with a single call-to-action button in its action slot. On the
 * `horizontalWide` and `diagonalAiry` gradients the button is recoloured by
 * `Banner` itself, so it reads on the gradient whatever `actionVariant` is.
 */
function CtaBanner({
  title,
  description,
  ctaLabel,
  variant = 'horizontalWide',
  actionVariant = 'primary',
  size,
  icon,
  className,
  ref,
  onClick,
}: CtaBannerProps) {
  return (
    <Banner
      ref={ref}
      variant={variant}
      title={title}
      description={description}
      icon={icon}
      size={size}
      className={className}
      action={
        <Button variant={actionVariant} size="sm" onClick={onClick}>
          {ctaLabel}
        </Button>
      }
    />
  );
}

export { CtaBanner, type CtaBannerProps };
