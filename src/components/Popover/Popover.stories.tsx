import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal, Pencil, Pin, Settings2, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { Typography } from '../Typography';
import { Popover, PopoverContent, PopoverTrigger } from './index';

const meta = {
  title: 'Components/Popover',
  // Target PopoverContent so its positioning props (side/align/offsets) drive
  // the controls panel. Radix portals the content to document.body.
  component: PopoverContent,
  tags: ['autodocs'],
  args: {
    align: 'center',
    sideOffset: 4,
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
    children: { control: false },
    ref: { control: false, table: { disable: true } },
    asChild: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" leftSlot={<Settings2 />}>
          Open popover
        </Button>
      </PopoverTrigger>
      <PopoverContent {...args}>
        <div className="flex flex-col gap-2">
          <Typography variant="span" weight="medium">
            Dimensions
          </Typography>
          <Typography variant="span" textColor="secondary" className="text-sm">
            Set the width and height for the selected layer.
          </Typography>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const InitiallyOpen: Story = {
  render: (args) => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent {...args} aria-label="Rendered open">
        <div className="flex flex-col gap-2">
          <Typography variant="span" weight="medium">
            Rendered open
          </Typography>
          <Typography variant="span" textColor="secondary" className="text-sm">
            Shown open so the panel is visible without interaction.
          </Typography>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </PopoverTrigger>
          <PopoverContent {...args} side={side} className="w-48">
            <Typography variant="span" className="text-sm">
              Popover on {side}
            </Typography>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/* Hover interaction model                                                     */
/* -------------------------------------------------------------------------- */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PANEL_LABEL = 'Panel preview';
const PIN_ACTION = 'Pin this panel';
const REST_AREA_TEXT = 'Move the pointer here to leave the trigger.';

/** A small card with a title, one line and a primary action: the first tabbable inside the content. */
const PanelPreview = () => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col gap-1">
      <Typography variant="span" weight="medium">
        {PANEL_LABEL}
      </Typography>
      <Typography variant="span" textColor="secondary" className="text-sm">
        Hover the trigger to peek at the panel; click it to keep the panel open
        while you work.
      </Typography>
    </div>
    <Button size="sm">{PIN_ACTION}</Button>
  </div>
);

/**
 * Hover stories need somewhere to move the pointer that is neither the trigger
 * nor the content. A plain paragraph above the trigger plays that role; the
 * content opens below, so the two never overlap.
 */
const HoverStage = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col items-center gap-12">
    <Typography variant="p" textColor="secondary">
      {REST_AREA_TEXT}
    </Typography>
    {children}
  </div>
);

const expectOpen = (dialog: HTMLElement, step: string) =>
  expect(dialog, step).toHaveAttribute('data-state', 'open');

const expectClosed = () =>
  waitFor(() =>
    expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  );

/**
 * `openOnHover`: a mouse resting on the trigger opens the panel after `delay`
 * (300 ms) without moving focus. Moving into the content keeps it open; leaving
 * either closes it after `closeDelay` (160 ms).
 */
export const OpensOnHover: Story = {
  args: {
    side: 'bottom',
  },

  render: (args) => (
    <HoverStage>
      <Popover openOnHover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Hover to preview</Button>
        </PopoverTrigger>
        <PopoverContent {...args} aria-label={PANEL_LABEL}>
          <PanelPreview />
        </PopoverContent>
      </Popover>
    </HoverStage>
  ),

  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Hover to preview' });
    const restArea = canvas.getByText(REST_AREA_TEXT);

    await userEvent.hover(trigger);
    await wait(150);
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();

    const dialog = await waitFor(() => body.getByRole('dialog'), {
      timeout: 600,
    });
    await expectOpen(dialog, 'open after the hover delay');
    // A hover-open never takes focus.
    await expect(dialog).not.toContainElement(
      document.activeElement as HTMLElement
    );

    // Travelling from the trigger into the content cancels the pending close.
    await userEvent.hover(dialog);
    await wait(300);
    await expectOpen(dialog, 'still open with the pointer on the content');

    // Leaving the content closes after `closeDelay`, not immediately.
    await userEvent.hover(restArea);
    await wait(60);
    await expectOpen(dialog, 'still open 60 ms after leaving');
    await expectClosed();
  },
};

/**
 * A click on a hover-opened panel pins it: hover-out no longer closes it, and
 * the next click on the trigger does.
 */
export const PinsOnClick: Story = {
  render: (args) => (
    <HoverStage>
      <Popover openOnHover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Hover, then click</Button>
        </PopoverTrigger>
        <PopoverContent {...args} aria-label={PANEL_LABEL}>
          <PanelPreview />
        </PopoverContent>
      </Popover>
    </HoverStage>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Hover, then click' });
    const restArea = canvas.getByText(REST_AREA_TEXT);

    await userEvent.hover(trigger);
    const dialog = await body.findByRole('dialog');

    // The click pins instead of toggling shut.
    await userEvent.click(trigger);
    await wait(300);
    await expectOpen(dialog, 'still open after the pinning click');

    // Pinned: leaving the trigger no longer closes.
    await userEvent.hover(restArea);
    await wait(400);
    await expectOpen(dialog, 'pinned: still open after leaving the trigger');

    // The next click closes.
    await userEvent.click(trigger);
    await expectClosed();
  },
};

/**
 * With `pinOnClick={false}`, a click does not pin: leaving the trigger or
 * content still closes after `closeDelay`.
 */
export const FollowsPointerWithoutPin: Story = {
  render: (args) => (
    <HoverStage>
      <Popover openOnHover pinOnClick={false}>
        <PopoverTrigger asChild>
          <Button variant="secondary">Hover, click, leave</Button>
        </PopoverTrigger>
        <PopoverContent {...args} aria-label={PANEL_LABEL}>
          <PanelPreview />
        </PopoverContent>
      </Popover>
    </HoverStage>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', {
      name: 'Hover, click, leave',
    });
    const restArea = canvas.getByText(REST_AREA_TEXT);

    await userEvent.hover(trigger);
    await body.findByRole('dialog');

    await userEvent.click(trigger);
    await wait(300);

    await userEvent.hover(restArea);
    await expectClosed();
  },
};

/**
 * Keyboard open (Enter or Space) is the only path that moves focus into the
 * content; Escape closes and hands focus back to the trigger.
 */
export const OpensByKeyboard: Story = {
  render: (args) => (
    <Popover openOnHover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Press Enter to open</Button>
      </PopoverTrigger>
      <PopoverContent {...args} aria-label={PANEL_LABEL}>
        <PanelPreview />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Press Enter to open' });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    const dialog = await body.findByRole('dialog');
    await waitFor(() =>
      expect(
        within(dialog).getByRole('button', { name: PIN_ACTION })
      ).toHaveFocus()
    );

    await userEvent.keyboard('{Escape}');
    await expectClosed();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/**
 * A mouse click opens without moving focus into the content: the trigger keeps
 * focus. A second click closes.
 */
export const MouseClickKeepsFocus: Story = {
  render: (args) => (
    <Popover openOnHover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Click to open</Button>
      </PopoverTrigger>
      <PopoverContent {...args} aria-label={PANEL_LABEL}>
        <PanelPreview />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Click to open' });

    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog');
    await expectOpen(dialog, 'open after a mouse click');
    await expect(trigger).toHaveFocus();
    await expect(dialog).not.toContainElement(
      document.activeElement as HTMLElement
    );

    await userEvent.click(trigger);
    await expectClosed();
  },
};

/**
 * A trigger whose own `onClick` cancels the event (a row that stops a parent
 * handler, a link kept from navigating) still toggles the popover: Radix would
 * skip its toggle on a cancelled click, so the root toggles instead.
 */
export const ChildCancelledClickStillToggles: Story = {
  render: (args) => (
    <Popover openOnHover>
      <PopoverTrigger asChild>
        <Button variant="secondary" onClick={(event) => event.preventDefault()}>
          Cancels its click
        </Button>
      </PopoverTrigger>
      <PopoverContent {...args} aria-label={PANEL_LABEL}>
        <PanelPreview />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Cancels its click' });

    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog');
    await expectOpen(dialog, 'open although the child cancelled the click');

    await userEvent.click(trigger);
    await expectClosed();
  },
};

/**
 * Touch has no hover: a tap opens by press, with no delay, and the tap's own
 * pointer events do not toggle it shut again.
 */
export const OpensByTap: Story = {
  render: (args) => (
    <Popover openOnHover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Tap to open</Button>
      </PopoverTrigger>
      <PopoverContent {...args} aria-label={PANEL_LABEL}>
        <PanelPreview />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Tap to open' });

    await userEvent.pointer([{ keys: '[TouchA]', target: trigger }]);
    const dialog = await waitFor(() => body.getByRole('dialog'), {
      timeout: 200,
    });
    await wait(400);
    await expectOpen(dialog, 'still open 400 ms after the tap');
  },
};

/**
 * Inside a `DropdownMenu` the item is the trigger (`asChild`, `onSelect`
 * cancelled so the menu stays open). Hover opens the panel beside the menu;
 * Escape closes the panel first and the menu second.
 */
export const InsideDropdownMenu: Story = {
  args: { side: 'right', align: 'start' },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" rightSlot={<MoreHorizontal />}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={fn()}>
          <Pencil />
          Rename
        </DropdownMenuItem>
        <Popover openOnHover>
          <PopoverTrigger asChild>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <Pin />
              Pin to sidebar
            </DropdownMenuItem>
          </PopoverTrigger>
          <PopoverContent
            {...args}
            fallbackSides={['left', 'bottom']}
            aria-label={PANEL_LABEL}
          >
            <PanelPreview />
          </PopoverContent>
        </Popover>
        <DropdownMenuItem variant="danger" onSelect={fn()}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
    const menu = await body.findByRole('menu');
    const item = within(menu).getByRole('menuitem', { name: 'Pin to sidebar' });

    await userEvent.hover(item);
    const dialog = await body.findByRole('dialog');
    await expectOpen(dialog, 'open after hovering the item');

    // Leaving the item makes the menu re-focus itself; that must not count as
    // focus leaving the popover.
    await userEvent.hover(dialog);
    await wait(400);
    await expectOpen(dialog, 'still open with the pointer on the content');
    await expect(body.getByRole('menu')).toBeInTheDocument();

    // Interacting inside the panel leaves the menu open.
    await userEvent.click(
      within(dialog).getByRole('button', { name: PIN_ACTION })
    );
    await wait(100);
    await expectOpen(dialog, 'still open after clicking inside');
    await expect(body.getByRole('menu')).toBeInTheDocument();

    // Escape closes only the panel ...
    await userEvent.keyboard('{Escape}');
    await expectClosed();
    await expect(body.getByRole('menu')).toBeInTheDocument();

    // ... and a second one the menu.
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByRole('menu')).not.toBeInTheDocument()
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Positioning                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * `fallbackSides` tries each side in order when the preferred one does not
 * fit. On a 320px canvas neither `right` nor `left` has room for a 288px panel,
 * so it lands on `bottom`.
 */
export const FallbackSideOnNarrowViewport: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { layout: 'fullscreen' },
  args: { side: 'right', align: 'start', fallbackSides: ['left', 'bottom'] },
  render: (args) => (
    <div className="flex justify-end p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open</Button>
        </PopoverTrigger>
        <PopoverContent {...args} className="w-72" aria-label={PANEL_LABEL}>
          <PanelPreview />
        </PopoverContent>
      </Popover>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    const dialog = await within(document.body).findByRole('dialog');
    await waitFor(() => expect(dialog).toHaveAttribute('data-side', 'bottom'));
  },
};

/**
 * The same props with room on the right keep the preferred side:
 * `fallbackSides` only steps in when `right` cannot fit. The trigger sits at
 * the left edge so the result does not depend on how wide the canvas is.
 */
export const PreferredSideOnWideViewport: Story = {
  parameters: { layout: 'fullscreen' },
  args: { side: 'right', align: 'start', fallbackSides: ['left', 'bottom'] },
  render: (args) => (
    <div className="flex justify-start p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open</Button>
        </PopoverTrigger>
        <PopoverContent {...args} className="w-72" aria-label={PANEL_LABEL}>
          <PanelPreview />
        </PopoverContent>
      </Popover>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
    const dialog = await within(document.body).findByRole('dialog');
    await waitFor(() => expect(dialog).toHaveAttribute('data-side', 'right'));
  },
};

/**
 * `closeOnViewportChange`: a window resize or any scroll outside the content
 * closes the panel; scrolling inside the content does not.
 */
export const ClosesOnViewportChange: Story = {
  render: (args) => (
    <Popover closeOnViewportChange>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open</Button>
      </PopoverTrigger>
      <PopoverContent {...args} aria-label={PANEL_LABEL}>
        <PanelPreview />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Open' });

    await userEvent.click(trigger);
    await body.findByRole('dialog');
    window.dispatchEvent(new Event('resize'));
    await expectClosed();

    await userEvent.click(trigger);
    const dialog = await body.findByRole('dialog');

    // The panel's own scroll is not a viewport change.
    dialog.dispatchEvent(new Event('scroll', { bubbles: false }));
    await wait(100);
    await expectOpen(dialog, 'still open after a scroll inside the content');

    window.dispatchEvent(new Event('scroll'));
    await expectClosed();
  },
};
