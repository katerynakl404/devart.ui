'use client';

import { FileIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { onButtonKeyDown } from '../../lib/button-keyboard';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { ProgressBar } from '../ProgressBar';
import { Typography } from '../Typography';
import { FileRightSlot } from './FileRightSlot';
import { FileSkeleton, type FileSkeletonProps } from './FileSkeleton';

const fileVariants = cva(
  'flex min-w-0 items-center justify-between gap-2 border',
  {
    variants: {
      variant: {
        // Kit: 1px `--border` outline on a `--card` surface.
        default: 'border-stroke bg-surface-card',
        tertiary: cn(
          'border-transparent bg-transparent text-ink-body',
          'transition-colors duration-fast',
          'hover:bg-state-hover',
          'active:bg-state-pressed'
        ),
      },
      // Kit padding is 4px 8px -> py-1 px-2 (was px-2.5 / 10px).
      size: {
        xs: 'min-h-7 px-2 py-1 text-xs [&_svg]:size-3',
        sm: 'min-h-8 px-2 py-1 text-sm [&_svg]:size-4',
        md: 'min-h-9 px-2 py-1 text-sm',
        lg: 'min-h-10 px-2 py-1 text-sm',
        xl: 'min-h-11 px-2 py-1 text-sm',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        rounded: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'sm',
    },
  }
);

interface FileProps extends VariantProps<typeof fileVariants> {
  className?: string;
  name: string;
  fileSize?: string;
  /** Upload progress 0–100; when set, replaces the `fileSize` caption with a progress bar. */
  progress?: number;
  isLoading?: boolean;
  isError?: boolean;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  onClick?: () => void;
  onDismiss?: () => void;
  onRetry?: () => void;
}

function File({
  className,
  name,
  fileSize,
  progress,
  variant,
  size,
  rounded,
  isLoading,
  isError = false,
  icon: iconProp,
  rightSlot: rightSlotProp,
  onClick,
  onDismiss,
  onRetry,
}: FileProps) {
  const Icon = iconProp ?? <FileIcon className="size-6 text-brand-tertiary" />;

  return (
    <div
      className={cn(
        fileVariants({ variant, size, rounded }),
        isLoading && 'pointer-events-none',
        isError &&
          'border-fb-red/20 bg-fb-red/5 ring-fb-red/20 [&_svg]:text-fb-red-text/75',
        // Kit: an interactive chip gets State/Hover on hover and State/Pressed
        // while held. Skipped on error so the red tint is not overpainted.
        // Pressed follows the content area, which is the row's action — a
        // press on retry or dismiss is not a press on the row.
        onClick &&
          !isError &&
          'transition-colors duration-fast hover:bg-state-hover has-[[data-slot=file-action]:active]:bg-state-pressed',
        // The ring still frames the whole chip; focus itself lands on the
        // content area below, so the chip reads it through `:has()`.
        onClick &&
          'has-[[data-slot=file-action]:focus-visible]:ring-2 has-[[data-slot=file-action]:focus-visible]:ring-focus-ring-brand has-[[data-slot=file-action]:focus-visible]:ring-offset-2',
        className
      )}
    >
      {/* The row's own action sits on the content area, a sibling of the
          retry / dismiss controls rather than their parent: a button that
          contains buttons is unreachable for assistive technology. */}
      <div
        data-slot={onClick ? 'file-action' : undefined}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2',
          onClick && 'cursor-pointer focus-visible:outline-none'
        )}
        onClick={onClick}
        onKeyDown={onClick ? onButtonKeyDown(onClick) : undefined}
      >
        {Icon}

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Typography
            variant="span"
            textColor="body"
            weight="medium"
            className="min-w-0 truncate"
          >
            {name}
          </Typography>

          {progress !== undefined ? (
            <span className="flex h-4 min-w-0 items-center gap-2">
              <ProgressBar
                value={progress}
                size="md"
                className="min-w-0 flex-1"
                aria-label={name}
              />
              <Typography
                variant="span"
                textColor="secondary"
                className="shrink-0 text-xs tabular-nums leading-4"
              >
                {progress}%
              </Typography>
            </span>
          ) : (
            fileSize && (
              <Typography
                variant="span"
                textColor="secondary"
                className="min-w-0 truncate text-xs leading-4"
              >
                {fileSize}
              </Typography>
            )
          )}
        </div>
      </div>

      <FileRightSlot
        slot={rightSlotProp}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        onDismiss={onDismiss}
      />
    </div>
  );
}

export {
  File,
  type FileProps,
  FileSkeleton,
  type FileSkeletonProps,
  fileVariants,
};
