import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CheckCircle2,
  CircleStop,
  Info,
  TriangleAlert,
  Wallet,
  XCircle,
} from 'lucide-react';
import { Button } from '../Button';
import { Alert } from './index';

/* The same four lucide components Toast renders (`VARIANT_ICON_MAP`), imported
   rather than redrawn. These were hand-written copies of lucide's path data,
   which is how the two sets stopped matching: the paths were right and the two
   attributes lucide puts on every icon — `stroke-linecap="round"` and
   `stroke-linejoin="round"` — were missing, so SVG's own defaults applied.
   `butt` and `miter` do not merely look different. Lucide draws the dot of an
   `i` or a `!` as a 0.01-unit segment that only becomes a dot under a round
   cap, so the info glyph lost the dot off its `i` and the warning triangle came
   up empty — the two marks whose whole meaning is that dot. Importing the
   component makes "the same event renders the same mark" true by construction
   instead of by transcription. */
const SuccessIcon = CheckCircle2;
const InfoIcon = Info;
const WarningIcon = TriangleAlert;
const ErrorIcon = XCircle;
/* Neutral is the one variant Toast has no counterpart for. `CircleStop` is the
   same shape the hand-drawn mark was reaching for — a square inside a ring —
   and it comes from the same set as the other four. */
const NeutralIcon = CircleStop;

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: 'Queue paused because you stopped the reply',
    description: '2 messages kept · nothing sent or charged',
    variant: 'neutral',
    size: 'sm',
    icon: <NeutralIcon />,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error', 'neutral'],
    },
    /* Stated, because docgen cannot read a cva variant off `VariantProps` —
       without it the size the component is built around has no control. */
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
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
export const Sizes: Story = {
  render: () => (
    <div className="flex w-[34rem] max-w-full flex-col gap-3">
      <Alert
        variant="info"
        icon={<InfoIcon />}
        title="Queue paused · waiting for your answer above"
        description="2 messages kept · nothing sent or charged"
      />
      <Alert
        size="md"
        variant="info"
        icon={<InfoIcon />}
        title="Queue paused · waiting for your answer above"
        description="2 messages kept · nothing sent or charged"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two sizes, because an Alert does two jobs. **sm** (the default) is the footnote ' +
          'inside another surface — a band, a card: title Title/12, description Body/S, 16px ' +
          'glyph. **md** stands on the page, above a table, speaking about the whole screen, ' +
          'where 12px is a whisper from something that occupies a full row: Title/14, Body/M, ' +
          '20px glyph, one rung more padding. Every rung moves together, so md is a size and ' +
          'not an Alert with a bigger font.',
      },
    },
  },
};

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

export const WithIllustration: Story = {
  args: {
    size: 'md',
    variant: 'warning',
    icon: undefined,
    illustration: <Wallet />,
    title: 'You’ve run out of credits',
    description: 'Buy more credits or upgrade your plan to continue.',
    actions: (
      <Button variant="transparent" size="sm">
        Manage plan
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          '`illustration` puts the picture on a round plate instead of showing a bare glyph. The ' +
          'caller passes only the glyph; its colour comes from `variant`, and the plate is that ' +
          'same colour at a tint, so switching the type recolours the whole illustration. The ' +
          'copy centres on the plate rather than hanging off its top. It is decorative, so the ' +
          'title must name the condition by itself.',
      },
    },
  },
};

/** The plate in every type, at both sizes: only the glyph is passed, everything else is `variant`. */
export const IllustrationVariants: Story = {
  render: () => (
    <div className="flex w-[34rem] max-w-full flex-col gap-3">
      {(['success', 'info', 'warning', 'error', 'neutral'] as const).map(
        (variant) => (
          <Alert
            key={variant}
            size="md"
            variant={variant}
            illustration={<Wallet />}
            title="You’ve run out of credits"
            description="Buy more credits or upgrade your plan to continue."
          />
        )
      )}
      <Alert
        variant="warning"
        illustration={<Wallet />}
        title="You’ve run out of credits"
        description="sm: 32px plate, 16px glyph"
      />
    </div>
  ),
};

export const TitleOnly: Story = {
  args: { description: undefined, variant: 'info', icon: <InfoIcon /> },
};
