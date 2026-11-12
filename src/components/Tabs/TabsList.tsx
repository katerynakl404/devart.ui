'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const TabsList = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      // The shared bottom edge the active tab's underline lies on: a border on
      // a `::before` of no height, out of the layout. As the list's own border
      // it rendered 0.8px at 125% display scaling while the triggers stepped
      // down onto it by a full 1px (`-mb-px`) — the strip came out 39.8px and
      // everything under it sat on a quarter device pixel (§171). `::before`,
      // not `::after`: painted before the triggers, so the underline lies over
      // it.
      //
      // The gap down to the panel lives HERE, not on TabsContent. It is the gap
      // between the strip and what the strip controls, so it belongs to the
      // strip: a Tabs used without a visible list (sections, a stepped flow)
      // then starts flush with whatever sits beside it, instead of carrying an
      // orphan 16px that has nothing above it to separate from.
      className={cn(
        'relative mb-4 inline-flex items-center gap-2',
        "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:border-stroke before:border-b before:content-['']",
        className
      )}
      {...props}
    />
  );
};

TabsList.displayName = TabsPrimitive.List.displayName;

export { TabsList };
