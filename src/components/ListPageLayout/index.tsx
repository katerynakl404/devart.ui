'use client';

import {
  type ReactNode,
  type UIEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/utils';
import {
  LIST_HEADER_HEIGHT_CSS_VAR,
  useListHeaderHeight,
} from './use-list-header-height';

/** What the layout tells a `stickyHeader` render function. */
interface ListPageLayoutHeaderState {
  /**
   * The page has scrolled past `condenseAfter` while the header is sticky —
   * hand it to `PageHeader`'s `condensed`. Always `false` from `lg` up, where
   * the header scrolls away with the page.
   */
  condensed: boolean;
}

interface ListPageLayoutProps {
  children: ReactNode;
  /**
   * The header above the list, sticky below `lg`. As a render function it
   * receives the header's state, so a header that condenses is told when.
   */
  stickyHeader?: ReactNode | ((state: ListPageLayoutHeaderState) => ReactNode);
  stickyHeaderClassName?: string;
  scrollRestorationId?: string;
  /** The centred column that holds the header and the body — its max width. */
  contentClassName?: string;
  /**
   * The body under the header. It owns the list's side and bottom inset
   * (`pb-3`) and the 12px between blocks, which `contentClassName` cannot
   * reach: padding there stacks on the body's own.
   */
  bodyClassName?: string;
  /**
   * Pixels of scroll after which the sticky header condenses: its inset
   * tightens and a render-function header receives `condensed`. Omit it and the
   * header never condenses.
   */
  condenseAfter?: number;
  onScrollElementChange?: (element: HTMLDivElement | null) => void;
}

const ListPageLayout = ({
  children,
  stickyHeader,
  stickyHeaderClassName,
  contentClassName,
  bodyClassName,
  condenseAfter,
  scrollRestorationId,
  onScrollElementChange,
}: ListPageLayoutProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  /** The header's height when it condensed; `null` while it is full size. */
  const condensedFromRef = useRef<number | null>(null);
  const [scrolledPast, setScrolledPast] = useState(false);

  const isSticky = useListHeaderHeight(
    headerRef,
    innerRef,
    Boolean(stickyHeader)
  );
  const condensed = condenseAfter !== undefined && isSticky && scrolledPast;

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget;
      const shadowElement = shadowRef.current;
      if (shadowElement) {
        shadowElement.style.opacity = scrollTop > 0 ? '1' : '0';
      }

      const header = headerRef.current;
      if (condenseAfter === undefined || !header) return;

      /* Counted from the list, not from the top of the column. A condensing
         header gets shorter, the list moves up, and scroll anchoring takes the
         difference off `scrollTop` — back under the threshold, so the header
         grew, anchoring gave the pixels back, and a page parked just past the
         threshold flickered between the two states for as long as it sat
         there. Adding back what the header has lost since it condensed keeps
         the number where the list is; without anchoring the same pixels are
         slack on the way back up. */
      const condensedFrom = condensedFromRef.current;
      const scrolled =
        condensedFrom === null
          ? scrollTop
          : scrollTop + condensedFrom - header.offsetHeight;
      const next = isSticky && scrolled > condenseAfter;

      condensedFromRef.current = next
        ? (condensedFrom ?? header.offsetHeight)
        : null;
      setScrolledPast(next);
    },
    [condenseAfter, isSticky]
  );

  return (
    <div
      ref={onScrollElementChange}
      data-scroll-restoration-id={scrollRestorationId}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: see the note above
      tabIndex={0}
      className="h-full min-h-0 w-full overflow-y-auto"
      onScroll={handleScroll}
    >
      <div
        ref={innerRef}
        className={cn(
          'mx-auto flex min-h-full w-full flex-col',
          contentClassName
        )}
      >
        {stickyHeader ? (
          <div
            ref={headerRef}
            data-slot="list-page-layout-header"
            data-condensed={condensed ? '' : undefined}
            className={cn(
              'sticky top-0 z-10 flex flex-col gap-3 bg-surface-page px-3 pt-2.5 pb-3 md:px-8 lg:static lg:pt-9',
              // Condensed, the inset tightens to 6px over PageHeader's own
              // collapse time, so the header shrinks as one thing.
              'transition-[padding] duration-slow data-[condensed]:py-1.5 motion-reduce:transition-none',
              stickyHeaderClassName
            )}
          >
            {typeof stickyHeader === 'function'
              ? stickyHeader({ condensed })
              : stickyHeader}

            <div
              ref={shadowRef}
              className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-surface-page to-transparent opacity-0"
            />
          </div>
        ) : null}

        <div
          data-slot="list-page-layout-body"
          className={cn(
            'flex flex-1 flex-col gap-3 px-3 pb-3 md:px-8',
            bodyClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

ListPageLayout.displayName = 'ListPageLayout';

export {
  LIST_HEADER_HEIGHT_CSS_VAR,
  ListPageLayout,
  type ListPageLayoutHeaderState,
  type ListPageLayoutProps,
};
