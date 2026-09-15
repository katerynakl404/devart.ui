'use client';

import { Title } from '@radix-ui/react-dialog';
import type { ComponentPropsWithRef } from 'react';

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
        className={className}
        {...props}
      />
    </Title>
  );
}

ModalTitle.displayName = 'ModalTitle';
