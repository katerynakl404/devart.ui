import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { IconButton } from './index';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    children: <Plus />,
    'aria-label': 'Add',
    variant: 'primary',
    size: 'md',
    rounded: 'md',
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
        'tertiaryBrand',
        'destructive',
        'destructiveOutline',
        'destructiveTertiary',
        'transparent',
      ],
    },
    size: {
      control: 'select',
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'rounded', 'md', 'lg', 'xl', 'full'],
    },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
    asChild: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

/** Variants reuse the Button tokens 1:1 — there are no IconButton-only colours. */
const VARIANTS = [
  ['primary', 'Add'],
  ['secondary', 'Edit'],
  ['outline', 'Edit'],
  ['tertiary', 'Edit'],
  ['tertiaryBrand', 'Edit'],
  ['destructive', 'Delete'],
  ['destructiveOutline', 'Delete'],
  ['destructiveTertiary', 'Delete'],
] as const;

const variantGlyph = (label: string) =>
  label === 'Add' ? <Plus /> : label === 'Delete' ? <Trash2 /> : <Pencil />;

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(([variant, label]) => (
        <IconButton
          {...args}
          aria-label={label}
          key={variant}
          variant={variant}
        >
          {variantGlyph(label)}
        </IconButton>
      ))}
    </div>
  ),
};

/**
 * Six steps. `xs`–`xl` mirror Button's heights (28 / 32 / 36 / 40 / 44), so an
 * icon-only control lines up next to a text button of the same size class.
 * `2xs` (24px) sits one step BELOW that ladder — the row-action size, which an
 * icon-only control can reach because it only has to fit a padded box around a
 * 14px glyph. The glyph is 16px everywhere and 14px on the two smallest steps,
 * where the radius also tightens so a 24px box does not read as a pill.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-4">
      {(['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div className="grid justify-items-center gap-1" key={size}>
          <IconButton {...args} size={size} />
          <span className="text-ink-secondary text-xxs">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Loading swaps the glyph for a spinner in `currentColor` and fades the control
 * to `--opacity-disabled` while keeping the variant fill — it is not the
 * disabled palette.
 */
export const Loading: Story = {
  args: { isLoading: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(([variant, label]) => (
        <IconButton
          {...args}
          aria-label={label}
          key={variant}
          variant={variant}
        >
          {variantGlyph(label)}
        </IconButton>
      ))}
    </div>
  ),
};

/**
 * Disabled is a colour override: `State/Disabled` fill with `Text/Inactive`
 * glyph on the filled variants, `Text/Inactive` border and glyph on the
 * outlined/ghost ones.
 */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(([variant, label]) => (
        <IconButton
          {...args}
          aria-label={label}
          key={variant}
          variant={variant}
        >
          {variantGlyph(label)}
        </IconButton>
      ))}
    </div>
  ),
};
