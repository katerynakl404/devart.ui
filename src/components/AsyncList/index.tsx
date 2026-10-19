'use client';

import { type HTMLAttributes, memo, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AsyncListProps<T> {
  items: T[];
  isLoading: boolean;
  isLoadingNextPage: boolean;
  emptyContent: ReactNode;
  loadingContent: ReactNode;
  errorContent?: ReactNode;
  isError?: boolean;
  containerProps?: HTMLAttributes<HTMLDivElement> & {
    [key: `data-${string}`]: string | undefined;
  };
  containerClassName?: string;
  renderItem: (item: T, index: number) => ReactNode;
  /**
   * Replaces the default `items.map(renderItem)` for the populated state.
   *
   * The seam exists so an application can window, group or chunk the rows
   * without this component taking on a virtualization library or a scroll
   * container it does not own. It receives `renderItem` back, so a custom
   * renderer decides *where* rows go while the caller still decides what a row
   * looks like. The four states around it are unaffected.
   */
  renderItems?: (
    items: T[],
    renderItem: (item: T, index: number) => ReactNode
  ) => ReactNode;
}

const AsyncListComponent = <T,>({
  items,
  containerProps,
  containerClassName,
  isLoading,
  isLoadingNextPage,
  loadingContent,
  emptyContent,
  isError,
  errorContent,
  renderItem,
  renderItems,
}: AsyncListProps<T>) => {
  const hasItems = items.length > 0;
  const showEmpty = !hasItems && !isLoading && !isError;
  const showError = !hasItems && !isLoading && isError;
  const showInitialLoading = !hasItems && isLoading;

  // Empty and error replace the list rather than filling it, so they render
  // bare: `group/list` and anything on `containerProps` are absent in those
  // states by design, because there is no list for them to describe.
  if (showEmpty) {
    return emptyContent;
  }

  if (showError) {
    return errorContent;
  }

  return (
    <div
      className={cn(
        'group/list flex flex-1 flex-col gap-2',
        containerClassName
      )}
      {...containerProps}
    >
      {showInitialLoading && loadingContent}
      {hasItems &&
        (renderItems
          ? renderItems(items, renderItem)
          : items.map((item, index) => renderItem(item, index)))}
      {isLoadingNextPage && loadingContent}
    </div>
  );
};

AsyncListComponent.displayName = 'AsyncList';

// Cast preserves the generic signature that `memo` erases.
const AsyncList = memo(AsyncListComponent) as <T>(
  props: AsyncListProps<T>
) => ReactNode;

export { AsyncList, type AsyncListProps };
