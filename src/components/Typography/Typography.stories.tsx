import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './index';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'p',
    textColor: 'primary',
    align: 'left',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'div',
        'span',
        'blockquote',
        'code',
        'lead',
        'large',
      ],
    },
    textColor: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'light',
        'body',
        'accent',
        'success',
        'destructive',
        'warning',
        'white',
        'inherit',
      ],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    weight: {
      control: 'select',
      options: [
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ],
    },
    leading: {
      control: 'select',
      options: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
    },
    element: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paragraph: Story = {};

export const Headings: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Typography {...args} variant="h1">
        Heading 1
      </Typography>
      <Typography {...args} variant="h2">
        Heading 2
      </Typography>
      <Typography {...args} variant="h3">
        Heading 3
      </Typography>
      <Typography {...args} variant="h4">
        Heading 4
      </Typography>
      <Typography {...args} variant="h5">
        Heading 5
      </Typography>
      <Typography {...args} variant="h6">
        Heading 6
      </Typography>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1">
      <Typography {...args} textColor="primary">
        Primary ink
      </Typography>
      <Typography {...args} textColor="secondary">
        Secondary ink
      </Typography>
      <Typography {...args} textColor="light">
        Inactive ink
      </Typography>
      <Typography {...args} textColor="body">
        Body ink
      </Typography>
      <Typography {...args} textColor="accent">
        Brand accent
      </Typography>
      <Typography {...args} textColor="success">
        Success
      </Typography>
      <Typography {...args} textColor="destructive">
        Destructive
      </Typography>
      <Typography {...args} textColor="warning">
        Warning
      </Typography>
    </div>
  ),
};

export const SpecialBlocks: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Typography {...args} variant="lead">
        Lead paragraph for section intros
      </Typography>
      <Typography {...args} variant="large">
        Large emphasized text
      </Typography>
      <Typography {...args} variant="blockquote">
        “Design is not just what it looks like — design is how it works.”
      </Typography>
      <Typography {...args} variant="code">
        pnpm add @devart/ui-react
      </Typography>
    </div>
  ),
};

/**
 * The named type scale: nineteen styles on eight size rungs. Pick a style and
 * size, weight and line-height are all decided — no call site re-decides them.
 * Heading carries 500 and Title carries 600 across the same rungs, so a heading
 * and a title at 20px differ by weight, not size.
 */
export const TextStyles: Story = {
  args: { children: undefined },
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        [
          [
            'Heading · 500',
            ['heading36', 'heading30', 'heading24', 'heading20', 'heading16'],
          ],
          [
            'Title · 600',
            ['title30', 'title24', 'title20', 'title16', 'title14', 'title12'],
          ],
          ['Body · 400', ['body16', 'body14', 'body12']],
          ['Label · 500', ['label14', 'label12', 'label10']],
          ['Overline · 600', ['overline']],
        ] as const
      ).map(([group, styles]) => (
        <div className="flex flex-col gap-2" key={group}>
          <Typography element="p" textColor="secondary" textStyle="overline">
            {group}
          </Typography>
          {styles.map((style) => (
            <div className="flex items-baseline gap-4" key={style}>
              <Typography
                className="w-24 shrink-0"
                element="span"
                textColor="light"
                textStyle="body12"
              >
                {style}
              </Typography>
              <Typography element="span" textStyle={style}>
                The quick brown fox
              </Typography>
            </div>
          ))}
        </div>
      ))}
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
      ['Paragraph', Paragraph],
      ['Headings', Headings],
      ['Colors', Colors],
      ['Special Blocks', SpecialBlocks],
      ['Text Styles', TextStyles],
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
