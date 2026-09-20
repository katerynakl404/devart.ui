import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton, RadioGroup } from './index';

/**
 * `RadioButton` is a Radix radio item with an optional label and layout
 * controls. It must live inside a `RadioGroup` (Radix Root) to manage selection.
 * Use `value` on each button and `defaultValue`/`value` on the group.
 */
const meta = {
  title: 'Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  args: {
    label: 'Option',
    value: 'option',
    variant: 'primary',
    size: 'md',
    labelPosition: 'right',
    gap: 'md',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary'],
    },
    size: {
      control: 'select',
      options: ['md'],
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: { control: 'text' },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single button must still be wrapped in a `RadioGroup`. */
export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="option">
      <RadioButton {...args} />
    </RadioGroup>
  ),
};

export const Group: Story = {
  render: (args) => (
    <RadioGroup defaultValue="banana">
      <RadioButton {...args} label="Apple" value="apple" />
      <RadioButton {...args} label="Banana" value="banana" />
      <RadioButton {...args} label="Cherry" value="cherry" />
    </RadioGroup>
  ),
};

export const Selected: Story = {
  args: { label: 'Selected', value: 'selected' },
  render: (args) => (
    <RadioGroup value="selected">
      <RadioButton {...args} />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup defaultValue="on">
      <RadioButton {...args} label="Disabled unchecked" value="off" disabled />
      <RadioButton {...args} label="Disabled checked" value="on" disabled />
    </RadioGroup>
  ),
};

/**
 * `aria-invalid` mirrors the Input / Checkbox error signal: the error border
 * replaces the neutral one, and the error fill wins over the checked fill.
 */
export const ErrorState: Story = {
  render: (args) => (
    <RadioGroup defaultValue="on">
      <RadioButton
        {...args}
        aria-invalid
        label="Invalid unchecked"
        value="off"
      />
      <RadioButton {...args} aria-invalid label="Invalid checked" value="on" />
    </RadioGroup>
  ),
};

export const LabelPositions: Story = {
  render: (args) => {
    const positions = ['right', 'left', 'top', 'bottom'] as const;
    return (
      <RadioGroup className="flex gap-6" defaultValue="right">
        {positions.map((labelPosition) => (
          <RadioButton
            {...args}
            key={labelPosition}
            label={labelPosition}
            value={labelPosition}
            labelPosition={labelPosition}
          />
        ))}
      </RadioGroup>
    );
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
      ['Group', Group],
      ['Selected', Selected],
      ['Disabled', Disabled],
      ['Error State', ErrorState],
      ['Label Positions', LabelPositions],
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
