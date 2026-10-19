import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BREAKPOINTS } from '../../../lib/breakpoints';
import {
  LIST_HEADER_HEIGHT_CSS_VAR,
  ListPageLayout,
  type ListPageLayoutHeaderState,
  type ListPageLayoutProps,
} from '../index';

/**
 * `useListHeaderHeight` takes its viewport value from `innerWidth` and only its
 * change notifications from `matchMedia`; jsdom ships no `matchMedia`, no
 * `ResizeObserver`, and reports every `offsetHeight` as 0. All three get
 * stand-ins here so a test can cross the breakpoint, resize the header and read
 * the height it publishes.
 */
const listeners = new Set<() => void>();

const setViewport = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  });
};

const emitViewportChange = () => {
  for (const listener of listeners) listener();
};

let headerHeight = 48;

const offsetHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetHeight'
) as PropertyDescriptor;

const observers: ResizeObserverStub[] = [];

class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(readonly callback: ResizeObserverCallback) {
    observers.push(this);
  }

  resize() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

beforeEach(() => {
  listeners.clear();
  observers.length = 0;
  headerHeight = 48;

  window.matchMedia = vi.fn((query: string) => {
    return {
      matches: false,
      media: query,
      addEventListener: (_: string, listener: () => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_: string, listener: () => void) => {
        listeners.delete(listener);
      },
    } as unknown as MediaQueryList;
  }) as unknown as typeof window.matchMedia;

  vi.stubGlobal('ResizeObserver', ResizeObserverStub);

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get: () => headerHeight,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(
    HTMLElement.prototype,
    'offsetHeight',
    offsetHeightDescriptor
  );
});

const renderLayout = (props: Partial<ListPageLayoutProps> = {}) =>
  render(
    <ListPageLayout
      stickyHeader={<div>Header</div>}
      scrollRestorationId="files"
      {...props}
    >
      <div>Rows</div>
    </ListPageLayout>
  );

/** The scroll container is the root; the content column is its only child. */
const scrollElement = (root: HTMLElement) =>
  root.firstElementChild as HTMLElement;

const contentColumn = (root: HTMLElement) =>
  scrollElement(root).firstElementChild as HTMLElement;

const publishedHeight = (root: HTMLElement) =>
  contentColumn(root).style.getPropertyValue(LIST_HEADER_HEIGHT_CSS_VAR);

/** Attribute match on the one class that places the shadow under the header. */
const headerShadow = (root: HTMLElement) =>
  root.querySelector('[class*="top-full"]') as HTMLElement | null;

/** The one observer the hook constructed; fails loudly if it never did. */
const singleObserver = () => {
  expect(observers).toHaveLength(1);
  return observers[0] as ResizeObserverStub;
};

describe('ListPageLayout', () => {
  describe('header height', () => {
    it('publishes the sticky header height below lg', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout();

      expect(publishedHeight(container)).toBe('48px');
    });

    /** Consumers read `var(--list-header-height, 0px)`, so the fallback must apply here. */
    it('leaves the property unset from lg up', () => {
      setViewport(BREAKPOINTS.lg);
      const { container } = renderLayout();

      expect(publishedHeight(container)).toBe('');
    });

    it('drops the property when the viewport grows past lg, and restores it on the way back', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout();
      expect(publishedHeight(container)).toBe('48px');

      setViewport(BREAKPOINTS.lg);
      act(() => emitViewportChange());
      expect(publishedHeight(container)).toBe('');

      setViewport(BREAKPOINTS.lg - 1);
      act(() => emitViewportChange());
      expect(publishedHeight(container)).toBe('48px');
    });

    it('observes the header and re-measures when it resizes', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout();
      const header = screen.getByText('Header').parentElement;

      const observer = singleObserver();
      expect(observer.observe).toHaveBeenCalledExactlyOnceWith(header);

      headerHeight = 64;
      act(() => observer.resize());
      expect(publishedHeight(container)).toBe('64px');
    });

    it('removes the property and disconnects the observer on unmount', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container, unmount } = renderLayout();
      const column = contentColumn(container);
      const observer = singleObserver();

      unmount();

      expect(observer.disconnect).toHaveBeenCalledOnce();
      expect(column.style.getPropertyValue(LIST_HEADER_HEIGHT_CSS_VAR)).toBe(
        ''
      );
    });

    /**
     * The header's ref goes from an element to `null` without any dependency
     * changing, so the hook is told about the removal explicitly.
     */
    it('withdraws the property when the header is removed after mount', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container, rerender } = renderLayout();
      expect(publishedHeight(container)).toBe('48px');

      rerender(
        <ListPageLayout scrollRestorationId="files">
          <div>Rows</div>
        </ListPageLayout>
      );

      expect(publishedHeight(container)).toBe('');
    });

    it('still removes the property on unmount when ResizeObserver is unavailable', () => {
      vi.stubGlobal('ResizeObserver', undefined);
      setViewport(BREAKPOINTS.lg - 1);
      const { container, unmount } = renderLayout();
      const column = contentColumn(container);
      expect(publishedHeight(container)).toBe('48px');

      unmount();

      expect(column.style.getPropertyValue(LIST_HEADER_HEIGHT_CSS_VAR)).toBe(
        ''
      );
    });

    it('renders without a header: no sticky wrapper, no shadow, no property', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout({ stickyHeader: undefined });

      expect(screen.queryByText('Header')).toBeNull();
      expect(headerShadow(container)).toBeNull();
      expect(publishedHeight(container)).toBe('');
      expect(observers).toHaveLength(0);
      expect(screen.getByText('Rows')).toBeInTheDocument();
    });
  });

  describe('scroll container', () => {
    /**
     * A router's scroll restoration finds the element by the stamped id, and
     * windowed descendants receive it through the callback — both must point
     * at the element that actually scrolls.
     */
    it('hands the scroll container to the caller and stamps the restoration id', () => {
      const onScrollElementChange = vi.fn();
      const { container } = renderLayout({ onScrollElementChange });
      const scroller = scrollElement(container);

      expect(onScrollElementChange).toHaveBeenCalledExactlyOnceWith(scroller);
      expect(scroller).toHaveAttribute('data-scroll-restoration-id', 'files');
      expect(scroller).toHaveClass('overflow-y-auto');
    });

    it('reveals the header shadow once scrolled and hides it again at the top', () => {
      const { container } = renderLayout();
      const scroller = scrollElement(container);
      const shadow = headerShadow(container) as HTMLElement;

      expect(shadow).toHaveClass('opacity-0');
      expect(shadow.style.opacity).toBe('');

      // jsdom's `scrollTop` setter is a no-op, so the value is pinned directly.
      Object.defineProperty(scroller, 'scrollTop', {
        configurable: true,
        writable: true,
        value: 120,
      });
      fireEvent.scroll(scroller);
      expect(shadow.style.opacity).toBe('1');

      scroller.scrollTop = 0;
      fireEvent.scroll(scroller);
      expect(shadow.style.opacity).toBe('0');
    });
  });

  describe('condensing header', () => {
    /** A render-function header that prints the state it was handed. */
    const condensingHeader = ({ condensed }: ListPageLayoutHeaderState) => (
      <div>{condensed ? 'Condensed' : 'Full'}</div>
    );

    const headerWrapper = (root: HTMLElement) =>
      root.querySelector(
        '[data-slot="list-page-layout-header"]'
      ) as HTMLElement;

    /** jsdom's `scrollTop` setter is a no-op, so the value is pinned directly. */
    const scrollTo = (root: HTMLElement, top: number) => {
      const scroller = scrollElement(root);
      Object.defineProperty(scroller, 'scrollTop', {
        configurable: true,
        writable: true,
        value: top,
      });
      fireEvent.scroll(scroller);
    };

    it('condenses past condenseAfter below lg, and returns at the top', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout({
        condenseAfter: 60,
        stickyHeader: condensingHeader,
      });
      expect(screen.getByText('Full')).toBeInTheDocument();
      expect(headerWrapper(container)).not.toHaveAttribute('data-condensed');

      scrollTo(container, 60);
      expect(screen.getByText('Full')).toBeInTheDocument();

      scrollTo(container, 61);
      expect(screen.getByText('Condensed')).toBeInTheDocument();
      expect(headerWrapper(container)).toHaveAttribute('data-condensed', '');

      scrollTo(container, 0);
      expect(screen.getByText('Full')).toBeInTheDocument();
      expect(headerWrapper(container)).not.toHaveAttribute('data-condensed');
    });

    /** From `lg` up the header scrolls away, so there is nothing to condense. */
    it('never condenses from lg up', () => {
      setViewport(BREAKPOINTS.lg);
      const { container } = renderLayout({
        condenseAfter: 60,
        stickyHeader: condensingHeader,
      });

      scrollTo(container, 400);

      expect(screen.getByText('Full')).toBeInTheDocument();
      expect(headerWrapper(container)).not.toHaveAttribute('data-condensed');
    });

    it('returns to full size when the viewport grows past lg', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout({
        condenseAfter: 60,
        stickyHeader: condensingHeader,
      });
      scrollTo(container, 400);
      expect(screen.getByText('Condensed')).toBeInTheDocument();

      setViewport(BREAKPOINTS.lg);
      act(() => emitViewportChange());

      expect(screen.getByText('Full')).toBeInTheDocument();
    });

    it('never condenses without condenseAfter', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout({ stickyHeader: condensingHeader });

      scrollTo(container, 400);

      expect(screen.getByText('Full')).toBeInTheDocument();
      expect(headerWrapper(container)).not.toHaveAttribute('data-condensed');
    });

    /**
     * Condensing shortens the header, and the browser's scroll anchoring takes
     * the same pixels off `scrollTop` to keep the list still. Counted from the
     * column top, that put a page parked just past the threshold back under it
     * and the header flickered. Counted from the list, it stays condensed until
     * the list itself is back above the threshold.
     */
    it('stays condensed when scroll anchoring takes back what the header lost', () => {
      setViewport(BREAKPOINTS.lg - 1);
      headerHeight = 58;
      const { container } = renderLayout({
        condenseAfter: 60,
        stickyHeader: condensingHeader,
      });

      scrollTo(container, 65);
      expect(screen.getByText('Condensed')).toBeInTheDocument();

      // The header lost 14px, and anchoring moved the scroll position with it.
      headerHeight = 44;
      scrollTo(container, 51);
      expect(screen.getByText('Condensed')).toBeInTheDocument();

      // 47 + 14 = 61: the list is still past the threshold.
      scrollTo(container, 47);
      expect(screen.getByText('Condensed')).toBeInTheDocument();

      // 46 + 14 = 60: it is not, and the header returns.
      scrollTo(container, 46);
      expect(screen.getByText('Full')).toBeInTheDocument();
    });

    it('tightens the inset of a plain-node header too', () => {
      setViewport(BREAKPOINTS.lg - 1);
      const { container } = renderLayout({ condenseAfter: 60 });

      scrollTo(container, 400);

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(headerWrapper(container)).toHaveAttribute('data-condensed', '');
    });
  });

  describe('class names', () => {
    /** The body's own `pb-3` must give way, or a page's inset stacks on it. */
    it('lets bodyClassName replace the body inset', () => {
      const { container } = renderLayout({ bodyClassName: 'pb-16' });
      const body = container.querySelector(
        '[data-slot="list-page-layout-body"]'
      );

      expect(body).toContainElement(screen.getByText('Rows'));
      expect(body).toHaveClass('pb-16');
      expect(body).not.toHaveClass('pb-3');
    });

    it('puts contentClassName on the column that holds header and body', () => {
      const { container } = renderLayout({ contentClassName: 'max-w-5xl' });

      expect(contentColumn(container)).toHaveClass('max-w-5xl');
      expect(contentColumn(container)).toContainElement(
        screen.getByText('Header')
      );
    });
  });
});
