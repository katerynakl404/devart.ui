import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import { TooltipProvider } from '../Tooltip';
import { Typography } from '../Typography';
import { IconHint } from './index';

const meta = {
  title: 'Components/IconHint',
  component: IconHint,
  tags: ['autodocs'],
  // Tooltips need a provider and Storybook has no global one.
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    variant: 'neutral',
    tooltip: 'Ad-hoc analytics and reporting for the data team.',
    label: 'About Data Analyze',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['neutral', 'warning', 'error'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    tooltipSide: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The glyph beside a name that explains itself: on hover, on keyboard focus, and on a tap where there is no hover. Not a button — on a desktop nothing here is clickable and it must not look it. Carbon and Spectrum make this glyph a control because they dropped hover and the words come on click; we keep hover, and keeping it is what makes the behaviour differ by device. The tones are `StatusMark`, which is the whole component where there is nothing to explain.',
      },
    },
  },
} satisfies Meta<typeof IconHint>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ name, children }: { name: string; children: ReactNode }) => (
  <span className="flex items-center gap-2">
    <Typography element="span" textColor="primary" textStyle="body14">
      {name}
    </Typography>
    {children}
  </span>
);

export const Default: Story = {
  render: (args) => (
    <Row name="Data Analyze">
      <IconHint {...args} />
    </Row>
  ),
};

/** The three tones, one row each: the note, the warning, the failure. */
export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Row name="Finance warehouse">
        <IconHint
          label="About Finance warehouse"
          tooltip="The warehouse the finance team reports from."
        />
      </Row>
      <Row name="Sales, EMEA">
        <IconHint
          label="What is wrong with Sales, EMEA"
          tooltip="Nothing included yet."
          variant="warning"
        />
      </Row>
      <Row name="Oracle ERP (staging)">
        <IconHint
          label="What is wrong with Oracle ERP (staging)"
          tooltip="Connection to host failed. The host is not reachable."
          variant="error"
        />
      </Row>
    </div>
  ),
};

/**
 * Focus is the keyboard's hover: Tab reaches the glyph and the words open,
 * with nothing to press and no action behind it.
 */
export const OpensOnKeyboard: Story = {
  render: (args) => (
    <Row name="Finance warehouse">
      <IconHint {...args} label="About Finance warehouse" />
    </Row>
  ),
  play: async ({ canvas, userEvent }) => {
    const hint = canvas.getByRole('img', { name: 'About Finance warehouse' });

    await userEvent.tab();
    await expect(hint).toHaveFocus();
    await waitFor(() =>
      expect(within(document.body).getByRole('tooltip')).toBeVisible()
    );
  },
};
