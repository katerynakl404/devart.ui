import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../InputGroup';
import { Typography } from '../Typography';
import { HighlightText } from './index';

const meta = {
  title: 'Components/HighlightText',
  component: HighlightText,
  tags: ['autodocs'],
  args: { text: 'invoice_items', query: 'invo' },
  argTypes: {
    text: { control: 'text' },
    query: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The part of a name a search matched, marked where the name is shown. For a tree, or text long enough to hide the match — not a flat list of short names filtered by name, where the filter already says why a row stayed. A highlighter: the `brand` badge’s fill (`--badge-brand-bg`) under the name’s own ink, one weight step up (`font-medium`) so it does not rest on colour alone; AA in both themes. Every occurrence, case-insensitive, plain substring — the same test that kept the row. An empty query renders the text as it is.',
      },
    },
  },
} satisfies Meta<typeof HighlightText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Typography element="span" textStyle="body14" textColor="primary">
      <HighlightText {...args} />
    </Typography>
  ),
};

/* A schema, its tables, their columns — depth, name. */
const TREE: [number, string][] = [
  [0, 'billing'],
  [1, 'invoices'],
  [2, 'invoice_id'],
  [2, 'issued_at'],
  [1, 'payments'],
  [2, 'payment_id'],
  [2, 'invoice_ref'],
  [1, 'refunds'],
  [2, 'refund_id'],
];

/** A tree as a search narrows it: each match stays with the path above it,
 *  and the mark is what tells the matching rows from the rows that place them. */
export const InATree: Story = {
  render: () => {
    const [query, setQuery] = useState('invo');
    const q = query.trim().toLowerCase();
    const hits = TREE.map(([, name]) => name.toLowerCase().includes(q));
    /* A row stays when it matches, or when a deeper row under it does. */
    const kept = TREE.map(([depth], i) => {
      if (!q || hits[i]) return true;
      for (let j = i + 1; j < TREE.length; j += 1) {
        const row = TREE[j];
        if (!row || row[0] <= depth) break;
        if (hits[j]) return true;
      }
      return false;
    });
    return (
      <div className="flex w-80 flex-col gap-3">
        <InputGroup size="sm" variant="outline">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the schema"
          />
        </InputGroup>
        <ul className="flex flex-col rounded-lg border border-stroke">
          {TREE.map(([depth, name], i) =>
            kept[i] ? (
              <li
                key={name}
                className="border-stroke border-b py-2.5 pe-4 last:border-b-0"
                style={{ paddingInlineStart: 16 + depth * 20 }}
              >
                <Typography
                  element="span"
                  textStyle="body14"
                  textColor="primary"
                >
                  <HighlightText text={name} query={query} />
                </Typography>
              </li>
            ) : null
          )}
        </ul>
      </div>
    );
  },
};
