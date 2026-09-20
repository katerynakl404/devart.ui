import type { Meta, StoryObj } from '@storybook/react-vite';
import { TooltipProvider } from '../Tooltip';
import { CodeBlock } from './index';

const CONFIG = `{
  "mcpServers": {
    "Devart AI": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://127.0.0.1:5027/sse", "--allow-http"]
    }
  }
}`;

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  args: { code: CONFIG, size: 'md', copyable: true },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <div className="w-full max-w-lg">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: { code: 'db2 get instance', size: 'sm' },
};

/** Without the control, for a snippet that is read rather than pasted. */
export const NotCopyable: Story = {
  args: { copyable: false, code: 'SELECT 1;', size: 'sm' },
};
