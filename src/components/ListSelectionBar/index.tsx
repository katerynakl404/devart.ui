'use client';

import { X } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Skeleton } from '../Skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { Typography } from '../Typography';

const DEFAULT_SELECT_ALL_LABEL = 'Select all';
const DEFAULT_DESELECT_ALL_LABEL = 'Deselect all';
const DEFAULT_EXIT_SELECTION_LABEL = 'Exit selection';

interface ListSelectionBarProps {
  className?: string;
  style?: CSSProperties;
  /** Caption shown while nothing is selected, e.g. "24 files". */
  title: string;
  /** Caption shown while something is selected, e.g. "3 selected". */
  selectedText: string;
  isPending: boolean;
  selectedCount: number;
  allSelected: boolean;
  isEmpty?: boolean;
  sticky?: boolean;
  /**
   * CSS length for the sticky `top` offset — a page whose header is itself
   * sticky passes its height here. Taking a length rather than reading a
   * custom property keeps the page's layout variables out of this component's
   * contract.
   */
  stickyOffset?: string;
  selectAllLabel?: string;
  deselectAllLabel?: string;
  exitSelectionLabel?: string;
  rightSlot?: ReactNode;
  onClearSelection: () => void;
  onSelectAll?: () => void;
}

/**
 * Header for a multi-select list: a count that swaps for the selection count,
 * a select-all/deselect-all toggle, caller-supplied actions, and an exit
 * control that appears only while a selection is active.
 */
const ListSelectionBar = ({
  className,
  style,
  title,
  selectedText,
  isPending,
  selectedCount,
  allSelected,
  isEmpty = false,
  sticky = false,
  stickyOffset,
  selectAllLabel = DEFAULT_SELECT_ALL_LABEL,
  deselectAllLabel = DEFAULT_DESELECT_ALL_LABEL,
  exitSelectionLabel = DEFAULT_EXIT_SELECTION_LABEL,
  rightSlot,
  onClearSelection,
  onSelectAll,
}: ListSelectionBarProps) => {
  const isSelecting = selectedCount > 0;
  const toggleSelectAll = isSelecting && allSelected;

  return (
    <div
      className={cn(
        'flex min-h-[37px] items-center gap-3',
        sticky && 'sticky z-10 bg-surface-page',
        className
      )}
      style={sticky ? { top: stickyOffset ?? 0, ...style } : style}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton isLoaded={!isPending}>
          <Typography
            variant="span"
            textColor="secondary"
            weight="normal"
            noWrap
          >
            {isSelecting ? selectedText : title}
          </Typography>
        </Skeleton>

        {!isPending && (
          <Button
            variant="transparent"
            size="sm"
            className={cn(
              'font-medium text-ink-highlight',
              'decoration-1 underline-offset-2 hover:underline',
              'disabled:text-ink-inactive disabled:no-underline'
            )}
            disabled={!isSelecting && isEmpty}
            onClick={toggleSelectAll ? onClearSelection : onSelectAll}
          >
            {toggleSelectAll ? deselectAllLabel : selectAllLabel}
          </Button>
        )}
      </div>

      {!isPending && (rightSlot || isSelecting) && (
        <div className="ml-auto flex items-center gap-3">
          {rightSlot}

          {isSelecting && (
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  variant="tertiary"
                  size="2xs"
                  rounded="rounded"
                  className="text-ink-secondary hover:bg-brand-primary/[0.06] hover:text-ink-body [&_svg]:size-3.5"
                  aria-label={exitSelectionLabel}
                  onClick={onClearSelection}
                >
                  <X />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent side="top">{exitSelectionLabel}</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

ListSelectionBar.displayName = 'ListSelectionBar';

export { ListSelectionBar, type ListSelectionBarProps };
