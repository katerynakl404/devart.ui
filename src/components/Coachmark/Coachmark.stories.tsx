import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../Button';
import { StepProgress } from '../StepProgress';
import { Coachmark } from './index';

/** A target in the middle of the frame, so every side has room. */
function Target({ label = 'Composer' }: { label?: string }) {
  return (
    <div className="flex h-[30rem] items-center justify-center">
      <div
        data-demo="target"
        className="rounded-xl border border-stroke bg-surface-card px-6 py-3 text-ink-body text-sm"
      >
        {label}
      </div>
    </div>
  );
}

const footer = (
  <>
    <Button variant="tertiary" size="sm">
      Back
    </Button>
    <span className="flex-1" />
    <Button variant="tertiary" size="sm">
      Skip
    </Button>
    <Button size="sm">Next</Button>
  </>
);

/**
 * The card next to what a spotlight lights: a popover surface with an arrow
 * at the target. It takes the first preferred side where it fits whole
 * without covering the target and re-places itself as the page moves. At
 * 640px and below it is a bottom sheet with no arrow.
 *
 * Fixed and portalled: each story renders in its own frame.
 */
const meta = {
  title: 'Compositions/Coachmark',
  component: Coachmark,
  tags: ['autodocs'],
  args: {
    target: '[data-demo="target"]',
    title: 'Start here: ask your first question',
    icon: <MessageSquare />,
    children: (
      <p>
        Type a question in plain language and press <b>Enter</b>. Insightis
        answers with numbers, tables and charts.
      </p>
    ),
    footer,
  },
  argTypes: {
    target: { control: false },
    rect: { control: false },
    bounds: { control: false },
    boundary: { control: false },
    header: { control: false },
    footer: { control: false },
    icon: { control: false },
    children: { control: false },
    side: {
      control: 'inline-radio',
      options: ['bottom', 'top', 'right', 'left'],
    },
    width: { control: 'inline-radio', options: ['md', 'lg'] },
    ref: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 520 } },
  },
  render: (args) => (
    <>
      <Target />
      <Coachmark {...args} />
    </>
  ),
} satisfies Meta<typeof Coachmark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Below the target — the first default side. */
export const Default: Story = {};

/** Each preferred side. */
export const Sides: Story = {
  render: (args) => (
    <>
      <Target />
      <Coachmark {...args} side="right" title="Right" footer={undefined} />
      <Coachmark {...args} side="left" title="Left" footer={undefined} />
      <Coachmark {...args} side="top" title="Top" footer={undefined} />
    </>
  ),
};

/** `header` carries the progress; `width="lg"` is 464px. */
export const WithProgressLarge: Story = {
  args: {
    width: 'lg',
    header: (
      <StepProgress
        size="sm"
        fill
        showStepTitle
        aria-label="Progress"
        current={3}
        steps={[
          { title: 'Role', done: true },
          { title: 'Goal', done: true },
          { title: 'Data', done: true },
          { title: 'Chat' },
          { title: 'Metrics' },
        ]}
      />
    ),
  },
};

/** Title, body and nothing else. */
export const Minimal: Story = {
  args: { icon: undefined, footer: undefined },
};

/** `nudge` — each change shakes the card once (a tour does it on a scrim click). */
export const Nudge: Story = {
  render: function Render(args) {
    const [nudge, setNudge] = useState(0);
    return (
      <>
        <div className="p-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setNudge((n) => n + 1)}
          >
            Nudge
          </Button>
        </div>
        <Target />
        <Coachmark {...args} nudge={nudge} />
      </>
    );
  },
};

/** `leaving` — fades out and drops 8px. */
export const Leaving: Story = {
  render: function Render(args) {
    const [leaving, setLeaving] = useState(false);
    return (
      <>
        <div className="p-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setLeaving((v) => !v)}
          >
            {leaving ? 'Show again' : 'Close'}
          </Button>
        </div>
        <Target />
        <Coachmark key={String(leaving)} {...args} leaving={leaving} />
      </>
    );
  },
};

/** At 640px and below: a bottom sheet, full width, no arrow. */
export const Phone: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

/** The card and its arrow on the dark theme. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
};
