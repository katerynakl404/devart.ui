import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../Typography';
import { StatusMark } from './index';

const meta = {
  title: 'Components/StatusMark',
  component: StatusMark,
  tags: ['autodocs'],
  args: { variant: 'warning', size: 'sm' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['neutral', 'warning', 'error'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    interactive: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The glyph that says a state and nothing else: the triangle for a warning, the cross in a circle for an error, the tick for success, the ⓘ for a note. Always decoration — `aria-hidden`, no focus, no words of its own, because the words beside it carry the meaning. A mark that has to explain itself is `IconHint`, which is a button and renders this inside it.',
      },
    },
  },
} satisfies Meta<typeof StatusMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Three tones, and only three: the note, the warning, the failure. */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusMark variant="neutral" />
      <StatusMark variant="warning" />
      <StatusMark variant="error" />
    </div>
  ),
};

/** 14px beside a 14px name, 16px beside a 16px title. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <span className="flex items-center gap-2">
        <StatusMark size="sm" variant="error" />
        <Typography element="span" textColor="primary" textStyle="body14">
          14px, in a row
        </Typography>
      </span>
      <span className="flex items-center gap-2">
        <StatusMark size="md" variant="error" />
        <Typography element="span" textColor="primary" textStyle="body16">
          16px, beside a title
        </Typography>
      </span>
    </div>
  ),
};

/** Where it belongs: the mark before the words that carry it. */
export const StatusLine: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <span className="flex items-start gap-2">
        <span className="flex h-5 items-center">
          <StatusMark variant="warning" />
        </span>
        <Typography element="span" textColor="primary" textStyle="body14">
          1 connection has nothing included yet.
        </Typography>
      </span>
      <span className="flex items-start gap-2">
        <span className="flex h-5 items-center">
          <StatusMark variant="error" />
        </span>
        <Typography element="span" textColor="primary" textStyle="body14">
          Connection to host failed. The host is not reachable.
        </Typography>
      </span>
    </div>
  ),
};
