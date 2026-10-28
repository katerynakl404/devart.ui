import type { Meta, StoryObj } from '@storybook/react-vite';
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
      options: ['neutral', 'info', 'warning', 'error', 'success'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A glyph beside a name that says one thing on hover: a note (ⓘ), or a state — the triangle for a warning, the cross in a circle for an error, the tick for success. Not an IconButton: it does nothing when pressed, and a button’s box would sit between the name and the mark. It takes focus only with a `tooltip`, named by `label`. The tones are Alert’s glyph tones. Without a `tooltip` it is the glyph alone, hidden from assistive tech — a status line’s mark.',
      },
    },
  },
} satisfies Meta<typeof IconHint>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => (
  <span className="flex items-center gap-2">
    <Typography element="span" textStyle="body14" textColor="primary">
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

/** Every tone beside a name, each saying itself on hover. */
export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Row name="Finance warehouse">
        <IconHint
          label="About Finance warehouse"
          tooltip="The warehouse the finance team reports from."
        />
      </Row>
      <Row name="Sales — EMEA">
        <IconHint
          variant="warning"
          label="What is wrong with Sales — EMEA"
          tooltip="Nothing included yet."
        />
      </Row>
      <Row name="Oracle ERP (staging)">
        <IconHint
          variant="error"
          label="What is wrong with Oracle ERP (staging)"
          tooltip="Connection to host failed — the host is not reachable."
        />
      </Row>
      <Row name="Product analytics">
        <IconHint
          variant="success"
          label="Product analytics"
          tooltip="Connection successful."
        />
      </Row>
      <Row name="Billing">
        <IconHint
          variant="info"
          label="About Billing"
          tooltip="Inactive connections keep their configuration."
        />
      </Row>
    </div>
  ),
};

/** Without a tooltip: the glyph alone, before the words that carry it. */
export const StatusLine: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <span className="flex items-start gap-2">
        <span className="flex h-5 items-center">
          <IconHint variant="warning" />
        </span>
        <Typography element="span" textStyle="body14" textColor="primary">
          1 connection has nothing included yet.
        </Typography>
      </span>
      <span className="flex items-start gap-2">
        <span className="flex h-5 items-center">
          <IconHint variant="error" />
        </span>
        <Typography element="span" textStyle="body14" textColor="primary">
          Connection to host failed — the host is not reachable.
        </Typography>
      </span>
    </div>
  ),
};
