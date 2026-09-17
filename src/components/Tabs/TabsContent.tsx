'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

const TabsContent = ({
  className,
  ref,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        // Radix hides the inactive panel with the `hidden` attribute, and that
        // is only `display:none` from the UA stylesheet — any display class a
        // consumer passes (`flex`, `grid`, `block`) outranks it and brings the
        // panel back as an empty box that pushes the active one down. Pin it.
        'data-[state=inactive]:!hidden',
        'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',
        className
      )}
      {...props}
    />
  );
};

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { TabsContent };
