import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Alert } from './index';

/* The glyphs are Toast's own paths, not lucide lookalikes: the point of the
   shared vocabulary is that the SAME event renders the same mark whether it
   floats past or sits in the page, and two icon sets that merely resemble each
   other is how that quietly stops being true. */
const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
} as const;

const SuccessIcon = () => (
  <svg {...stroke}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const InfoIcon = () => (
  <svg {...stroke}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);
const WarningIcon = () => (
  <svg {...stroke}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);
const ErrorIcon = () => (
  <svg {...stroke}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6M9 9l6 6" />
  </svg>
);
/* Neutral is the one variant Toast has no counterpart for, so its mark is
   Alert's own. */
const NeutralIcon = () => (
  <svg {...stroke}>
    <circle cx="12" cy="12" r="10" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
  </svg>
);

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: 'Queue paused because you stopped the reply',
    description: '2 messages kept · nothing sent or charged',
    variant: 'neutral',
    icon: <NeutralIcon />,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error', 'neutral'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Compact inline notice, and the standing-still member of the Toast family: same variants, same accents, same glyphs, so one condition reads as one condition whether it floats past or sits in the page. Info is the single deliberate difference — Brand/Tertiary rather than Brand/Primary, so an inline notice does not read as the product talking about itself. Neutral is Alert’s own, because nothing floats over the page to say something colourless.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    variant: 'error',
    icon: <ErrorIcon />,
    title: 'Queue paused · the last reply didn’t finish',
    description: '2 messages kept · nothing sent or charged',
    actions: (
      <>
        <Button variant="secondary" size="xs">
          Resume
        </Button>
        <Button size="xs">Retry</Button>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The primary action sits LAST, on the right. Secondary choices are read first and the commitment is read last.',
      },
    },
  },
};

/** All five together: the set has to read apart at a glance and still as one family. */
export const Variants: Story = {
  render: () => (
    <div className="flex w-[34rem] max-w-full flex-col gap-2">
      <Alert
        variant="success"
        icon={<SuccessIcon />}
        title="Queue sent · all 4 messages went through"
        description="Nothing left waiting"
      />
      <Alert
        variant="info"
        icon={<InfoIcon />}
        title="Queue paused · waiting for your answer above"
        description="2 messages kept · nothing sent or charged"
      />
      <Alert
        variant="warning"
        icon={<WarningIcon />}
        title="Queue paused · you’re out of credits"
        description="2 messages kept · nothing sent or charged"
      />
      <Alert
        variant="error"
        icon={<ErrorIcon />}
        title="Queue paused · the last reply didn’t finish"
        description="2 messages kept · nothing sent or charged"
      />
      <Alert
        variant="neutral"
        icon={<NeutralIcon />}
        title="Queue paused because you stopped the reply"
        description="2 messages kept · nothing sent or charged"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The triangle belongs to WARNING and nothing else; error takes the circled cross, which is also the mark a failed message carries elsewhere. One event, one glyph. Flip the theme with the toolbar — every surface is a token, so nothing here needs a dark copy of itself.',
      },
    },
  },
};

export const TitleOnly: Story = {
  args: { description: undefined, variant: 'info', icon: <InfoIcon /> },
};
