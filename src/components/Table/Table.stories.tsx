import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { cn } from '../../lib/utils';
import { Checkbox } from '../Checkbox';
import { IconButton } from '../IconButton';
import { Spinner } from '../Spinner';
import { Typography } from '../Typography';
import {
  Table,
  TableActionsCell,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './index';
import type { TableSortDirection } from './TableHead';

interface InvoiceRow {
  id: string;
  invoice: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: string;
  amount: string;
}

const invoices: InvoiceRow[] = [
  {
    id: 'INV001',
    invoice: 'INV001',
    status: 'Paid',
    method: 'Credit Card',
    amount: '$250.00',
  },
  {
    id: 'INV002',
    invoice: 'INV002',
    status: 'Pending',
    method: 'PayPal',
    amount: '$150.00',
  },
  {
    id: 'INV003',
    invoice: 'INV003',
    status: 'Overdue',
    method: 'Bank Transfer',
    amount: '$350.00',
  },
  {
    id: 'INV004',
    invoice: 'INV004',
    status: 'Paid',
    method: 'Credit Card',
    amount: '$450.00',
  },
  {
    id: 'INV005',
    invoice: 'INV005',
    status: 'Paid',
    method: 'PayPal',
    amount: '$550.00',
  },
  {
    id: 'INV006',
    invoice: 'INV006',
    status: 'Pending',
    method: 'Bank Transfer',
    amount: '$200.00',
  },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    wrapperClassName: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.invoice}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithFooterAndCaption: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.invoice}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$1,950.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// The selected/hover states live on body rows via `data-state=selected`.
export const SelectableRows: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>('INV002');
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row) => (
            <TableRow
              key={row.id}
              data-interactive
              data-state={selected === row.id ? 'selected' : undefined}
              className="cursor-pointer"
              onClick={() => setSelected(row.id)}
            >
              <TableCell className="font-medium">{row.invoice}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell className="text-right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// Row hover / focus / press / selected fills: the consuming row wrapper sets
// `data-interactive` (clickable rows) and the `is-selected` class.
export const InteractiveRows: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>('INV002');
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row) => (
            <TableRow
              key={row.id}
              data-interactive
              className={cn(
                'cursor-pointer focus-visible:outline-none',
                selected === row.id && 'is-selected'
              )}
              tabIndex={0}
              onClick={() => setSelected(row.id)}
            >
              <TableCell className="font-medium">{row.invoice}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell className="text-right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// TableHead exposes `sortable`, `sortDirection` ('asc' | 'desc' | undefined) and `onSort`.
export const SortableHeader: Story = {
  render: (args) => {
    const [direction, setDirection] = useState<TableSortDirection>('asc');
    const onSort = fn(() =>
      setDirection((prev) =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? undefined : 'asc'
      )
    );
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={direction} onSort={onSort}>
              Invoice
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.invoice}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell className="text-right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

/**
 * Row actions live in a `TableActionsCell`: a fixed 48px column, right-aligned,
 * that fades its buttons in on row hover or keyboard focus. The width is held
 * whether or not they are showing, so nothing reflows under the pointer.
 *
 * Size row actions `2xs` — a 24px box around a 14px glyph, one step below the
 * shared Button/IconButton ladder.
 */
export const WithRowActions: Story = {
  render: (args) => (
    <Table {...args} layout="fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Invoice</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="w-28 text-right">Amount</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 4).map((row) => (
          <TableRow key={row.id} data-interactive>
            <TableCell className="font-medium">{row.invoice}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
            <TableActionsCell>
              <IconButton
                aria-label={`More actions for ${row.invoice}`}
                size="2xs"
                variant="tertiary"
              >
                <MoreHorizontal />
              </IconButton>
            </TableActionsCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * `reveal={false}` keeps the actions visible at rest — right for a table whose
 * actions are the point rather than a secondary affordance.
 */
export const AlwaysVisibleActions: Story = {
  render: (args) => (
    <Table {...args} layout="fixed">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead className="w-28 text-right">Amount</TableHead>
          <TableHead className="w-20">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 3).map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.invoice}</TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
            <TableActionsCell className="w-20" reveal={false}>
              <IconButton
                aria-label={`Edit ${row.invoice}`}
                size="2xs"
                variant="tertiary"
              >
                <Pencil />
              </IconButton>
              <IconButton
                aria-label={`Delete ${row.invoice}`}
                size="2xs"
                variant="destructiveTertiary"
              >
                <Trash2 />
              </IconButton>
            </TableActionsCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/**
 * `layout="fixed"` takes the column widths from the first row and never
 * re-measures. Without it the browser sizes each column from its own content,
 * so the same table re-flows every time the data changes — a wider value, a
 * filtered page, or the `colSpan` row an empty/loading state renders. Both
 * tables below hold the same columns; only the fixed one still lines up.
 */
export const FixedLayout: Story = {
  render: (args) => {
    const rows = (
      <>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">
            INV002 — annual renewal, EMEA
          </TableCell>
          <TableCell>Pending</TableCell>
          <TableCell className="text-right">$1,150.00</TableCell>
        </TableRow>
      </>
    );
    const head = (
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2">Invoice</TableHead>
          <TableHead className="w-32">Status</TableHead>
          <TableHead className="w-32 text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
    );
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Typography textColor="secondary" textStyle="overline">
            layout="fixed" — columns hold
          </Typography>
          <Table {...args} layout="fixed">
            {head}
            <TableBody>{rows}</TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-1.5">
          <Typography textColor="secondary" textStyle="overline">
            layout="auto" — the widest cell wins
          </Typography>
          <Table {...args}>
            {head}
            <TableBody>{rows}</TableBody>
          </Table>
        </div>
      </div>
    );
  },
};

/**
 * Select-all with checkboxes. `Table` holds no state of its own, so the
 * selection lives in the consumer — but the three-state wiring is always the
 * same, and getting it wrong is what makes a header checkbox look decorative.
 *
 * The header checkbox is `checked` when every row is selected, the string
 * `"indeterminate"` when only some are, and `false` when none are. Radix uses
 * that literal — not a separate `indeterminate` boolean — so a plain
 * `checked={someSelected}` silently collapses the partial state and the
 * header reads as "none selected" while rows are in fact selected.
 *
 * Toggling it selects every row or clears them all; it never inverts
 * per-row.
 */
export const SelectAll: Story = {
  render: (args) => {
    // noUncheckedIndexedAccess is on — index access is T | undefined.
    const [selected, setSelected] = useState<string[]>(() =>
      invoices.slice(1, 2).map((r) => r.id)
    );
    const allSelected = selected.length === invoices.length;
    const someSelected = selected.length > 0 && !allSelected;
    const toggleRow = (id: string) =>
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    return (
      <Table {...args} layout="fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                aria-label="Select all invoices"
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={(next) =>
                  setSelected(next === true ? invoices.map((r) => r.id) : [])
                }
              />
            </TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-28 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row) => {
            const isSelected = selected.includes(row.id);
            return (
              <TableRow
                key={row.id}
                data-interactive
                data-state={isSelected ? 'selected' : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${row.invoice}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleRow(row.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.invoice}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell className="text-right">{row.amount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  },
};

export const Empty: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            <Typography textColor="secondary">No invoices found.</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            <div className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              <Typography textColor="secondary">Loading invoices…</Typography>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Default', Default],
      ['With Footer And Caption', WithFooterAndCaption],
      ['Selectable Rows', SelectableRows],
      ['Interactive Rows', InteractiveRows],
      ['Sortable Header', SortableHeader],
      ['With Row Actions', WithRowActions],
      ['Always Visible Actions', AlwaysVisibleActions],
      ['Fixed Layout', FixedLayout],
      ['Select All', SelectAll],
      ['Empty', Empty],
      ['Loading', Loading],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render ? (
              story.render({ ...args, ...story.args } as never, ctx)
            ) : (
              null
            )}
          </section>
        ))}
      </div>
    );
  },
} as Story;
