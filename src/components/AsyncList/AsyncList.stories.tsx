import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloudOff, EllipsisVertical, FileText, Inbox } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { fn } from 'storybook/test';
import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { IconButton } from '../IconButton';
import { ListSelectionBar } from '../ListSelectionBar';
import { SelectableListCard } from '../SelectableListCard';
import { Skeleton } from '../Skeleton';
import { StatusView } from '../StatusView';
import { TooltipProvider } from '../Tooltip';
import { Typography } from '../Typography';
import { AsyncList } from './index';

interface Row {
  id: string;
  name: string;
}

const rows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `row-${index + 1}`,
    name: `Document ${index + 1}.pdf`,
  }));

/** `StoryObj` erases the component's generic, so these stay typed here. */
const SELECTION_ITEMS = rows(8);

const RowItem = ({ name }: Row) => (
  <div className="flex h-11 items-center gap-2 rounded-lg border border-stroke bg-surface-card px-3">
    <FileText className="size-4 shrink-0 text-brand-tertiary" />
    <Typography variant="span" textColor="body" className="truncate">
      {name}
    </Typography>
  </div>
);

const skeletons = (
  <>
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton key={`skeleton-${index + 1}`} className="h-11 w-full" />
    ))}
  </>
);

const emptyView = (
  <StatusView
    surface="embedded"
    icon={<Inbox aria-hidden="true" />}
    title="Nothing here yet"
    description="Documents you add will show up in this list."
  />
);

const errorView = (
  <StatusView
    tone="error"
    surface="embedded"
    icon={<CloudOff aria-hidden="true" />}
    title="Could not load documents"
    description="Check your connection and try again."
    retryLabel="Retry"
    onRetry={fn()}
  />
);

/**
 * `AsyncList` resolves the four states a remote list can be in — empty, error,
 * first load, loading another page — and renders the rows in between.
 *
 * It knows nothing about data fetching: items and flags arrive as props. Empty
 * and error replace the list rather than filling it, so they render bare, and
 * `containerClassName` / `containerProps` do not apply in those two states.
 * `isError` is only consulted while the list is empty, so a populated list
 * keeps its rows when a refetch fails.
 *
 * Rows are laid out by `renderItems` when the caller supplies one — that is
 * where windowing, chunking or grouping belongs, so this component needs no
 * virtualization library and no scroll container of its own.
 */
const meta = {
  title: 'Components/AsyncList',
  component: AsyncList,
  tags: ['autodocs'],
  args: {
    items: rows(6),
    isLoading: false,
    isLoadingNextPage: false,
    isError: false,
    loadingContent: skeletons,
    emptyContent: emptyView,
    errorContent: errorView,
    renderItem: (item: Row) => <RowItem key={item.id} {...item} />,
  },
  argTypes: {
    items: { control: false },
    renderItem: { control: false },
    renderItems: { control: false },
    loadingContent: { control: false },
    emptyContent: { control: false },
    errorContent: { control: false },
    containerProps: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AsyncList<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InitialLoading: Story = {
  args: { items: [], isLoading: true },
};

/** Items stay on screen while the next page arrives. */
export const LoadingNextPage: Story = {
  args: { isLoadingNextPage: true },
};

export const Empty: Story = {
  args: { items: [] },
};

/** `isError` is only consulted while the list is empty. */
export const ErrorState: Story = {
  args: { items: [], isError: true },
};

/** `containerClassName` replaces the default column with any layout. */
export const GridLayout: Story = {
  args: {
    items: rows(9),
    containerClassName:
      'grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3',
  },
};

/**
 * Selection like the app: enter via row ⋮ → Select. Card click only toggles
 * once something is already selected; otherwise it is an "open" action.
 */
export const WithSelection: Story = {
  args: { items: SELECTION_ITEMS },
  // `renderItems` is dropped from the spread: `StoryObj` types it against
  // `unknown`, which would fight the explicit `Row` below.
  render: ({ renderItems: _renderItems, ...args }) => {
    const items = SELECTION_ITEMS;
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const hasSelection = selected.size > 0;
    // Menu item click can "fall through" onto the card underneath once the
    // portal closes — that second toggle would undo Select/Deselect.
    const skipCardClickRef = useRef(false);

    const toggle = useCallback((id: string) => {
      setSelected((previous) => {
        const next = new Set(previous);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }, []);

    const selectFromMenu = useCallback(
      (id: string) => {
        skipCardClickRef.current = true;
        toggle(id);
        window.setTimeout(() => {
          skipCardClickRef.current = false;
        }, 0);
      },
      [toggle]
    );

    return (
      <TooltipProvider>
        <div className="flex flex-col gap-3">
          <ListSelectionBar
            title={`${items.length} documents`}
            selectedText={`${selected.size} selected`}
            isPending={false}
            selectedCount={selected.size}
            allSelected={selected.size === items.length}
            onSelectAll={() => setSelected(new Set(items.map((i) => i.id)))}
            onClearSelection={() => setSelected(new Set())}
          />

          <AsyncList<Row>
            {...args}
            items={items}
            containerClassName="gap-1.5"
            containerProps={{
              'data-has-selection': hasSelection ? 'true' : undefined,
            }}
            renderItem={(item: Row) => {
              const isSelected = selected.has(item.id);

              return (
                <SelectableListCard
                  key={item.id}
                  layout="row"
                  isSelected={isSelected}
                  checkboxAriaLabel={`Select ${item.name}`}
                  cardClassName="justify-between"
                  cardContent={
                    <Typography
                      variant="span"
                      textColor="body"
                      className="min-w-0 flex-1 truncate"
                    >
                      {item.name}
                    </Typography>
                  }
                  rightSlot={
                    <div
                      className={cn(
                        'ms-auto flex-none transition-opacity duration-150',
                        'lg:pointer-events-none lg:opacity-0',
                        'lg:group-hover/row:pointer-events-auto lg:group-hover/row:opacity-100',
                        'lg:group-focus-within/row:pointer-events-auto lg:group-focus-within/row:opacity-100',
                        'lg:[&:has([data-state=open])]:pointer-events-auto lg:[&:has([data-state=open])]:opacity-100'
                      )}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            variant="tertiary"
                            size="2xs"
                            rounded="rounded"
                            aria-label={`Actions for ${item.name}`}
                            className="text-ink-secondary"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <EllipsisVertical />
                          </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="min-w-28"
                          onCloseAutoFocus={(event) => event.preventDefault()}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <DropdownMenuItem
                            onClick={(event) => event.stopPropagation()}
                            onSelect={() => selectFromMenu(item.id)}
                          >
                            {isSelected ? 'Deselect' : 'Select'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  }
                  onCheckboxToggle={() => toggle(item.id)}
                  onCardClick={() => {
                    if (skipCardClickRef.current) return;
                    if (isSelected || hasSelection) {
                      toggle(item.id);
                    }
                  }}
                />
              );
            }}
          />
        </div>
      </TooltipProvider>
    );
  },
};
