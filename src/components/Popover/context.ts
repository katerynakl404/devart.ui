import type { Content } from '@radix-ui/react-popover';
import {
  type ComponentProps,
  createContext,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useContext,
} from 'react';

type FocusOutsideEvent = Parameters<
  NonNullable<ComponentProps<typeof Content>['onFocusOutside']>
>[0];

/**
 * How the popover came to be open. Decides whether focus moves into the
 * content and whether a click on the trigger pins or closes it.
 */
export type PopoverOpenSource = 'hover' | 'pointer' | 'keyboard';

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

export interface PopoverContextValue {
  open: boolean;
  /** True when the root runs the hover interaction model. */
  openOnHover: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;

  onTriggerClick: (event: ReactMouseEvent<HTMLElement>) => void;
  onTriggerPointerEnter: (event: ReactPointerEvent<HTMLElement>) => void;
  onTriggerPointerLeave: (event: ReactPointerEvent<HTMLElement>) => void;

  onContentPointerEnter: (event: ReactPointerEvent<HTMLElement>) => void;
  onContentPointerLeave: (event: ReactPointerEvent<HTMLElement>) => void;
  onOpenAutoFocus: (event: Event) => void;
  onCloseAutoFocus: (event: Event) => void;
  onFocusOutside: (event: FocusOutsideEvent) => void;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export const usePopoverContext = (consumer: string): PopoverContextValue => {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error(`${consumer} must be rendered inside <Popover>`);
  }

  return context;
};
