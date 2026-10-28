import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { fn } from 'storybook/test';
import { TooltipProvider } from '../Tooltip';
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
        'primaryTertiary',
        'destructive',
        'destructiveSecondary',
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
  ['primaryTertiary', 'Tertiary brand'],
  ['destructive', 'Destructive'],
  ['destructiveSecondary', 'Destructive secondary'],
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
      <Button {...args} rightSlot={<Trash2 />} variant="destructiveSecondary">
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
 * announce why it is inert. Every variant paints it the same as the first
 * (2026-10-27); a disabled Button with a `tooltip` renders this form.
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
        {BOXED_VARIANTS.map(([variant, label]) => (
          <Button
            {...args}
            key={variant}
            aria-disabled
            disabled={false}
            variant={variant}
            leftSlot={variant === 'destructiveTertiary' ? <Trash2 /> : null}
          >
            {`${label} · aria-disabled`}
          </Button>
        ))}
      </div>
    </div>
  ),
};

/**
 * `tooltip` — shown on hover and keyboard focus. On an enabled button it says
 * what the button does; `true` shows the `aria-label` under a shorter visible
 * label. On a disabled one it says why it is off: the button is rendered
 * `aria-disabled`, so Tab reaches it and the reason opens, and its click does
 * nothing. Tab through the row.
 */
export const WithTooltip: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="xs"
          variant="tertiary"
          leftSlot={<Settings />}
          aria-label="Set up Finance warehouse in Data Analyze"
          tooltip
        >
          Set Up
        </Button>
        <Button
          size="sm"
          variant="secondary"
          tooltip="Set what the AI client may read from this connection"
        >
          Set Up
        </Button>
        <Button
          size="sm"
          leftSlot={<Plus />}
          disabled
          tooltip="Activate the connection to add it to a workspace"
          tooltipSide="bottom"
          // Never logged in Actions: the click is swallowed.
          onClick={fn()}
        >
          Add Workspace
        </Button>
      </div>
    </TooltipProvider>
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
