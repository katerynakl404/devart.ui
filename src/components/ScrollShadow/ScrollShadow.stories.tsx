import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { ScrollShadow } from './index';

const meta = {
  title: 'Components/ScrollShadow',
  component: ScrollShadow,
  tags: ['autodocs'],
  args: {
    size: 40,
    offset: 0,
    orientation: 'vertical',
    visibility: 'auto',
    isEnabled: true,
    onVisibilityChange: fn(),
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 0, max: 120, step: 4 },
    },
    offset: {
      control: { type: 'range', min: 0, max: 120, step: 4 },
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    visibility: {
      control: 'select',
      options: ['auto', 'both', 'top', 'bottom', 'left', 'right', 'none'],
    },
    onVisibilityChange: { control: false },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof ScrollShadow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  /**
   * The fade is a CSS mask rebuilt from the scroll position, so which edge is
   * soft is the whole behaviour: only the far edge at the top, both in the
   * middle, only the near edge at the end. A mask stuck on one shape is the
   * bug this catches.
   */
  play: async ({ canvasElement }) => {
    const region = canvasElement.querySelector(
      '.overflow-y-auto'
    ) as HTMLElement;
    await expect(region).toBeTruthy();

    // The browser reserialises the gradient and drops the default direction, so
    // the assertions read the shape: a soft near edge starts the gradient with
    // `transparent`, a soft far edge ends it with one.
    const nearEdgeSoft = () =>
      region.style.maskImage.startsWith('linear-gradient(transparent');
    const farEdgeSoft = () => region.style.maskImage.endsWith('transparent)');

    await waitFor(() => expect(farEdgeSoft()).toBe(true));
    await expect(nearEdgeSoft()).toBe(false);

    region.scrollTop = 100;
    await waitFor(() => expect(nearEdgeSoft()).toBe(true));
    await expect(farEdgeSoft()).toBe(true);

    region.scrollTop = region.scrollHeight;
    await waitFor(() => expect(farEdgeSoft()).toBe(false));
    await expect(nearEdgeSoft()).toBe(true);
  },
  render: (args) => (
    <ScrollShadow
      {...args}
      className="h-48 w-64 rounded-md border border-stroke p-4"
    >
      <div className="flex flex-col gap-3">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={`row-${i + 1}`} className="text-ink-body">
            Scrollable row {i + 1}
          </p>
        ))}
      </div>
    </ScrollShadow>
  ),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <ScrollShadow
      {...args}
      className="w-64 rounded-md border border-stroke p-4"
    >
      <div className="flex gap-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`col-${i + 1}`}
            className="flex size-16 shrink-0 items-center justify-center rounded-md bg-surface-chips text-ink-body"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollShadow>
  ),
};
