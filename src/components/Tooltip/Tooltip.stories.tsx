import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './index';

const meta = {
  title: 'Components/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  args: {
    children: 'Tooltip content',
    side: 'top',
    showArrow: true,
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    ref: { control: false, table: { disable: true } },
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
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
};

export const OnIconButton: Story = {
  args: { children: 'More information' },
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton variant="tertiary" aria-label="More information">
          <Info />
        </IconButton>
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </TooltipTrigger>
          <TooltipContent {...args} side={side}>
            Tooltip on {side}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * One recipe at every length. `w-max` keeps a short tip hugging its text,
 * `max-w-72` (288px — the same width as a medium menu) stops a long one, and
 * the text wraps onto two or three lines instead of running off the viewport.
 *
 * All three are rendered open so the wrap ceiling is visible without hovering.
 */
export const Widths: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-10 py-8">
      {[
        'Copy',
        'Check failed: API key expired or revoked (HTTP 401) · Aug 11, 11:14 AM',
        'Turn on to receive smarter answers. Higher effort means more thorough answers but higher credit usage',
      ].map((text) => (
        <Tooltip key={text} open>
          <TooltipTrigger asChild>
            <Button variant="secondary">{`${text.slice(0, 12)}…`}</Button>
          </TooltipTrigger>
          <TooltipContent {...args} side="bottom">
            {text}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
