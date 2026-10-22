import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react';

interface UseCloseOnViewportChangeProps {
  enabled: boolean;
  contentRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

/**
 * Closes on any scroll or a window resize while enabled. Scrolling inside the
 * content is the one exception: the panel itself may be scrollable.
 */
export const useCloseOnViewportChange = ({
  enabled,
  contentRef,
  onClose,
}: UseCloseOnViewportChangeProps) => {
  const onCloseRef = useRef(onClose);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!enabled) return;

    const handleViewportChange = (event: Event) => {
      if (
        event.target instanceof Node &&
        contentRef.current?.contains(event.target)
      ) {
        return;
      }

      onCloseRef.current();
    };

    // Capture phase: scroll events do not bubble, so this is the only way to
    // see a scroll of any element rather than just the document.
    window.addEventListener('scroll', handleViewportChange, true);
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.removeEventListener('scroll', handleViewportChange, true);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [enabled, contentRef]);
};
