import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/ProgressBar',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Members with access, as the workspaces prototype counts them. */
const SPLITS = [
  { name: 'Sales Analytics', allowed: 12, denied: 12 },
  { name: 'Finance — EMEA', allowed: 20, denied: 4 },
];

/** A whole split into two answers. `split` is the only difference. */
function MembersWithAccess({ split }: { split?: boolean }) {
  return (
    <div className="flex w-[300px] flex-col gap-5">
      {SPLITS.map((row) => (
        <div className="flex flex-col gap-2" key={row.name}>
          <div className="flex items-baseline justify-between gap-4">
            <Typography element="span" textColor="body" textStyle="label14">
              {row.name}
            </Typography>
            <Typography
              className="tabular-nums"
              element="span"
              textColor="secondary"
              textStyle="body12"
            >
              {row.allowed} Allowed · {row.denied} Denied
            </Typography>
          </div>
          <ProgressBar
            aria-label={`${row.name}: members with access`}
            max={row.allowed + row.denied}
            trackVariant={split ? 'destructive' : undefined}
            value={row.allowed}
            variant="green"
          />
        </div>
      ))}
    </div>
  );
}

export const Page: Story = {
  name: 'ProgressBar',
  render: () => (
    <ChangePage group="ProgressBar" title="ProgressBar">
      <ChangeCase
        after={<MembersWithAccess split />}
        afterNote='variant="green" · trackVariant="destructive"'
        before={<MembersWithAccess />}
        beforeNote="the green half on the neutral track"
        beforeSource={
          <>
            the live bar without <Code>trackVariant</Code>, which defaults to
            the published track exactly — <Code>bg-surface-chips</Code>, moved
            from the base into <Code>default</Code>.
          </>
        }
        files={['src/components/ProgressBar/index.tsx']}
        footnote={
          <>
            The indicator's <Code>variant</Code> is unchanged; only what the
            unfilled part means is new. <Code>default</Code> is "nothing yet",
            for a bar that counts toward a goal; <Code>destructive</Code> is the
            other answer, for a bar that splits a whole in two — allowed and
            denied, passed and failed.
          </>
        }
        n={105}
        state="draft"
        title="ProgressBar — trackVariant"
        why="On the grey track the Denied half read as “nothing yet”, so a bar that was half denied looked half empty."
      />
    </ChangePage>
  ),
};
