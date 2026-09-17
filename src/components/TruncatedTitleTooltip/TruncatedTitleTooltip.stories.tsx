import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipProvider } from '../Tooltip';
import { TruncatedTitleTooltip } from './index';

/**
 * Shows a tooltip only when the trigger's text is actually overflowing
 * (`scrollWidth > clientWidth`). Hover the truncated row to reveal the full
 * title; the short row shows no tooltip. Requires a wrapping `TooltipProvider`
 * (Radix), provided here via a decorator.
 */
const meta = {
  title: 'Components/TruncatedTitleTooltip',
  component: TruncatedTitleTooltip,
  tags: ['autodocs'],
  args: {
    side: 'right',
    // `title` + `children` are required; each story overrides them via render.
    title: 'Placeholder title',
    children: null,
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    title: { control: 'text' },
    children: { control: false },
    getTruncationTarget: { control: false, table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <div className="grid min-h-32 place-items-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TruncatedTitleTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const longTitle =
  'Quarterly revenue forecast and go-to-market strategy for Q4 2026';

/** Text overflows the 200px container, so hovering reveals the tooltip. */
export const Truncated: Story = {
  args: { title: longTitle },
  render: (args) => (
    <TruncatedTitleTooltip {...args}>
      <a
        href="#link"
        className="flex w-[200px] min-w-0 items-center text-ink-body"
      >
        <span className="truncate">{longTitle}</span>
      </a>
    </TruncatedTitleTooltip>
  ),
};

/** Text fits the container, so no tooltip appears on hover. */
export const NotTruncated: Story = {
  args: { title: 'Short title' },
  render: (args) => (
    <TruncatedTitleTooltip {...args}>
      <a
        href="#link"
        className="flex w-[200px] min-w-0 items-center text-ink-body"
      >
        <span className="truncate">Short title</span>
      </a>
    </TruncatedTitleTooltip>
  ),
};

/** Compare a truncated row (tooltip) against a short row (no tooltip). */
export const SideBySide: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <TruncatedTitleTooltip {...args} title={longTitle}>
        <a
          href="#truncated"
          className="flex w-[200px] min-w-0 items-center text-ink-body"
        >
          <span className="truncate">{longTitle}</span>
        </a>
      </TruncatedTitleTooltip>
      <TruncatedTitleTooltip {...args} title="Short title">
        <a
          href="#short"
          className="flex w-[200px] min-w-0 items-center text-ink-body"
        >
          <span className="truncate">Short title</span>
        </a>
      </TruncatedTitleTooltip>
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
      ['Truncated', Truncated],
      ['Not Truncated', NotTruncated],
      ['Side By Side', SideBySide],
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
