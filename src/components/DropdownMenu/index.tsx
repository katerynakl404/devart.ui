'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentProps, useContext, useMemo, useRef } from 'react';
import { composeRefs } from '../../lib/compose-refs';
import { DropdownMenuContext } from './context';
import { DropdownMenuCheckboxItem } from './DropdownMenuCheckboxItem';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuRadioItem } from './DropdownMenuRadioItem';
import { DropdownMenuRow } from './DropdownMenuRow';
import {
  DropdownMenuSegmentedItem,
  type DropdownMenuSegmentedItemOption,
  type DropdownMenuSegmentedItemProps,
} from './DropdownMenuSegmentedItem';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuShortcut } from './DropdownMenuShortcut';
import { DropdownMenuSubContent } from './DropdownMenuSubContent';

/**
 * The root component that manages the open/closed state of the dropdown.
 */
const DropdownMenu = ({
  modal = true,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Root>) => {
  const triggerRef = useRef<HTMLElement>(null);
  const context = useMemo(() => ({ triggerRef, modal }), [modal]);

  return (
    <DropdownMenuContext.Provider value={context}>
      <DropdownMenuPrimitive.Root modal={modal} {...props} />
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

/**
 * The element (usually a button) that toggles the dropdown menu when clicked.
 */
const DropdownMenuTrigger = ({
  ref,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => {
  const context = useContext(DropdownMenuContext);
  const triggerRef = useMemo(
    () => composeRefs(ref, context?.triggerRef),
    [ref, context?.triggerRef]
  );

  return <DropdownMenuPrimitive.Trigger ref={triggerRef} {...props} />;
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

/**
 * A wrapper to group related menu items, often used in conjunction with a label.
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/**
 * Portals the menu content into a different part of the DOM to ensure correct stacking and positioning.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/**
 * The root component for a nested submenu.
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * A group of radio items where only one item can be selected at a time.
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRow,
  DropdownMenuSegmentedItem,
  type DropdownMenuSegmentedItemOption,
  type DropdownMenuSegmentedItemProps,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
};
