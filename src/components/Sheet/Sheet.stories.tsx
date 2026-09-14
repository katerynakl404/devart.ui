import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Typography } from '../Typography';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './index';

const meta = {
  title: 'Components/Sheet',
  // Target SheetContent so its `side` variant and close-button flag drive the
  // controls. Radix (dialog) portals the content to document.body.
  component: SheetContent,
  tags: ['autodocs'],
  args: {
    side: 'right',
    isCloseButtonVisible: true,
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
    asChild: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open sheet</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Save when you are done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Typography textColor="body">
            Panel body content goes here.
          </Typography>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Cancel</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const InitiallyOpen: Story = {
  render: (args) => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="secondary">Open sheet</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Initially open</SheetTitle>
          <SheetDescription>
            Rendered open so the panel is visible without interaction.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </SheetTrigger>
          <SheetContent {...args} side={side}>
            <SheetHeader>
              <SheetTitle>Side: {side}</SheetTitle>
              <SheetDescription>
                Sheet slides in from the {side} edge.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

export const WithoutCloseButton: Story = {
  args: { isCloseButtonVisible: false },
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open sheet</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>No close button</SheetTitle>
          <SheetDescription>
            Dismiss via the overlay or the footer action.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS. This component portals to `document.body`, so an OPEN overlay is not
 * reached by a scoped class — only the trigger is themed here. Put `dark` on
 * `<html>` to theme the overlay itself.
 */
export const DarkTheme: Story = {
  ...Default,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
