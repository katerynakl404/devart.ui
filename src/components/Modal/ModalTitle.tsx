'use client';

import { Title } from '@radix-ui/react-dialog';
import type { ComponentPropsWithRef } from 'react';

import { cn } from '../../lib/utils';
import { Typography } from '../Typography';

interface ModalTitleProps extends ComponentPropsWithRef<typeof Typography> {}

export function ModalTitle({
  className,
  ref,
  align,
  ...props
}: ModalTitleProps) {
  return (
    <Title asChild>
      <Typography
        ref={ref}
        variant="span"
        textStyle="heading20"
        textColor="primary"
        align={align}
        // A name with no spaces (a connection id) breaks instead of running
        // out of the dialog; the title is never truncated.
        className={cn('min-w-0 break-words', className)}
        {...props}
      />
    </Title>
  );
}

ModalTitle.displayName = 'ModalTitle';
