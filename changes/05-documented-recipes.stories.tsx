import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search, X } from 'lucide-react';
import { Button } from '../src/components/Button';
import { IconButton } from '../src/components/IconButton';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../src/components/InputGroup';
import {
  EmptyStateIllustration,
  StatusView,
} from '../src/components/StatusView';
import { Switch } from '../src/components/Switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/components/Table';
import { ChangeCase, ChangePage, Code } from './Harness';

const meta = {
  title: 'Proposed changes/5. Documented recipes',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CONNECTIONS = [
  { name: 'Production replica', owner: 'katerynak' },
  { name: 'Staging', owner: 'katerynak' },
  { name: 'Analytics EMEA', owner: 'a.melnyk' },
];

function ConnectionsTable({ dense }: { dense?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Connection</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Auto-sync</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {CONNECTIONS.map((row) => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.owner}</TableCell>
            <TableCell>
              <Switch defaultChecked size={dense ? 'sm' : 'default'} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const DocumentedRecipes: Story = {
  name: 'Documented recipes',
  render: () => (
    <ChangePage
      intro="No code changed in any of these four. Each is a place where the documentation was silent or wrong, so every page invented its own answer — which is how two products drift apart without either being wrong."
      title="Documented recipes"
    >
      <ChangeCase
        after={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Connection</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="py-12" colSpan={2}>
                  <StatusView
                    actions={<Button size="sm">Create connection</Button>}
                    description="Connect a data source to give AI access to it"
                    icon={<EmptyStateIllustration />}
                    size="lg"
                    surface="embedded"
                    title="No connections yet"
                    tone="transparent"
                    withIconHalo={false}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        }
        afterNote="StatusView in the row · py-12 on the cell"
        before={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Connection</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={2}>
                  No data
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        }
        beforeNote="h-24 text-center — where the doc stopped"
        beforeSource="the doc's own recipe, which asked for a single row with colSpan and h-24 text-center and said nothing further, so every page improvised the rest."
        files={['src/components/Table/Table.md']}
        footnote={
          <>
            Three things the doc now settles: the empty state lives{' '}
            <em>inside</em> the table, so the header and toolbar stay put; a
            first run and a filtered miss are two different texts; and both
            carry an action, because an empty state is never a dead end.
          </>
        }
        n="Docs · Table.md"
        state="docs-only"
        title="The table's empty state"
        why="The doc described a container and stopped, so the part a user actually reads was left to each page."
      />

      <ChangeCase
        after={<ConnectionsTable dense />}
        afterNote="size=sm — 28×16 in a table row"
        before={<ConnectionsTable />}
        beforeNote="size=default — 36×20"
        beforeSource="the same table with the default toggle, which is the one a page reaches for when nothing says otherwise."
        files={['src/components/Switch/Switch.md']}
        footnote={
          <>
            Both sizes already existed; what was missing was the choice. In a
            table row the default toggle sits a step louder than everything
            around it and pulls the eye off the name it belongs to — you end up
            reading a column of switches instead of a list of connections.{' '}
            <strong className="font-medium text-ink-body">
              sm in a table or dense list row, default in forms and settings.
            </strong>{' '}
            The doc also covers when a toggle should confirm: only when
            switching off has a consequence invisible from where the user
            stands, and then in that direction only.
          </>
        }
        n="Docs · Switch.md"
        state="docs-only"
        title="Which switch size goes where"
        why="Nothing said which of the two sizes a table row takes, so rows got the loud one."
      />

      <ChangeCase
        after={
          <InputGroup className="w-[280px]" label="Search connections">
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput defaultValue="prod" />
            <InputGroupAddon align="inline-end">
              <IconButton aria-label="Clear" size="2xs" variant="tertiary">
                <X />
              </IconButton>
            </InputGroupAddon>
          </InputGroup>
        }
        afterNote='align="inline-end" · IconButton size="2xs"'
        before={
          <InputGroup className="w-[280px]" label="Search connections">
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput defaultValue="prod" />
            <InputGroupAddon>
              <IconButton aria-label="Clear" size="2xs" variant="tertiary">
                <X />
              </IconButton>
            </InputGroupAddon>
          </InputGroup>
        }
        beforeNote="no align — the clear button lands before the input"
        beforeSource={
          <>
            an addon written without an explicit <Code>align</Code>, which
            defaults to <Code>inline-start</Code>. Every search field in the
            prototype had its × sitting next to the magnifier.
          </>
        }
        files={['src/components/InputGroup/InputGroup.md']}
        footnote={
          <>
            The documented recipe is <Code>align="inline-end"</Code> with{' '}
            <Code>IconButton size="2xs"</Code> — a 24px box around a 14px glyph,
            the row-action step. InputGroup's existing{' '}
            <Code>has-[&gt;[data-align=inline-end]]:[&amp;&gt;input]:pr-2</Code>{' '}
            supplies the gap, so nothing else is needed.
          </>
        }
        n="Docs · InputGroup.md"
        state="docs-only"
        title="Where the clear button goes"
        why="The default alignment puts an addon before the input, and nothing in the doc said so."
      />
    </ChangePage>
  ),
};
