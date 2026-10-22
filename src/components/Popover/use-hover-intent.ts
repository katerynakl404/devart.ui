import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

interface UseHoverIntentProps {
  enabled: boolean;
  delay: number;
  closeDelay: number;
  isOpenRef: RefObject<boolean>;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Open/close timers for the hover interaction model. Hover only counts for a
 * mouse: pen and touch have no real hover and open through the click.
 */
export const useHoverIntent = ({
  enabled,
  delay,
  closeDelay,
  isOpenRef,
  onOpen,
  onClose,
}: UseHoverIntentProps) => {
  const openTimerRef = useRef<number | undefined>(undefined);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const latestRef = useRef({ onOpen, onClose });

  useLayoutEffect(() => {
    latestRef.current = { onOpen, onClose };
  });

  // Clears pending timers when hover is switched off and on unmount.
  useEffect(() => {
    if (enabled) return;

    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
  }, [enabled]);

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const cancel = () => {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
  };

  const scheduleOpen = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    window.clearTimeout(closeTimerRef.current);

    if (!enabled || isOpenRef.current) return;

    window.clearTimeout(openTimerRef.current);

    openTimerRef.current = window.setTimeout(
      () => latestRef.current.onOpen(),
      delay
    );
  };

  const scheduleClose = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    window.clearTimeout(openTimerRef.current);

    if (!enabled || !isOpenRef.current) return;

    window.clearTimeout(closeTimerRef.current);

    closeTimerRef.current = window.setTimeout(
      () => latestRef.current.onClose(),
      closeDelay
    );
  };

  const cancelClose = () => {
    window.clearTimeout(closeTimerRef.current);
  };

  return {
    cancel,
    onTriggerPointerEnter: scheduleOpen,
    onTriggerPointerLeave: scheduleClose,
    onContentPointerEnter: cancelClose,
    onContentPointerLeave: scheduleClose,
  };
};
