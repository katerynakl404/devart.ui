import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircularProgress } from './index';

const meta = {
  title: 'Components/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  args: {
    value: 50,
    max: 100,
    variant: 'primary',
    size: 40,
    strokeWidth: 2.5,
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    max: {
      control: { type: 'number', min: 1 },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: { type: 'range', min: 16, max: 160, step: 2 },
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 12, step: 0.5 },
    },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: 0 },
};

export const Half: Story = {
  args: { value: 50 },
};

export const Full: Story = {
  args: { value: 100 },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <CircularProgress {...args} variant="primary" />
      <CircularProgress {...args} variant="secondary" />
    </div>
  ),
};

/**
 * The reference value scale: 40 / 48 / 56 px rings, stroke scaling with the
 * ring, each carrying its own centred percentage label.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-5">
      {(
        [
          { size: 40, strokeWidth: 2.5, value: 25 },
          { size: 48, strokeWidth: 3, value: 65 },
          { size: 56, strokeWidth: 3, value: 100, variant: 'secondary' },
        ] as const
      ).map((step) => (
        <CircularProgress {...args} {...step} key={step.size}>
          <span className="text-ink-body text-xxs">{step.value}%</span>
        </CircularProgress>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    size: 64,
    value: 75,
    children: <span className="text-ink-body text-xs">75%</span>,
  },
};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Default', Default],
      ['Empty', Empty],
      ['Half', Half],
      ['Full', Full],
      ['Variants', Variants],
      ['Sizes', Sizes],
      ['With Label', WithLabel],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render
              ? story.render({ ...args, ...story.args } as never, ctx)
              : null}
          </section>
        ))}
      </div>
    );
  },
} as Story;
