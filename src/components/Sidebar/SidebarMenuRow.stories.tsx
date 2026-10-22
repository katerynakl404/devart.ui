import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpen, LifeBuoy, LogOut, Settings } from 'lucide-react';
import { expect, fn } from 'storybook/test';
import { SidebarMenuRow } from './index';

/**
 * A row in the sidebar footer's menu: neutral tertiary fill, leading icon,
 * left-aligned label, optional trailing affordance.
 *
 * It renders a `<button>` and never a link, because the kit has no router — a
 * row that navigates is wrapped in the consumer's own anchor, and `isExternal`
 * only draws the affordance rather than opening anything.
 */
const meta = {
  title: 'Compositions/Sidebar/SidebarMenuRow',
  component: SidebarMenuRow,
  tags: ['autodocs'],
  args: {
    icon: Settings,
    label: 'Settings',
    isExternal: false,
    onSelect: fn(),
  },
  argTypes: {
    icon: { control: false },
    trailingSlot: { control: false },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-64 rounded-md border border-stroke bg-surface-card p-2.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarMenuRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
    await expect(args.onSelect).toHaveBeenCalledOnce();
  },
};

/** `isExternal` adds the outbound arrow; the anchor stays the caller's job. */
export const External: Story = {
  args: { icon: BookOpen, label: 'Documentation', isExternal: true },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: 'Documentation' });
    await expect(
      row.querySelector('svg.lucide-arrow-up-right')
    ).toBeInTheDocument();
  },
};

export const WithoutIcon: Story = {
  args: { icon: undefined, label: 'Sign out' },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: 'Sign out' });
    await expect(row.querySelector('svg')).not.toBeInTheDocument();
  },
};

/** The shape a footer popover actually renders. */
export const Menu: Story = {
  render: (args) => (
    <div className="flex flex-col gap-0.5">
      <SidebarMenuRow {...args} icon={Settings} label="Settings" />
      <SidebarMenuRow
        {...args}
        icon={BookOpen}
        label="Documentation"
        isExternal
      />
      <SidebarMenuRow {...args} icon={LifeBuoy} label="Support" isExternal />
      <SidebarMenuRow {...args} icon={LogOut} label="Sign out" />
    </div>
  ),
};
