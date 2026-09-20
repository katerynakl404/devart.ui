import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileImage } from 'lucide-react';
import { fn } from 'storybook/test';
import { File } from './index';

/**
 * `File` is a compact file chip: leading icon, name + optional size, and a
 * trailing slot that switches on state — a spinner while loading, retry +
 * dismiss on error, or a lone dismiss button when only `onDismiss` is set.
 */
const meta = {
  title: 'Components/File',
  component: File,
  tags: ['autodocs'],
  args: {
    name: 'report.pdf',
    fileSize: '1.2 MB',
    isLoading: false,
    isError: false,
    onDismiss: fn(),
  },
  argTypes: {
    name: { control: 'text' },
    fileSize: { control: 'text' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    icon: { control: false },
    rightSlot: { control: false },
    onClick: { control: false },
    onDismiss: { control: false },
    onRetry: { control: false },
  },
} satisfies Meta<typeof File>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <File {...args} />
    </div>
  ),
};

/** No handlers → no trailing controls, just the chip. */
export const NameOnly: Story = {
  args: { fileSize: undefined, onDismiss: undefined },
  render: (args) => (
    <div className="w-72">
      <File {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: { isLoading: true },
  render: (args) => (
    <div className="w-72">
      <File {...args} />
    </div>
  ),
};

/** `progress` replaces the size caption with a live progress bar + percent. */
export const Uploading: Story = {
  args: { progress: 43 },
  render: (args) => (
    <div className="w-72">
      <File {...args} />
    </div>
  ),
};

/** Error state shows retry + dismiss when both handlers are provided. */
export const ErrorState: Story = {
  args: { isError: true, onRetry: fn(), onDismiss: fn() },
  render: (args) => (
    <div className="w-72">
      <File {...args} />
    </div>
  ),
};

export const Clickable: Story = {
  args: { onClick: fn() },
  render: (args) => (
    <div className="w-72">
      <File {...args} />
    </div>
  ),
};

export const CustomIcon: Story = {
  args: {
    name: 'photo.png',
    fileSize: '820 KB',
    icon: <FileImage className="size-6 text-brand-tertiary" />,
  },
  render: (args) => (
    <div className="w-72">
      <File {...args} />
    </div>
  ),
};

/**
 * The interactive chip's own states. A chip is interactive only when `onClick`
 * is set; it then takes `State/Hover` on hover and `State/Pressed` while held,
 * plus the brand focus ring on `focus-visible`. Hover and pressed cannot be
 * frozen as CSS pseudo-states in a static story, so they are reproduced here
 * with the exact fill utilities the recipe applies.
 */
export const InteractiveStates: Story = {
  args: { onClick: fn() },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <File {...args} />
      <File {...args} className="bg-state-hover" />
      <File {...args} className="bg-state-pressed" />
      <File
        {...args}
        className="ring-2 ring-focus-ring-brand ring-offset-2"
        name="focus-visible.pdf"
      />
    </div>
  ),
};

/** Size ladder and the borderless `tertiary` variant. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <File {...args} size="xs" name="xs.pdf" />
      <File {...args} size="sm" name="sm.pdf" />
      <File {...args} size="md" name="md.pdf" />
      <File {...args} size="lg" name="lg.pdf" />
      <File {...args} size="xl" name="xl.pdf" />
      <File {...args} variant="tertiary" name="tertiary.pdf" onClick={fn()} />
    </div>
  ),
};
