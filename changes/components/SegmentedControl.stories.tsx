import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '../../src/components/SegmentedControl';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/SegmentedControl',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** One row of a connection-scope tree — what §73 was raised on. */
const SCOPE = [
  { name: 'sales.orders', value: 'in' },
  { name: 'sales.customers', value: 'in' },
  { name: 'hr.salaries', value: 'out' },
  { name: 'sales.invoices', value: 'in' },
  { name: 'sales.regions', value: 'in' },
  { name: 'hr.reviews', value: 'out' },
];

/** A Permissions tree: `''` is a row that takes the workspace's Allow. */
const PERMISSIONS = [
  { name: 'sales.orders', value: '' },
  { name: 'sales.customers', value: 'deny' },
  { name: 'hr.salaries', value: '' },
  { name: 'sales.invoices', value: 'allow' },
];

function RowName({ children }: { children: string }) {
  return (
    <Typography element="span" textColor="body" textStyle="body14">
      {children}
    </Typography>
  );
}

/** §73 — a column read down at a glance. `toned` is the only difference. */
function ScopeColumn({ toned }: { toned?: boolean }) {
  return (
    <div className="flex w-[300px] flex-col gap-2">
      {SCOPE.map((row) => (
        <div className="flex items-center justify-between gap-4" key={row.name}>
          <RowName>{row.name}</RowName>
          <SegmentedControl defaultValue={row.value} size="sm">
            <SegmentedControlList>
              <SegmentedControlTrigger
                tone={toned ? 'positive' : undefined}
                value="in"
              >
                Included
              </SegmentedControlTrigger>
              <SegmentedControlTrigger
                tone={toned ? 'negative' : undefined}
                value="out"
              >
                Excluded
              </SegmentedControlTrigger>
            </SegmentedControlList>
          </SegmentedControl>
        </div>
      ))}
    </div>
  );
}

/** One Allow / Deny row. Toned in both halves of every case that uses it. */
function PermissionRow({
  name,
  initial,
  tinted,
}: {
  name: string;
  initial: string;
  tinted?: boolean;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4">
      <RowName>{name}</RowName>
      <SegmentedControl
        activationMode="manual"
        deselectable
        onValueChange={setValue}
        size="sm"
        value={value}
      >
        <SegmentedControlList>
          <SegmentedControlTrigger
            tinted={tinted && !value}
            tone="positive"
            value="allow"
          >
            Allow
          </SegmentedControlTrigger>
          <SegmentedControlTrigger tone="negative" value="deny">
            Deny
          </SegmentedControlTrigger>
        </SegmentedControlList>
      </SegmentedControl>
    </div>
  );
}

/** §96 — rows where nothing is chosen take the workspace's Allow. */
function PermissionTree({ tinted }: { tinted?: boolean }) {
  return (
    <TryIt action="Hover Allow on a row with nothing chosen">
      <div className="flex w-[300px] flex-col gap-2">
        <Typography element="span" textColor="secondary" textStyle="body12">
          Workspace default: Allow
        </Typography>
        {PERMISSIONS.map((row) => (
          <PermissionRow
            initial={row.value}
            key={row.name}
            name={row.name}
            tinted={tinted}
          />
        ))}
      </div>
    </TryIt>
  );
}

/** §103 — one row chosen Deny over the inherited Allow, and its value. */
function BackToInherit({ deselectable }: { deselectable?: boolean }) {
  const [value, setValue] = useState('deny');
  return (
    <TryIt action="Press Deny again">
      <div className="flex w-[300px] flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <RowName>hr.salaries</RowName>
          <SegmentedControl
            activationMode="manual"
            deselectable={deselectable}
            onValueChange={setValue}
            size="sm"
            value={value}
          >
            <SegmentedControlList>
              <SegmentedControlTrigger
                tinted={!value}
                tone="positive"
                value="allow"
              >
                Allow
              </SegmentedControlTrigger>
              <SegmentedControlTrigger tone="negative" value="deny">
                Deny
              </SegmentedControlTrigger>
            </SegmentedControlList>
          </SegmentedControl>
        </div>
        <Typography element="span" textColor="secondary" textStyle="body12">
          value: {value === '' ? '— (inherits Allow)' : value}
        </Typography>
      </div>
    </TryIt>
  );
}

export const Page: Story = {
  name: 'SegmentedControl',
  render: () => (
    <ChangePage group="SegmentedControl" title="SegmentedControl">
      <ChangeCase
        after={<ScopeColumn toned />}
        afterNote='tone="positive" · tone="negative" — a solid fill'
        before={<ScopeColumn />}
        beforeNote="the neutral pill on every row"
        beforeSource={
          <>
            the live column with <Code>tone</Code> left out — the raised neutral
            pill, the one selected state the published control has.
          </>
        }
        files={['src/components/SegmentedControl/SegmentedControlTrigger.tsx']}
        footnote={
          <>
            The tone is on the trigger, not the control: only the option knows
            whether it is the permissive one. Unselected, both tones are the
            same neutral text as any other trigger — the colour is the answer,
            not the offer. One green and one red in both themes, like the
            destructive button. For alternatives of the same kind — Read / Read
            & write, Light / Dark — the neutral pill stays right.
          </>
        }
        n={73}
        state="draft"
        title="SegmentedControlTrigger — tone"
        why="Included / Excluded is a fact with a consequence. With a neutral pill on every row, finding the exceptions in a column of forty means reading every label — and the exceptions are why anybody scans a scope."
      />

      <ChangeCase
        after={<PermissionTree tinted />}
        afterNote="tinted — the tone's fill at 15%, deeper under the pointer"
        before={<PermissionTree />}
        beforeNote="an inherited row shows nothing selected"
        beforeSource={
          <>
            the live rows without <Code>tinted</Code>: a row with nothing chosen
            draws no option at all, which is all the published control can say
            about it. Both halves carry <Code>tone</Code> (§73) and{' '}
            <Code>deselectable</Code> (§103).
          </>
        }
        files={['src/components/SegmentedControl/SegmentedControlTrigger.tsx']}
        footnote={
          <>
            The solid pill stays "chosen here"; the pale one is the same value
            arrived from above. A plain unselected option keeps the neutral
            hover whatever its tone — a grey option turning red under the
            pointer offered a Deny nobody had chosen. The section's second
            point, tone fills that went grey in dark, fixes §73's own first
            pass: the developers' control has no tone, so there is no Before for
            it. Flip the toolbar to see the After hold its green and red.
          </>
        }
        n={96}
        state="draft"
        title="SegmentedControlTrigger — tinted, and tone fills in dark"
        why="A value in effect without being chosen on the row — inherited, a default — had no way to show, so an inherited Allow read exactly like a row nobody had set."
      />

      <ChangeCase
        after={<BackToInherit deselectable />}
        afterNote="deselectable — the press clears it, back to the inherited Allow"
        before={<BackToInherit />}
        beforeNote="the press is ignored — a chosen value is for good"
        beforeSource={
          <>
            the live control without <Code>deselectable</Code>, which is the
            published behaviour: Radix ignores a press on the option already
            selected.
          </>
        }
        files={[
          'src/components/SegmentedControl/SegmentedControl.tsx',
          'src/components/SegmentedControl/SegmentedControlTrigger.tsx',
          'src/components/SegmentedControl/SegmentedControl.md',
        ]}
        footnote={
          <>
            Enter and Space on the selected option clear it too, and a
            consumer's own <Code>onMouseDown</Code> / <Code>onKeyDown</Code> run
            first. Off by default: a view switcher still always has one segment
            active. The workspaces prototype had caught the press on the
            selected half by hand — on Permissions only, so its Data model tree
            had no way back and the two trees disagreed.
          </>
        }
        n={103}
        state="draft"
        title="SegmentedControl — deselectable"
        why="The docs said a segmented control always has one segment active, while an inherited row starts with none — so once a value was chosen there was no way back to Inherit."
      />
    </ChangePage>
  ),
};
