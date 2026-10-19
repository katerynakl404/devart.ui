import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { Button } from '../Button';
import { Typography } from '../Typography';
import { ResizableMainSideLayout, SIDE_PANEL_WIDTH_CSS_VAR } from './index';

const Pane = ({ label }: { label: string }) => (
  <div className="flex h-full items-center justify-center p-4">
    <Typography variant="span" textColor="secondary">
      {label}
    </Typography>
  </div>
);

/**
 * `ResizableMainSideLayout` is a two-pane layout whose right pane collapses to
 * nothing and expands on demand — a preview, an artifact panel, a details dock.
 *
 * Open state is the caller's: pass `sideOpen` and the panel follows. While the
 * side pane is open its width is published on `<html>` as `--right-dock-width`,
 * so a fixed overlay elsewhere on the page can offset itself with
 * `calc(1rem + var(--right-dock-width, 0px))` without importing this layout.
 * The property is removed when the layout unmounts.
 *
 * Sizes are not persisted — every mount starts from the defaults.
 */
const meta = {
  title: 'Components/ResizableMainSideLayout',
  component: ResizableMainSideLayout,
  tags: ['autodocs'],
  args: {
    sideOpen: true,
    mainContent: <Pane label="Main" />,
    sidePanelContent: <Pane label="Side panel" />,
  },
  argTypes: {
    mainContent: { control: false },
    sidePanelContent: { control: false },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-96 border border-stroke">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResizableMainSideLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The side pane width as published on `<html>`, e.g. `"420px"`. */
const publishedSideWidth = () =>
  document.documentElement.style.getPropertyValue(SIDE_PANEL_WIDTH_CSS_VAR);

const POSITIVE_PX = /^[1-9]\d*px$/;

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('#resizable-side') as HTMLElement;
    await expect(panel).not.toHaveAttribute('inert');
    await expect(panel).not.toHaveAttribute('aria-hidden');
    await expect(
      canvasElement.querySelector('[role="separator"]') as HTMLElement
    ).toBeVisible();

    await waitFor(() => expect(publishedSideWidth()).toMatch(POSITIVE_PX));
  },
};

/** Collapsed: the handle is hidden and the main pane takes the full width. */
export const Collapsed: Story = {
  args: { sideOpen: false },
  /**
   * Collapsed to 0% the pane still holds its content; `inert` and
   * `aria-hidden` keep it out of the tab order and the accessibility tree.
   */
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('#resizable-side') as HTMLElement;
    await expect(panel).toHaveAttribute('inert');
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
    await expect(
      canvasElement.querySelector('[role="separator"]') as HTMLElement
    ).not.toBeVisible();

    await waitFor(() => expect(publishedSideWidth()).toBe('0px'));
  },
};

export const CustomSizes: Story = {
  args: {
    mainDefaultSize: '50%',
    sideDefaultSize: '50%',
    sideMinSize: '30%',
    sideMaxSize: '70%',
  },
};

/** The open state lives outside, which is what makes the panel controllable. */
export const Interactive: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const panel = canvasElement.querySelector('#resizable-side') as HTMLElement;
    await expect(panel).toHaveAttribute('inert');
    await waitFor(() => expect(publishedSideWidth()).toBe('0px'));

    await userEvent.click(canvas.getByRole('button', { name: 'Open panel' }));
    await waitFor(() => expect(panel).not.toHaveAttribute('inert'));
    await expect(panel).not.toHaveAttribute('aria-hidden');
    await waitFor(() => expect(publishedSideWidth()).toMatch(POSITIVE_PX));
    await expect(
      canvas.getByRole('button', { name: 'Close panel' })
    ).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Close panel' }));
    await waitFor(() => expect(panel).toHaveAttribute('inert'));
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
    await waitFor(() => expect(publishedSideWidth()).toBe('0px'));
    await expect(
      canvas.getByRole('button', { name: 'Open panel' })
    ).toBeVisible();
  },
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <ResizableMainSideLayout
        {...args}
        sideOpen={open}
        mainContent={
          <div className="flex h-full items-center justify-center p-4">
            <Button size="sm" onClick={() => setOpen((previous) => !previous)}>
              {open ? 'Close panel' : 'Open panel'}
            </Button>
          </div>
        }
      />
    );
  },
};
