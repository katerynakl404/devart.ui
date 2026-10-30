import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType, ReactNode } from 'react';
import {
  StepProgress,
  type StepProgressProps,
} from '../../src/components/StepProgress';
import { TooltipProvider } from '../../src/components/Tooltip';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { StepProgress as UpstreamStepProgress } from '../upstream/StepProgress/StepProgress';

const meta = {
  title: 'Proposed changes/Components/StepProgress',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The props both StepProgresses share — all the panels need. */
type AnyStepProgress = ComponentType<
  Omit<StepProgressProps, 'size'> & { size?: 'sm' }
>;

/** The tour's own read-out: `labelPosition="top"`, the step's title beside. */
const TOUR_STEPS = [
  { title: 'Role', done: true },
  { title: 'Goals', done: true },
  { title: 'Data', done: true },
  { title: 'Metrics' },
  { title: 'Chat' },
];

/** A longer flow whose steps have no names to show — only an accessible one. */
const UNTITLED_STEPS = [
  { title: '', ariaLabel: 'Step 1', done: true },
  { title: '', ariaLabel: 'Step 2', done: true },
  { title: '', ariaLabel: 'Step 3' },
  { title: '', ariaLabel: 'Step 4' },
];

function Labelled({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium text-ink-inactive text-xxs uppercase leading-4 tracking-caps">
        {label}
      </span>
      {children}
    </div>
  );
}

function Readouts({
  Component,
  size,
}: {
  Component: AnyStepProgress;
  size?: 'sm';
}) {
  return (
    <TooltipProvider>
      <div className="flex w-[280px] flex-col gap-6">
        <Labelled label="In a tour card">
          <div className="rounded-lg border border-stroke p-4">
            <Component
              aria-label="Tour progress"
              current={3}
              label="Step 4 of 5"
              labelPosition="top"
              showStepTitle
              size={size}
              steps={TOUR_STEPS}
            />
          </div>
        </Labelled>
        <Labelled label="Selectable, steps with no title">
          <TryIt action="Hover a bar">
            <Component
              aria-label="Setup progress"
              current={2}
              label="Step 3 of 4"
              onStepSelect={() => undefined}
              size={size}
              steps={UNTITLED_STEPS}
            />
          </TryIt>
        </Labelled>
      </div>
    </TooltipProvider>
  );
}

export const Page: Story = {
  name: 'StepProgress',
  render: () => (
    <ChangePage group="StepProgress" title="StepProgress">
      <ChangeCase
        after={<Readouts Component={StepProgress} size="sm" />}
        afterNote='size="sm" — label 12px, gaps 8 / 6 / 4 · no bubble without a title'
        before={<Readouts Component={UpstreamStepProgress} />}
        beforeNote="the one size — label 14px, gaps 12 / 8 / 6 · an empty bubble"
        beforeSource={
          <>
            the developers' own component, vendored unchanged from their 1.4.0
            into <Code>changes/upstream/StepProgress/</Code> — the StepProgress
            their storybook ships, not a replica of it.
          </>
        }
        files={[
          'src/components/StepProgress/StepProgress.tsx',
          'src/components/StepProgress/StepProgressHeader.tsx',
          'src/components/StepProgress/StepProgressBar.tsx',
        ]}
        footnote={
          <>
            <Code>sm</Code> is the read-out a tour card carries (§122): the
            label one type step down, the gap to the bars 12 → 8 beside them and
            8 → 6 above or below, stretched bars 4px apart instead of 6. The
            third point draws nothing: each bar now carries{' '}
            <Code>data-state</Code> — <Code>done</Code>, <Code>current</Code>,{' '}
            <Code>upcoming</Code> — for a consumer to style or test by.
          </>
        }
        n={117}
        state="draft"
        title="StepProgress — size, a state on each bar"
        why="The read-out had one size: in a tour card its 14px label stood level with the card's own body text. And a selectable step with no title opened a tooltip with nothing in it."
      />
    </ChangePage>
  ),
};
