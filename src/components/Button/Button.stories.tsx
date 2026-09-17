import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './index';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    rounded: 'md',
    fullWidth: false,
    isLoading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'outline',
        'tertiary',
        'destructive',
        'destructiveOutline',
        'destructiveTertiary',
        'transparent',
        'transparentUnderline',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'rounded', 'md', 'lg', 'xl', 'full'],
    },
    leftSlot: { control: false },
    rightSlot: { control: false },
    ref: { control: false, table: { disable: true } },
    asChild: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

/** Every boxed variant. Size is independent of variant — any of the five sizes
 * pairs with any of these. */
const BOXED_VARIANTS = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['outline', 'Outline'],
  ['tertiary', 'Tertiary'],
  ['destructive', 'Destructive'],
  ['destructiveOutline', 'Destructive outline'],
  ['destructiveTertiary', 'Destructive tertiary'],
] as const;

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {BOXED_VARIANTS.map(([variant, label]) => (
        <Button {...args} key={variant} variant={variant}>
          {label}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="xl">
        Extra large
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} leftSlot={<Plus />}>
        New chat
      </Button>
      <Button {...args} rightSlot={<Trash2 />} variant="destructiveOutline">
        Delete
      </Button>
      <Button {...args} variant="secondary">
        <Plus />
        Icon as a child
      </Button>
    </div>
  ),
};

/**
 * Loading keeps the variant's own colours and fades the whole control to
 * `--opacity-disabled` — it is deliberately NOT the disabled palette, so a
 * primary button still reads as primary while it works.
 */
export const Loading: Story = {
  args: { isLoading: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {BOXED_VARIANTS.map(([variant, label]) => (
        <Button {...args} key={variant} variant={variant}>
          {label}
        </Button>
      ))}
    </div>
  ),
};

/**
 * Disabled is a colour override, not a fade: `State/Disabled` fill with
 * `Text/Inactive` ink on the filled variants, and `Text/Inactive` on border and
 * label for the outlined/ghost ones.
 *
 * The bottom row is the second, focusable form — `aria-disabled` plus no
 * `disabled` attribute, so a screen reader can still reach the control and
 * announce why it is inert. Shipped on the two tertiary variants.
 */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {BOXED_VARIANTS.map(([variant, label]) => (
          <Button {...args} key={variant} variant={variant}>
            {label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button {...args} aria-disabled disabled={false} variant="tertiary">
          Tertiary · aria-disabled
        </Button>
        <Button
          {...args}
          aria-disabled
          disabled={false}
          variant="destructiveTertiary"
          leftSlot={<Trash2 />}
        >
          Delete · aria-disabled
        </Button>
      </div>
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
};

/**
 * `asChild` renders the button’s styling onto another element — a link, a
 * router `<Link>`, a trigger. Regression cover: a Button renders up to three
 * children (left slot, label, right slot) while Radix’s Slot accepts exactly
 * one, so this threw until the label was routed through `Slottable`.
 */
export const AsChild: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} asChild>
        <a href="#as-child">Link as a button</a>
      </Button>
      <Button {...args} asChild leftSlot={<Plus />} variant="secondary">
        <a href="#as-child-icon">With a leading icon</a>
      </Button>
    </div>
  ),
};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Primary', Primary],
      ['Variants', Variants],
      ['Sizes', Sizes],
      ['With Icons', WithIcons],
      ['Loading', Loading],
      ['Disabled', Disabled],
      ['Full Width', FullWidth],
      ['As Child', AsChild],
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
