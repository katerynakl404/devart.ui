'use client';

import * as ModalPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps, ComponentPropsWithRef } from 'react';

import { cn } from '../../lib/utils';
import { DialogTitleFallback } from '../DialogTitleFallback';
import { IconButton } from '../IconButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../Tooltip';
import { ModalClose } from './ModalClose';
import { ModalOverlay } from './ModalOverlay';
import { ModalPortal } from './ModalPortal';

const DEFAULT_CLOSE_LABEL = 'Close';

interface ModalContentProps
  extends ComponentPropsWithRef<typeof ModalPrimitive.Content> {
  isCloseButtonVisible?: boolean;
  closeButtonProps?: ComponentProps<typeof IconButton>;
}

export function ModalContent({
  ref,
  className,
  children,
  isCloseButtonVisible = true,
  closeButtonProps,
  ...props
}: ModalContentProps) {
  const {
    className: closeButtonClassName,
    'aria-label': closeLabel = DEFAULT_CLOSE_LABEL,
    ...restCloseButtonProps
  } = closeButtonProps ?? {};

  return (
    <ModalPortal>
      <ModalOverlay />
      <ModalPrimitive.Content
        ref={ref}
        aria-describedby={undefined}
        className={cn(
          'flex max-h-[90dvh] max-w-lg flex-col',
          'fixed top-1/2 left-1/2 z-[100] w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2',
          'rounded-lg',
          // Own compositing layer: without it a partial repaint inside the
          // dialog (e.g. the close button's hover transition) re-rasterizes
          // with a rectangular clip and square child corners leak over the
          // rounded ones. `transform-gpu` keeps the centering translate.
          'transform-gpu [backface-visibility:hidden]',
          'border border-stroke',
          'bg-surface-card p-4 shadow-lg duration-200',

          // Closed state
          'data-[state=closed]:fade-out-0',
          'data-[state=closed]:slide-out-to-left-1/2',
          'data-[state=closed]:zoom-out-95',
          'data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=closed]:animate-out',

          // Opened state
          'data-[state=open]:fade-in-0',
          'data-[state=open]:zoom-in-95',
          'data-[state=open]:slide-in-from-left-1/2',
          'data-[state=open]:slide-in-from-top-[48%]',
          'data-[state=open]:animate-in',
          className
        )}
        {...props}
      >
        {children}
        <DialogTitleFallback>{props['aria-label']}</DialogTitleFallback>
        {isCloseButtonVisible && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModalClose asChild>
                  <IconButton
                    variant="tertiary"
                    size="sm"
                    rounded="md"
                    className={cn(
                      'absolute top-4 right-4',
                      closeButtonClassName
                    )}
                    {...restCloseButtonProps}
                    aria-label={closeLabel}
                  >
                    <X />
                  </IconButton>
                </ModalClose>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="z-[110]">
                {closeLabel}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </ModalPrimitive.Content>
    </ModalPortal>
  );
}

ModalContent.displayName = 'ModalContent';
