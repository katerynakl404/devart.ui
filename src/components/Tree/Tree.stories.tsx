import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Columns3,
  Database,
  Folder,
  Search,
  Table2,
  TriangleAlert,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../InputGroup';
import { Switch } from '../Switch';
import { Tree, TreeItem, TreeLoadingRow } from './index';

const meta = {
  title: 'Components/Tree',
  component: TreeItem,
  tags: ['autodocs'],
  args: { name: 'sakila' },
  parameters: {
    docs: {
      description: {
        component:
          'A hierarchy read row by row — a data source’s catalogs, schemas, tables and columns. Every row has the same height, the same toggle column and the same right edge at every level; depth changes the indent only, one toggle and its gap (`TREE_INDENT`, 28px) a level, so a level’s +/− starts under the icon above it. Every level carries its icon, and every row keeps the toggle’s slot — empty where it cannot open, a column — so each level’s icon stands one full step in from its parent’s. The whole row opens; `actions` at the right edge never fold it. `query` marks what a search matched (`HighlightText`), `struck` is a node gone from the source, `loading` a name being read again. The tree holds no data: which rows exist and which are open is the caller’s.',
      },
    },
  },
} satisfies Meta<typeof TreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

type Kind = 'catalog' | 'schema' | 'table' | 'column';
interface Node {
  id: string;
  kind: Kind;
  name: string;
  children?: Node[];
  rows?: number;
  deleted?: boolean;
}

const ICON: Record<Kind, ReactNode> = {
  catalog: <Database />,
  schema: <Folder />,
  table: <Table2 />,
  column: <Columns3 />,
};
const LABEL: Partial<Record<Kind, string>> = {
  catalog: 'Catalog',
  schema: 'Schema',
};

const DATA: Node[] = [
  {
    id: 'sakila',
    kind: 'catalog',
    name: 'sakila',
    children: [
      {
        id: 'public',
        kind: 'schema',
        name: 'public',
        children: [
          {
            id: 'actor',
            kind: 'table',
            name: 'actor',
            rows: 200,
            children: [
              'actor_id',
              'first_name',
              'last_name',
              'last_update',
            ].map((c) => ({
              id: `actor.${c}`,
              kind: 'column' as const,
              name: c,
            })),
          },
          { id: 'film', kind: 'table', name: 'film', rows: 1000, children: [] },
          {
            id: 'legacy_payments',
            kind: 'table',
            name: 'legacy_payments',
            deleted: true,
          },
        ],
      },
      {
        id: 'billing',
        kind: 'schema',
        name: 'billing',
        children: [
          {
            id: 'invoices',
            kind: 'table',
            name: 'invoices',
            rows: 12840,
            children: ['invoice_id', 'issued_at', 'total', 'status'].map(
              (c) => ({
                id: `invoices.${c}`,
                kind: 'column' as const,
                name: c,
              })
            ),
          },
        ],
      },
    ],
  },
];

/* Every node, open or not: the caller owns the open set. */
const useOpen = (initial: string[]) => {
  const [open, setOpen] = useState(() => new Set(initial));
  const set = (id: string, next: boolean) =>
    setOpen((s) => {
      const out = new Set(s);
      if (next) out.add(id);
      else out.delete(id);
      return out;
    });
  return { open, set };
};

const Rows = ({
  nodes,
  level,
  open,
  set,
  query = '',
  actions,
}: {
  nodes: Node[];
  level: number;
  open: Set<string>;
  set: (id: string, next: boolean) => void;
  query?: string;
  actions?: (n: Node) => ReactNode;
}) => (
  <>
    {nodes.map((n) => {
      const isOpen = open.has(n.id);
      return (
        <div key={n.id} className="contents">
          <TreeItem
            name={n.name}
            level={level}
            icon={ICON[n.kind]}
            label={LABEL[n.kind]}
            expandable={Boolean(n.children)}
            open={isOpen}
            onOpenChange={(next) => set(n.id, next)}
            query={query}
            struck={n.deleted}
            after={
              n.deleted ? (
                <span className="flex text-fb-attention [&_svg]:size-3.5">
                  <TriangleAlert />
                </span>
              ) : null
            }
            actions={actions?.(n)}
          />
          {isOpen && n.children ? (
            <Rows
              nodes={n.children}
              level={level + 1}
              open={open}
              set={set}
              query={query}
              actions={actions}
            />
          ) : null}
        </div>
      );
    })}
  </>
);

/** A catalog open down to one table's columns: the staircase, an icon on every level. */
export const Default: Story = {
  render: () => {
    const { open, set } = useOpen(['sakila', 'public', 'actor', 'billing']);
    return (
      <Card variant="outline" className="w-[36rem] overflow-clip p-0">
        <Tree inset={24}>
          <Rows nodes={DATA} level={0} open={open} set={set} />
        </Tree>
      </Card>
    );
  },
};

/** The controls at the right edge: a press on them never folds the row. A node gone from the source is struck through. */
export const WithActions: Story = {
  render: () => {
    const { open, set } = useOpen(['sakila', 'public']);
    const [on, setOn] = useState(() => new Set(['sakila', 'public', 'actor']));
    return (
      <Card variant="outline" className="w-[36rem] overflow-clip p-0">
        <Tree inset={24}>
          <TreeItem
            variant="head"
            name="Finance warehouse"
            expandable
            open
            actions={
              <Badge variant="success" size="sm" rounded="full" withDot>
                Active
              </Badge>
            }
          />
          <Rows
            nodes={DATA}
            level={1}
            open={open}
            set={set}
            actions={(n) =>
              n.deleted ? null : (
                <Switch
                  checked={on.has(n.id)}
                  aria-label={`Include ${n.name}`}
                  onCheckedChange={(v) =>
                    setOn((s) => {
                      const out = new Set(s);
                      if (v) out.add(n.id);
                      else out.delete(n.id);
                      return out;
                    })
                  }
                />
              )
            }
          />
        </Tree>
      </Card>
    );
  },
};

/** A search marks what it matched; the caller decides what it keeps (here, everything open). */
export const Searched: Story = {
  render: () => {
    const [query, setQuery] = useState('invo');
    const all = ['sakila', 'public', 'actor', 'billing', 'invoices'];
    const { open, set } = useOpen(all);
    return (
      <div className="flex w-[36rem] flex-col gap-3">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the tree"
          />
        </InputGroup>
        <Card variant="outline" className="overflow-clip p-0">
          <Tree inset={24}>
            <Rows nodes={DATA} level={0} open={open} set={set} query={query} />
          </Tree>
        </Card>
      </div>
    );
  },
};

/** A branch reading its children, and a name being read again. */
export const Loading: Story = {
  render: () => (
    <Card variant="outline" className="w-[36rem] overflow-clip p-0">
      <Tree inset={24}>
        <TreeItem
          name="sakila"
          label="Catalog"
          icon={ICON.catalog}
          expandable
          open
        />
        <TreeItem
          name="public"
          label="Schema"
          icon={ICON.schema}
          level={1}
          expandable
          open
        />
        <TreeLoadingRow level={2} text="Loading tables…" />
        <TreeItem
          name="billing"
          label="Schema"
          icon={ICON.schema}
          level={1}
          expandable
          open
        />
        <TreeItem
          name="invoices"
          icon={ICON.table}
          level={2}
          expandable
          open
          loading
        />
        <TreeLoadingRow level={3} text="Loading columns…" />
      </Tree>
    </Card>
  ),
};
