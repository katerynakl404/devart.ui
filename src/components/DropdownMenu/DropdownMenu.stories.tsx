import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, MoreHorizontal, Pencil, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './index';

const meta = {
  title: 'Components/DropdownMenu',
  // Target DropdownMenuContent so its positioning props drive the controls.
  // Radix portals the content to document.body.
  component: DropdownMenuContent,
  tags: ['autodocs'],
  args: {
    sideOffset: 4,
    alignOffset: 0,
    collisionPadding: 8,
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    sideOffset: { control: 'number' },
    alignOffset: { control: 'number' },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
    asChild: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" rightSlot={<MoreHorizontal />}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args} align="start">
        <DropdownMenuLabel>Chat</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={fn()}>
            <Pencil />
            Rename
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={fn()}>
            <Copy />
            Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled onSelect={fn()}>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onSelect={fn()}>
          <Trash2 />
          Delete
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const InitiallyOpen: Story = {
  render: (args) => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args} align="start">
        <DropdownMenuItem onSelect={fn()}>
          <Pencil />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={fn()}>
          <Copy />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onSelect={fn()}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSelectionItems: Story = {
  render: (args) => {
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [showActivityBar, setShowActivityBar] = useState(false);
    const [layout, setLayout] = useState('comfortable');

    return (
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">View options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent {...args} align="start">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
          >
            Activity bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Density</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={layout} onValueChange={setLayout}>
            <DropdownMenuRadioItem value="comfortable">
              Comfortable
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="compact">
              Compact
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/**
 * Every item state the menu ships, rendered open.
 *
 * | State | Treatment |
 * |---|---|
 * | Default | `Text/Body` label, 16px leading glyph at stroke 2 |
 * | Highlighted (hover + keyboard) | `State/Hover` fill |
 * | Pressed | `State/Pressed` fill |
 * | Destructive | `Feedback/Red_Text` label and glyph together |
 * | Disabled | label drops to `Text/Inactive` — no fade, no fill change, so a
 *   disabled row still aligns with its peers |
 *
 * A section heading is the Overline style in `Text/Inactive`, on the same 12px
 * rail as the items.
 */
export const ItemStates: Story = {
  render: (args) => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" rightSlot={<MoreHorizontal />}>
          Item states
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args} align="start">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={fn()}>
          <Pencil />
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={fn()}>
          <Copy />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled onSelect={fn()}>
          <Settings />
          Disabled
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onSelect={fn()}>
          <Trash2 />
          Destructive
        </DropdownMenuItem>
        <DropdownMenuItem disabled variant="danger" onSelect={fn()}>
          <Trash2 />
          Destructive · disabled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
