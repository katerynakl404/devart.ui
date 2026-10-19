import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { expect, fn, waitFor } from 'storybook/test';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { PageHeader } from '../PageHeader';
import { Typography } from '../Typography';
import { ListPageLayout, type ListPageLayoutHeaderState } from './index';

const Rows = ({ count = 15 }: { count?: number }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: count }, (_, index) => (
      <div
        key={`row-${index + 1}`}
        className="flex h-11 items-center rounded-lg border border-stroke bg-surface-card px-3"
      >
        <Typography variant="span" textColor="body">
          Row {index + 1}
        </Typography>
      </div>
    ))}
  </div>
);

/**
 * `ListPageLayout` is the shell behind a scrollable list screen: one scroll
 * container, a centred content column, an optional sticky header, and the
 * shadow that fades in under it once the page has scrolled.
 *
 * Two seams keep it free of the application it sits in. `scrollRestorationId`
 * is stamped as `data-scroll-restoration-id` and read by nobody here, so a
 * router's scroll restoration can recognise the element without this component
 * importing one. `onScrollElementChange` hands the scroll container to
 * descendants that window their own content and are too far down to reach it
 * by ref.
 *
 * Below `lg` the header is sticky and publishes its height as
 * `--list-header-height`, so a second sticky element inside the page can offset
 * itself by it. From `lg` up the header is static and the property is removed,
 * which is why consumers read it as `var(--list-header-height, 0px)`.
 *
 * `condenseAfter` makes the sticky header condense once the page has scrolled
 * that many pixels: its inset tightens from 10px to 6px, and a `stickyHeader`
 * passed as a render function receives `{ condensed }` to hand to
 * `PageHeader`. The layout owns the scroll container, so it is the one place
 * that knows when — `PageHeader` has no scroll listener and should not. The
 * distance is counted from the list rather than the column top, so the header
 * shrinking under a page parked at the threshold does not flip it back. From
 * `lg` up the header scrolls away and never condenses.
 *
 * `contentClassName` sizes the column (its max width); `bodyClassName` styles
 * the body under the header, which owns the list's inset — `pb-3` at the
 * bottom — and the 12px between blocks.
 */
const meta = {
  title: 'Components/ListPageLayout',
  component: ListPageLayout,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
    stickyHeader: { control: false },
    onScrollElementChange: { control: false },
  },
  parameters: { layout: 'fullscreen' },
  // The layout owns its own scroll container, so the canvas must be exactly as
  // tall as the viewport — a taller box would scroll the preview frame as well
  // and show a second scrollbar. Docs renders stories inline, where the page
  // itself scrolls, so there a fixed box is what's wanted.
  decorators: [
    (Story, { viewMode }) => (
      <div
        className={cn(
          'bg-surface-page',
          viewMode === 'docs' ? 'h-[50rem]' : 'h-dvh'
        )}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListPageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sticky only below `lg` — narrow canvas under 1024px to see it. */
export const WithStickyHeader: Story = {
  name: 'Sticky header (small screens only)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  args: {
    stickyHeader: <PageHeader title="Files" />,
    contentClassName: 'max-w-5xl',
    children: <Rows />,
  },
  /**
   * The shadow follows the scroll position: hidden at the top, shown once the
   * page has moved, hidden again when it comes back. The container itself
   * takes focus, so the list is scrollable by keyboard before any row is.
   */
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.querySelector(
      '.overflow-y-auto'
    ) as HTMLElement;
    const shadow = canvasElement.querySelector('.top-full') as HTMLElement;
    await expect(scroller).toHaveAttribute('tabindex', '0');
    await expect(shadow).toHaveStyle({ opacity: '0' });
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);

    scroller.scrollTop = 200;
    scroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(shadow.style.opacity).toBe('1'));

    scroller.scrollTop = 0;
    scroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => expect(shadow.style.opacity).toBe('0'));
  },
};

/** No header: the layout is just the scroll container and the content column. */
export const WithoutHeader: Story = {
  args: {
    contentClassName: 'max-w-5xl',
    children: <Rows />,
  },
};

/** Short content — the page does not scroll, so no shadow ever appears. */
export const ShortContent: Story = {
  args: {
    stickyHeader: <PageHeader title="Insights" />,
    contentClassName: 'max-w-5xl',
    children: <Rows count={3} />,
  },
};

/**
 * `contentClassName` is where a page's own max width belongs — the layout ships
 * no opinion about how wide the column should be.
 */
export const NarrowColumn: Story = {
  args: {
    stickyHeader: <PageHeader title="Metrics" />,
    contentClassName: 'max-w-xl',
    children: <Rows />,
  },
};

/** The header the condensing stories share — back, a wrapping title, an action. */
const condensingHeader = ({ condensed }: ListPageLayoutHeaderState) => (
  <PageHeader
    title="Data Sources"
    condensed={condensed}
    wrapTitle
    onBack={fn()}
    backLabel="Back to home"
    actions={
      <Button size="sm" variant="primary">
        <Plus />
        Create Connection
      </Button>
    }
  />
);

const scrollTo = (scroller: HTMLElement, top: number) => {
  scroller.scrollTop = top;
  scroller.dispatchEvent(new Event('scroll'));
};

/**
 * `condenseAfter={60}` with a render-function header. Past 60px of scroll the
 * inset tightens to 6px and `PageHeader` condenses with it — the title to
 * `heading20`, the arrow a step smaller — over the same 240ms. Back above the
 * threshold, it returns to full size. Narrow canvas only.
 */
export const CondensingHeader: Story = {
  name: 'Condensing header (small screens only)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  args: {
    condenseAfter: 60,
    stickyHeader: condensingHeader,
    contentClassName: 'max-w-5xl',
    children: <Rows count={40} />,
  },
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.querySelector(
      '.overflow-y-auto'
    ) as HTMLElement;
    const header = canvasElement.querySelector(
      '[data-slot="list-page-layout-header"]'
    ) as HTMLElement;
    const row = canvasElement.querySelector(
      '[data-slot="page-header"]'
    ) as HTMLElement;
    await expect(header).not.toHaveAttribute('data-condensed');
    await expect(row).not.toHaveAttribute('data-condensed');

    scrollTo(scroller, 400);
    await waitFor(() => expect(header).toHaveAttribute('data-condensed'));
    await expect(row).toHaveAttribute('data-condensed');

    scrollTo(scroller, 0);
    await waitFor(() => expect(header).not.toHaveAttribute('data-condensed'));
    await expect(row).not.toHaveAttribute('data-condensed');
  },
};

/**
 * Between `md` and `lg` the title steps furthest — `heading30` to `heading20` —
 * so this is where the collapse is easiest to judge.
 */
export const CondensingHeaderTablet: Story = {
  name: 'Condensing header (tablet)',
  globals: { viewport: { value: 'tablet', isRotated: false } },
  args: CondensingHeader.args,
  play: CondensingHeader.play,
};

/**
 * From `lg` up the header is in flow and scrolls away with the page, so the
 * same `condenseAfter` does nothing: the header never condenses.
 */
export const CondensingHeaderWideScreen: Story = {
  name: 'Condensing header (wide screens: never)',
  globals: { viewport: { value: 'desktop', isRotated: false } },
  args: CondensingHeader.args,
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.querySelector(
      '.overflow-y-auto'
    ) as HTMLElement;
    const header = canvasElement.querySelector(
      '[data-slot="list-page-layout-header"]'
    ) as HTMLElement;

    scrollTo(scroller, 400);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await expect(header).not.toHaveAttribute('data-condensed');
    scrollTo(scroller, 0);
  },
};

/**
 * `bodyClassName` styles the body under the header — here the 4rem bottom
 * inset a page wants under its last block, in place of the body's `pb-3`.
 * `contentClassName` cannot do it: padding on the column stacks on the body's.
 */
export const BodyInset: Story = {
  args: {
    stickyHeader: <PageHeader title="Files" />,
    contentClassName: 'max-w-5xl',
    bodyClassName: 'pb-16',
    children: <Rows />,
  },
};
