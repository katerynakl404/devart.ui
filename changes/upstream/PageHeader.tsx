'use client';

/**
 * The developers' `PageHeader`, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/PageHeader/index.tsx`, import paths alone changed.
 * The Before half of the PageHeader page renders this file, so it is the
 * component the developer storybook ships, not a drawing of it. Not edited:
 * replace it whole when the base moves.
 */

import type { ReactNode } from 'react';
import { Typography } from '../../src/components/Typography';
import { cn } from '../../src/lib/utils';

interface PageHeaderProps {
  title: string;
  /** Content immediately before the title (e.g. a leading icon). */
  titleLeft?: ReactNode;
  /** Content immediately after the title (e.g. an info control). */
  titleRight?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Title row of a page, with optional actions aligned to the far edge. */
const PageHeader = ({
  title,
  titleLeft,
  titleRight,
  actions,
  className,
}: PageHeaderProps) => (
  <div className={cn('mb-2 flex flex-col gap-2', className)}>
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2">
        {titleLeft ? titleLeft : null}

        <Typography variant="h2">{title}</Typography>

        {titleRight ? titleRight : null}
      </div>

      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  </div>
);

PageHeader.displayName = 'PageHeader';

export { PageHeader, type PageHeaderProps };
