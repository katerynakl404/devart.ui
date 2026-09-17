import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageSquare, Settings, Users } from 'lucide-react';
import { Typography } from '../Typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './index';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    defaultValue: 'chats',
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    defaultValue: { control: false },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="chats">Chats</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="chats">
        <Typography>Chats panel content</Typography>
      </TabsContent>
      <TabsContent value="members">
        <Typography>Members panel content</Typography>
      </TabsContent>
      <TabsContent value="settings">
        <Typography>Settings panel content</Typography>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="chats">
          <MessageSquare className="size-4" />
          Chats
        </TabsTrigger>
        <TabsTrigger value="members">
          <Users className="size-4" />
          Members
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="size-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chats">
        <Typography>Chats panel content</Typography>
      </TabsContent>
      <TabsContent value="members">
        <Typography>Members panel content</Typography>
      </TabsContent>
      <TabsContent value="settings">
        <Typography>Settings panel content</Typography>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="chats">Chats</TabsTrigger>
        <TabsTrigger value="members" disabled>
          Members
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="chats">
        <Typography>Chats panel content</Typography>
      </TabsContent>
      <TabsContent value="settings">
        <Typography>Settings panel content</Typography>
      </TabsContent>
    </Tabs>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="chats">Chats</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="chats">
        <Typography>Chats panel content</Typography>
      </TabsContent>
      <TabsContent value="members">
        <Typography>Members panel content</Typography>
      </TabsContent>
    </Tabs>
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
      ['Default', Default],
      ['With Icons', WithIcons],
      ['With Disabled Tab', WithDisabledTab],
      ['Small', Small],
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
