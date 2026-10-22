import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { PopoverContextValue, PopoverOpenSource } from './context';
import { useCloseOnViewportChange } from './use-close-on-viewport-change';
import { useHoverIntent } from './use-hover-intent';

const noop = () => {};

const DEFAULT_DELAY = 300;
const DEFAULT_CLOSE_DELAY = 160;

let warnedModalHover = false;

interface UsePopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  openOnHover?: boolean;
  delay?: number;
  closeDelay?: number;
  /** When true (default), a click pins an open popover so pointer-leave no longer closes it. */
  pinOnClick?: boolean;
  closeOnViewportChange?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Open state, hover/press interaction, and the value shared with Trigger and
 * Content. The root component only mounts the provider and Radix Root.
 */
export const usePopoverRoot = ({
  open: openProp,
  defaultOpen,
  modal = false,
  openOnHover = false,
  delay = DEFAULT_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  pinOnClick = true,
  closeOnViewportChange = false,
  onOpenChange,
}: UsePopoverRootProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen ?? false
  );
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const openRef = useRef(open);
  const openSourceRef = useRef<PopoverOpenSource>('keyboard');
  const pressSourceRef = useRef<PopoverOpenSource>('keyboard');
  const restoreFocusRef = useRef(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    openRef.current = open;

    if (open) return;

    // Runs for every close, including a parent setting `open={false}`, while
    // Radix still has the content mounted for its exit animation. Hand focus
    // back to the trigger only if the popover holds it; a hover-open never
    // took it. The next open starts from the Radix default unless an
    // interaction records its own source.
    restoreFocusRef.current =
      contentRef.current?.contains(document.activeElement) ?? false;

    openSourceRef.current = 'keyboard';
  }, [open]);

  useEffect(() => {
    if (openOnHover && modal && !warnedModalHover) {
      warnedModalHover = true;
      console.warn(
        '[Popover] `openOnHover` cannot be combined with `modal`: a modal popover disables pointer events outside its content, so the trigger could never be hovered again. Rendering as non-modal.'
      );
    }
  }, [openOnHover, modal]);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
      openRef.current = next;
    }

    if (next !== open) onOpenChange?.(next);
  };

  const show = (source: PopoverOpenSource) => {
    hoverIntent.cancel();

    if (openRef.current) return;

    openSourceRef.current = source;
    setOpen(true);
  };

  const dismiss = () => {
    if (!openRef.current) return;

    hoverIntent.cancel();
    setOpen(false);
  };

  const hoverIntent = useHoverIntent({
    enabled: openOnHover,
    delay,
    closeDelay,
    isOpenRef: openRef,
    onOpen: () => show('hover'),
    // With `pinOnClick`, only a hover-opened popover follows the pointer out;
    // a press or pin is the user's choice to keep it. Without it, any open
    // closes on leave.
    onClose: () => {
      if (!pinOnClick || openSourceRef.current === 'hover') dismiss();
    },
  });

  useCloseOnViewportChange({
    enabled: closeOnViewportChange && open,
    contentRef,
    onClose: dismiss,
  });

  const handleRadixOpenChange = (next: boolean) => {
    if (!openOnHover) {
      setOpen(next);
      return;
    }

    if (next) show(pressSourceRef.current);
    else dismiss();
  };

  const handleTriggerClick = (event: ReactMouseEvent<HTMLElement>) => {
    hoverIntent.cancel();
    // Enter / Space dispatch a click with `detail` 0; only those move focus
    // into the popover, a mouse press leaves it on the control.
    pressSourceRef.current = event.detail > 0 ? 'pointer' : 'keyboard';

    // A click on a hover-opened popover must not toggle it shut via Radix.
    // Source becomes a press so the next click can close; `pinOnClick` only
    // decides whether pointer-leave still dismisses after that.
    if (openRef.current && openSourceRef.current === 'hover') {
      event.preventDefault();
      openSourceRef.current = pressSourceRef.current;
      return;
    }

    // Slot runs the child's onClick first; when the child cancelled the
    // click, Radix skips its own toggle, so toggle here instead.
    if (!event.defaultPrevented) return;

    if (openRef.current) dismiss();
    else show(pressSourceRef.current);
  };

  const handleOpenAutoFocus = (event: Event) => {
    if (openSourceRef.current !== 'keyboard') event.preventDefault();
  };

  const handleCloseAutoFocus = (event: Event) => {
    if (!restoreFocusRef.current) event.preventDefault();
    restoreFocusRef.current = false;
  };

  const handleFocusOutside: PopoverContextValue['onFocusOutside'] = (event) => {
    // A menu re-focuses its own content when the pointer leaves an item;
    // focus moving to a container of the trigger is not leaving the popover.
    if (
      event.target instanceof Node &&
      event.target.contains(triggerRef.current)
    ) {
      event.preventDefault();
    }
  };

  const context: PopoverContextValue = {
    open,
    openOnHover,
    triggerRef,
    contentRef,
    onTriggerClick: openOnHover ? handleTriggerClick : noop,
    onTriggerPointerEnter: hoverIntent.onTriggerPointerEnter,
    onTriggerPointerLeave: hoverIntent.onTriggerPointerLeave,
    onContentPointerEnter: hoverIntent.onContentPointerEnter,
    onContentPointerLeave: hoverIntent.onContentPointerLeave,
    onOpenAutoFocus: openOnHover ? handleOpenAutoFocus : noop,
    onCloseAutoFocus: openOnHover ? handleCloseAutoFocus : noop,
    onFocusOutside: openOnHover ? handleFocusOutside : noop,
  };

  return {
    open,
    modal: openOnHover ? false : modal,
    context,
    onOpenChange: handleRadixOpenChange,
  };
};
