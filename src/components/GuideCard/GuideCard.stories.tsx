import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart3, MessageSquare } from 'lucide-react';
import { type CSSProperties, useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { expect, waitFor } from 'storybook/test';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { StepProgress } from '../StepProgress';
import { TooltipProvider } from '../Tooltip';
import { GuideCard, type GuideCardProps, type GuideCardSide } from './index';

const TARGET = (
  <div className="rounded-xl border border-stroke bg-surface-card px-6 py-3 text-ink-body text-sm">
    Composer
  </div>
);

const LAYOUT_BY_SIDE: Record<GuideCardSide, string> = {
  right: 'flex-row',
  left: 'flex-row-reverse',
  bottom: 'flex-col',
  top: 'flex-col-reverse',
};

const TOUR_STEPS = [
  { title: 'Role', done: true },
  { title: 'Goals', done: true },
  { title: 'Data', done: true },
  { title: 'Metrics' },
  { title: 'Chat' },
];

const HEADERS = {
  none: undefined,
  progress: (
    <StepProgress
      aria-label="Tour progress"
      steps={TOUR_STEPS}
      current={3}
      label="Step 4 of 5"
      labelPosition="top"
      showStepTitle
    />
  ),
};

const ICONS = {
  none: undefined,
  metrics: <BarChart3 />,
  chat: <MessageSquare />,
};

const BODIES = {
  none: undefined,
  short: (
    <p>
      Type a question in plain language and press <b>Enter</b>.
    </p>
  ),
  long: (
    <>
      <p>
        Metrics tell the AI exactly how each number is calculated, so it answers
        the same way every time. Answers based on metrics are{' '}
        <b>30–40% more accurate</b>.
      </p>
      <p>
        Google Sheets has no built-in metrics yet, so add your own with{' '}
        <b>Add Metric</b>.
      </p>
    </>
  ),
};

const FOOTERS = {
  none: undefined,
  skipNext: (
    <>
      <span className="flex-1" />
      <Button variant="tertiary" size="sm">
        Skip
      </Button>
      <Button size="sm">Next</Button>
    </>
  ),
  backFinish: (
    <>
      <Button variant="tertiary" size="sm">
        Back
      </Button>
      <span className="flex-1" />
      <Button size="sm">Start Chatting</Button>
    </>
  ),
  finish: (
    <>
      <span className="flex-1" />
      <Button size="sm">Start Chatting</Button>
    </>
  ),
};

/**
 * The card of a tour step: an optional header (progress), an icon and title,
 * the body and a footer of actions, with an arrow back at its target. The card
 * draws the arrow; the tour engine that renders it places the card and passes
 * the side it landed on (`side`) and the target's centre (`arrowOffset`). The
 * offset is px as a number or any CSS length as a string, so an engine that
 * writes it to a custom property can pass `arrowOffset="var(--onb-arrow-offset)"`.
 * The scrim, the dialog role and focus belong to the engine.
 *
 * Every slot is the consumer's. Give `titleId` / `descriptionId` and pass the
 * same ids to the engine's dialog (`aria-labelledby` / `aria-describedby`).
 * `nudgeCount` shakes the card once per change; `isLeaving` fades it out.
 *
 * The slot controls pick from sample content.
 */
const meta = {
  title: 'Compositions/GuideCard',
  component: GuideCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={300}>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    header: 'none',
    icon: 'metrics',
    title: 'Metrics keep every answer accurate',
    titleId: 'guide-card-title',
    descriptionId: 'guide-card-description',
    children: 'long',
    footer: 'skipNext',
    width: 'md',
    nudgeCount: 0,
    isLeaving: false,
  },
  argTypes: {
    header: {
      control: 'inline-radio',
      options: Object.keys(HEADERS),
      mapping: HEADERS,
      description: 'Above the title, 12px over it. Usually a `StepProgress`.',
      table: { type: { summary: 'ReactNode' } },
    },
    icon: {
      control: 'inline-radio',
      options: Object.keys(ICONS),
      mapping: ICONS,
      description:
        'A glyph on a 32px brand disc before the title. Shown only with a `title`.',
      table: { type: { summary: 'ReactNode' } },
    },
    title: {
      control: 'text',
      description: 'The heading, an `h3` in 16/600.',
      table: { type: { summary: 'ReactNode' } },
    },
    titleId: {
      control: 'text',
      description:
        'The `id` of the title. Pass the same id to the dialog that renders the card as its `aria-labelledby`.',
    },
    descriptionId: {
      control: 'text',
      description:
        'The `id` of the body. Pass the same id to the dialog as its `aria-describedby`.',
    },
    children: {
      control: 'inline-radio',
      options: Object.keys(BODIES),
      mapping: BODIES,
      description:
        'The body: 14px, relaxed, Text/Secondary. `<p>`s sit 12px apart; `<b>` and `<strong>` take Text/Body 600.',
      table: { type: { summary: 'ReactNode' } },
    },
    footer: {
      control: 'inline-radio',
      options: Object.keys(FOOTERS),
      mapping: FOOTERS,
      description:
        'The actions row, 16px under the body: a flex row with an 8px gap. The consumer orders the buttons and adds a spacer.',
      table: { type: { summary: 'ReactNode' } },
    },
    width: {
      control: 'inline-radio',
      options: ['md', 'lg'],
      description: '`md` is 352px, `lg` 464px. Never wider than its container.',
      table: { defaultValue: { summary: 'md' } },
    },
    side: {
      control: 'inline-radio',
      options: ['none', 'top', 'right', 'bottom', 'left'],
      mapping: { none: undefined },
      description:
        'The side of its target the card sits on. The arrow is drawn on the opposite edge, pointing back at the target; without `side` there is no arrow. Placing the card stays with the engine.',
      table: { type: { summary: "'top' | 'right' | 'bottom' | 'left'" } },
    },
    arrowOffset: {
      control: { type: 'number', min: 0, step: 4 },
      description:
        "Where the arrow's centre sits along that edge, from the card's top (`left` / `right`) or left (`top` / `bottom`): px as a number, or any CSS length as a string such as `var(--onb-arrow-offset)`. Without it the arrow is centred. The engine passes the target's centre here.",
    },
    nudgeCount: {
      control: { type: 'number', min: 0, step: 1 },
      description:
        'Each change shakes the card once, e.g. on a click on the scrim. `0` does nothing.',
    },
    isLeaving: {
      control: 'boolean',
      description:
        'Fades the card out and drops it 8px; it takes no clicks while it leaves.',
      table: { defaultValue: { summary: 'false' } },
    },
    className: {
      control: 'text',
      description: 'Merged last with `cn()`.',
    },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GuideCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A tour step with an icon, the body and Skip · Next. */
export const Default: Story = {
  play: async ({ args, canvas }) => {
    const title = canvas.getByRole('heading', { level: 3 });

    await expect(title).toHaveAttribute('id', args.titleId);
  },
};

/** `header` carries the progress; `width="lg"` is 464px. */
export const WithProgress: Story = {
  args: { header: 'progress', width: 'lg' },
};

/** Title and body, nothing else. */
export const Minimal: Story = {
  args: { icon: 'none', children: 'short', footer: 'none' },
};

/** The last step: Back on the left, the finishing action on the right. */
export const LastStep: Story = {
  args: {
    icon: 'chat',
    title: 'Start here: ask your first question',
    children: 'short',
    footer: 'backFinish',
  },
};

/** Pick `side` in Controls: the card moves to that side of the target and its arrow points back at it. */
export const Sides: Story = {
  args: { side: 'right', header: 'progress', footer: 'backFinish' },
  render: (args) => (
    <div
      className={cn(
        'flex items-center gap-3.5',
        LAYOUT_BY_SIDE[args.side ?? 'right']
      )}
    >
      {TARGET}
      <GuideCard {...args} />
    </div>
  ),
};

/** `arrowOffset` as a string: the arrow reads its centre from a custom property set on an ancestor, the way a tour engine writes it. */
export const ArrowOffsetFromCssVariable: Story = {
  args: {
    side: 'right',
    arrowOffset: 'var(--my-arrow-offset)',
    header: 'progress',
    footer: 'backFinish',
  },
  argTypes: { arrowOffset: { control: 'text' } },
  render: (args) => (
    <div
      className={cn(
        'flex items-center gap-3.5',
        LAYOUT_BY_SIDE[args.side ?? 'right']
      )}
      style={{ '--my-arrow-offset': '32px' } as CSSProperties}
    >
      {TARGET}
      <GuideCard {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector<HTMLElement>(
      '[data-slot="guide-card-arrow"]'
    );

    await expect(arrow?.style.top).toBe('var(--my-arrow-offset)');
    await expect(arrow && getComputedStyle(arrow).top).toBe('32px');
  },
};

interface NudgeExampleProps extends GuideCardProps {
  onNudgeCountChange: (nudgeCount: number) => void;
}

function NudgeExample({ onNudgeCountChange, ...args }: NudgeExampleProps) {
  const [nudgeCount, setNudgeCount] = useState(args.nudgeCount ?? 0);

  useEffect(() => setNudgeCount(args.nudgeCount ?? 0), [args.nudgeCount]);

  const nudge = () => {
    const nextCount = nudgeCount + 1;

    setNudgeCount(nextCount);
    onNudgeCountChange(nextCount);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="secondary" size="sm" onClick={nudge}>
        Nudge
      </Button>

      <GuideCard {...args} nudgeCount={nudgeCount} />
    </div>
  );
}

interface LeavingExampleProps extends GuideCardProps {
  onIsLeavingChange: (isLeaving: boolean) => void;
}

function LeavingExample({ onIsLeavingChange, ...args }: LeavingExampleProps) {
  const [isLeaving, setIsLeaving] = useState(args.isLeaving ?? false);

  useEffect(() => setIsLeaving(args.isLeaving ?? false), [args.isLeaving]);

  const toggleLeaving = () => {
    const nextIsLeaving = !isLeaving;

    setIsLeaving(nextIsLeaving);
    onIsLeavingChange(nextIsLeaving);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="secondary" size="sm" onClick={toggleLeaving}>
        {isLeaving ? 'Show again' : 'Close'}
      </Button>

      <GuideCard {...args} isLeaving={isLeaving} />
    </div>
  );
}

/** Each click on Nudge raises `nudgeCount`, and the card shakes once. */
export const Nudge: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs<GuideCardProps>();

    return (
      <NudgeExample
        {...args}
        onNudgeCountChange={(nudgeCount) => updateArgs({ nudgeCount })}
      />
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Nudge' }));

    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="guide-card"]')
      ).toHaveClass('animate-guide-card-nudge')
    );
  },
};

/** Close sets `isLeaving`: the card fades out and drops 8px. Show again brings it back. */
export const Leaving: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs<GuideCardProps>();

    return (
      <LeavingExample
        {...args}
        onIsLeavingChange={(isLeaving) => updateArgs({ isLeaving })}
      />
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));

    await expect(
      canvasElement.querySelector('[data-slot="guide-card"]')
    ).toHaveAttribute('data-state', 'leaving');
  },
};

/** The card on the dark theme. */
export const DarkTheme: Story = {
  args: { header: 'progress', width: 'lg' },
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
