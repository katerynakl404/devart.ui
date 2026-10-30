import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../../src/components/Switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src/components/Table';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Switch',
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

const ACTIVE_HINT =
  'Inactive connections stop syncing data but keep their configuration.';

/**
 * §160's Before — the row the connection form wrote by hand (prototype
 * `_shared/form.jsx` before 2026-10-27): a bare switch named by `aria-label`,
 * and a text column of its own beside it.
 */
function HandBuiltRow({ disabled }: { disabled?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Switch aria-label="Active" defaultChecked disabled={disabled} />
      <div className="flex flex-col">
        <Typography element="span" textColor="primary" textStyle="title14">
          Active
        </Typography>
        <Typography element="span" textColor="secondary" textStyle="body12">
          {ACTIVE_HINT}
        </Typography>
      </div>
    </div>
  );
}

function DescribedRows({ handBuilt }: { handBuilt?: boolean }) {
  return (
    <TryIt action="Click the word Active">
      <div className="flex w-[320px] flex-col gap-5">
        {handBuilt ? (
          <>
            <HandBuiltRow />
            <HandBuiltRow disabled />
          </>
        ) : (
          <>
            <Switch
              defaultChecked
              description={ACTIVE_HINT}
              label="Active"
              labelPosition="left"
            />
            <Switch
              defaultChecked
              description={ACTIVE_HINT}
              disabled
              label="Active"
              labelPosition="left"
            />
          </>
        )}
      </div>
    </TryIt>
  );
}

export const Page: Story = {
  name: 'Switch',
  render: () => (
    <ChangePage group="Switch" title="Switch">
      <ChangeCase
        after={<DescribedRows />}
        afterNote="description — a <label>, and the switch's aria-describedby"
        before={<DescribedRows handBuilt />}
        beforeNote="a bare switch and a text column beside it"
        beforeSource={
          <>
            the row the connection form had to write — the switch named by{' '}
            <Code>aria-label</Code>, its own column of two{' '}
            <Code>Typography</Code> spans beside it — copied from the
            prototype's <Code>_shared/form.jsx</Code> as it stood before the
            prop. The second row is the same markup with <Code>disabled</Code>{' '}
            on the switch.
          </>
        }
        files={['src/components/Switch/index.tsx']}
        footnote={
          <>
            The hand-built row picked its own type — a 600 title in{' '}
            <Code>--ink-primary</Code> where the switch's label is 500 in{' '}
            <Code>--ink-body</Code> — and its words were text, not a label:
            clicking them did nothing, and a screen reader heard "Active,
            switch" with no description. The description is <Code>body12</Code>{' '}
            in <Code>--ink-secondary</Code>, 2px under the label, and fades with
            it when the switch is disabled.
          </>
        }
        n={160}
        state="draft"
        title="Switch — description"
        why="A label with an explanation under it had no place on the switch, so the form built the row twice by hand — and a hand-built row knows nothing of the switch it sits beside."
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
    </ChangePage>
  ),
};
