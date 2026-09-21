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
      // Shared bottom edge the active tab's underline overlaps (-mb-px on trigger).
      //
      // The gap down to the panel lives HERE, not on TabsContent. It is the gap
      // between the strip and what the strip controls, so it belongs to the
      // strip: a Tabs used without a visible list (sections, a stepped flow)
      // then starts flush with whatever sits beside it, instead of carrying an
      // orphan 16px that has nothing above it to separate from.
      className={cn(
        'mb-4 inline-flex items-center gap-2 border-stroke border-b',
        className
      )}
      {...props}
    />
  );
};

TabsList.displayName = TabsPrimitive.List.displayName;

export { TabsList };
