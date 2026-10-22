import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart3,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { IconButton } from '../IconButton';
import { Tour, type TourStep } from './index';

/** A small app: a metrics card above a chat composer. */
function DemoApp() {
  return (
    <div data-demo="app" className="flex flex-col items-center gap-10 p-10">
      <Card data-demo="metrics" className="w-[30rem]">
        <CardHeader>
          <CardTitle>Metrics</CardTitle>
        </CardHeader>
        <CardContent>Revenue · Win rate · Pipeline coverage</CardContent>
      </Card>
      <div
        data-demo="composer"
        className="flex w-[30rem] items-center gap-1 rounded-xl border border-stroke bg-surface-card p-2"
      >
        <IconButton
          data-demo="attach"
          variant="tertiary"
          size="sm"
          aria-label="Attach"
        >
          <Paperclip />
        </IconButton>
        <span className="flex-1 px-2 text-ink-inactive text-sm">
          Ask a question…
        </span>
        <IconButton
          data-demo="model"
          variant="tertiary"
          size="sm"
          aria-label="Model"
        >
          <Sparkles />
        </IconButton>
        <IconButton data-demo="send" size="sm" aria-label="Send">
          <Send />
        </IconButton>
      </div>
    </div>
  );
}

const STEPS: TourStep[] = [
  {
    id: 'metrics',
    label: 'Metrics',
    target: '[data-demo="metrics"]',
    icon: <BarChart3 />,
    title: 'Metrics make answers exact',
    content: (
      <p>
        They tell the AI how each number is calculated, so it answers the same
        way every time. <b>12 built-in metrics</b> are ready.
      </p>
    ),
  },
  {
    id: 'chat',
    label: 'Chat',
    target: '[data-demo="composer"]',
    side: ['top', 'bottom', 'right', 'left'],
    icon: <MessageSquare />,
    title: 'Start here: ask your first question',
    content: (
      <p>
        Type a question in plain language and press <b>Enter</b>.
      </p>
    ),
    annotations: [
      { target: '[data-demo="attach"]', text: 'Attach a file' },
      {
        target: '[data-demo="model"]',
        icon: <Sparkles />,
        text: 'Pick a model and how deeply it thinks',
      },
    ],
  },
];

/**
 * A guided walk over the real interface: per step a `Spotlight`, a
 * `Coachmark` and, when the step has them, annotations. The caller holds the
 * step; the tour reports how it ended.
 *
 * Keyboard: → next, ← back, Esc closes. Focus moves to the coachmark on every
 * step; a click on the scrim nudges it. Closing fades the tour out.
 */
const meta = {
  title: 'Compositions/Tour',
  component: Tour,
  tags: ['autodocs'],
  args: {
    open: true,
    steps: STEPS,
    step: 0,
    onStepChange: fn(),
    onClose: fn(),
  },
  argTypes: {
    steps: { control: false },
    progress: { control: false },
    boundary: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 560 } },
  },
  render: function Render(args) {
    const [step, setStep] = useState(args.step ?? 0);
    const [open, setOpen] = useState(args.open ?? true);
    return (
      <>
        <div className="p-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setStep(0);
              setOpen(true);
            }}
          >
            Restart tour
          </Button>
        </div>
        <DemoApp />
        <Tour
          {...args}
          open={open}
          step={step}
          onStepChange={(n) => {
            args.onStepChange?.(n);
            setStep(n);
          }}
          onClose={(reason) => {
            args.onClose?.(reason);
            setOpen(false);
          }}
        />
      </>
    );
  },
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two steps; the second has annotations under the composer. */
export const Default: Story = {};

/** The step with annotations. */
export const WithAnnotations: Story = {
  args: { step: 1 },
};

/**
 * Part of a longer onboarding: the read-out counts the whole flow, and Back on
 * the first step returns to it (`onBeforeFirst`). Labels renamed.
 */
export const PartOfAFlow: Story = {
  args: {
    onBeforeFirst: fn(),
    labels: { finish: 'Start chatting' },
    progress: {
      steps: [
        { title: 'Role' },
        { title: 'Goal' },
        { title: 'Data' },
        { title: 'Metrics' },
        { title: 'Chat' },
      ],
      offset: 3,
    },
  },
};

/** At 640px and below: the coachmark is a bottom sheet and lists the annotations. */
export const Phone: Story = {
  args: { step: 1 },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

/** The whole tour on the dark theme. */
export const DarkTheme: Story = {
  args: { step: 1 },
  globals: { theme: 'dark' },
};
