'use client';

import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';

export interface SidebarMenuRowProps {
  icon?: LucideIcon;
  label: string;
  isExternal?: boolean;
  trailingSlot?: ReactNode;
  className?: string;
  onSelect?: () => void;
}

/**
 * A row in the sidebar footer's menu — the popover the account row opens:
 * leading icon, left-aligned label, optional trailing affordance.
 *
 * It renders a `<button>` and never a link, because the kit has no router — a
 * row that navigates is wrapped in the consumer's own anchor, and `isExternal`
 * only draws the outbound arrow rather than opening anything. `trailingSlot`
 * takes the arrow's place when given.
 *
 * `tertiary` is this package's neutral ghost: transparent at rest, `State/Hover`
 * and `State/Pressed` fills, `Text/Body` ink — the kit's `.sbx-pop-item`.
 */
const SidebarMenuRow = ({
  icon: Icon,
  label,
  isExternal = false,
  trailingSlot,
  className,
  onSelect,
}: SidebarMenuRowProps) => (
  <Button
    variant="tertiary"
    size="sm"
    align="left"
    fullWidth
    leftSlot={Icon && <Icon className="text-ink-secondary" />}
    rightSlot={
      trailingSlot ??
      (isExternal && (
        <ArrowUpRight className="ms-auto size-3.5 text-ink-secondary" />
      ))
    }
    onClick={onSelect}
    className={cn('max-h-8 gap-2.5 px-2 py-1.5 font-normal', className)}
  >
    {label}
  </Button>
);

SidebarMenuRow.displayName = 'SidebarMenuRow';

export { SidebarMenuRow };
