import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type ComponentProps, useMemo } from 'react';
import { composeEventHandlers } from '../../lib/compose-event-handlers';
import { composeRefs } from '../../lib/compose-refs';
import { cn, focusRing } from '../../lib/utils';
import { usePopoverContext } from './context';

/**
 * The element (usually a button) that toggles the popover when clicked.
 */
const PopoverTrigger = ({
  ref,
  className,
  asChild,
  onClick,
  onPointerEnter,
  onPointerLeave,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) => {
  const context = usePopoverContext('PopoverTrigger');
  // Memoised so the consumer's callback ref is not detached and re-attached
  // on every render of the root.
  const triggerRef = useMemo(
    () => composeRefs(ref, context.triggerRef),
    [ref, context.triggerRef]
  );

  return (
    <PopoverPrimitive.Trigger
      ref={triggerRef}
      asChild={asChild}
      className={asChild ? className : cn(focusRing, className)}
      // Not composed through the helper on purpose: the root must see a click
      // the child's own `onClick` cancelled, because Radix then skips its
      // toggle. (The child's prop handler runs first; a component child's
      // internal handlers, such as a menu item's select, run after ours.)
      onClick={(event) => {
        onClick?.(event);
        context.onTriggerClick(event);
      }}
      onPointerEnter={composeEventHandlers(
        onPointerEnter,
        context.onTriggerPointerEnter
      )}
      onPointerLeave={composeEventHandlers(
        onPointerLeave,
        context.onTriggerPointerLeave
      )}
      {...props}
    />
  );
};

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export { PopoverTrigger };
