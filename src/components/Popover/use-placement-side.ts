import type { Content } from '@radix-ui/react-popover';
import {
  type ComponentProps,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import type { PopoverSide } from './context';
import { resolveSide } from './resolve-side';

type ContentProps = ComponentProps<typeof Content>;

interface UsePlacementSideProps {
  side: ContentProps['side'];
  fallbackSides?: readonly PopoverSide[];
  sideOffset: NonNullable<ContentProps['sideOffset']>;
  collisionPadding: ContentProps['collisionPadding'];
  contentRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
}

/**
 * Picks a side from `fallbackSides` when the preferred `side` does not fit.
 * Runs when the content node attaches (Radix mounts a tick after `open`), and
 * reads options through a ref so a later render cannot move an open panel.
 */
export const usePlacementSide = ({
  side,
  fallbackSides,
  sideOffset,
  collisionPadding,
  contentRef,
  triggerRef,
}: UsePlacementSideProps) => {
  const hasFallbackSides = Boolean(fallbackSides?.length);
  const [placementSide, setPlacementSide] = useState(side);

  const placementOptionsRef = useRef({
    side,
    fallbackSides,
    sideOffset,
    collisionPadding,
  });

  placementOptionsRef.current = {
    side,
    fallbackSides,
    sideOffset,
    collisionPadding,
  };

  const onContentNode = useCallback(
    (content: HTMLElement | null) => {
      contentRef.current = content;

      const trigger = triggerRef.current;
      const options = placementOptionsRef.current;

      if (!content || !trigger || !options.fallbackSides?.length) return;

      setPlacementSide(
        resolveSide({
          sides: [options.side ?? 'bottom', ...options.fallbackSides],
          triggerRect: trigger.getBoundingClientRect(),
          contentSize: {
            width: content.offsetWidth,
            height: content.offsetHeight,
          },
          // Client size excludes the scrollbars, which is the space the
          // positioning actually has.
          viewport: {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
          },
          sideOffset: options.sideOffset,
          collisionPadding: options.collisionPadding ?? 0,
        })
      );
    },
    [contentRef, triggerRef]
  );

  return {
    side: hasFallbackSides ? placementSide : side,
    onContentNode,
  };
};
