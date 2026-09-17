'use client';

import { ArrowLeft } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

export interface PageHeaderProps extends Omit<ComponentProps<'header'>, 'title'> {
  /** The page's one `h1`. */
  title: ReactNode;
  /** Renders the back control. Omit it on a top-level page. */
  onBack?: () => void;
  /** Accessible name for the back control. */
  backLabel?: string;
  /** Trailing actions, pushed to the end of the row. */
  actions?: ReactNode;
  /** Slot between the back control and the title — a breadcrumb, a logo. */
  leading?: ReactNode;
}

/**
 * The title row every screen starts with: an optional back control, the page's
 * `h1`, and trailing actions.
 *
 * Two details are what make it read as one unit rather than three parts:
 *
 * - **The back arrow is a 20px glyph**, not the 16px used inside dense
 *   controls. It sits beside a `title24`, and a 16px arrow reads as a stray
 *   icon rather than the page's own control.
 * - **The arrow is 8px from the title**, while everything else in the row is
 *   12px apart. The arrow belongs to the title — it is not a sibling of it, and
 *   the tighter gap is what says so.
 */
function PageHeader({
  title,
  onBack,
  backLabel = 'Back',
  actions,
  leading,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn('flex shrink-0 items-center gap-3 px-6 py-5', className)}
      {...props}
    >
      {leading}

      {onBack ? (
        <div className="flex min-w-0 items-center gap-2">
          <IconButton aria-label={backLabel} size="sm" variant="tertiary" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </IconButton>
          <Typography element="h1" textStyle="title24" textColor="primary" className="truncate">
            {title}
          </Typography>
        </div>
      ) : (
        <Typography element="h1" textStyle="title24" textColor="primary" className="truncate">
          {title}
        </Typography>
      )}

      {actions ? <div className="ms-auto flex items-center gap-3">{actions}</div> : null}
    </header>
  );
}

export { PageHeader };
