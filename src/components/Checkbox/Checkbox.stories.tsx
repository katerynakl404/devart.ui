import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './index';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Accept terms and conditions',
    labelPosition: 'right',
    gap: 'md',
    disabled: false,
  },
  argTypes: {
    labelPosition: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: { control: false },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} defaultChecked label="Checked" />
      <Checkbox {...args} checked="indeterminate" label="Indeterminate" />
      <Checkbox {...args} disabled label="Disabled" />
      <Checkbox {...args} defaultChecked disabled label="Disabled checked" />
      <Checkbox
        {...args}
        checked="indeterminate"
        disabled
        label="Disabled indeterminate"
      />
      <Checkbox {...args} aria-invalid label="Invalid" />
      <Checkbox {...args} aria-invalid defaultChecked label="Invalid checked" />
      <Checkbox
        {...args}
        aria-invalid
        checked="indeterminate"
        label="Invalid indeterminate"
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': 'Select row' },
};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['With Label', WithLabel],
      ['States', States],
      ['Without Label', WithoutLabel],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render ? (
              story.render({ ...args, ...story.args } as never, ctx)
            ) : (
              null
            )}
          </section>
        ))}
      </div>
    );
  },
} as Story;
