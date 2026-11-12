'use client';

import type { ComponentProps } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { useInputGroup } from './InputGroupContext';

const inputGroupAddonVariants = cva(
  cn(
    'flex h-full items-center justify-center gap-2',
    'cursor-text select-none',

    // Disabled
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:text-ink-inactive',
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:cursor-not-allowed',
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:[&>button]:text-ink-inactive',

    // Kbd shortcut styling
    '[&>kbd]:rounded-[calc(var(--radius)-5px)]',

    // Icon in the placeholder's grey; a docked button keeps its own ink
    '[&>svg]:text-ink-inactive',
    '[&>button]:text-ink-icon',
    '[&>button]:transition-colors',
    '[&>button:hover]:text-ink-icon-hover'
  ),
  {
    variants: {
      variant: {
        outline: 'text-ink-secondary',
      },
      size: {
        xs: '[&>svg]:size-3.5',
        sm: '[&>svg]:size-4',
        md: '[&>svg]:size-4',
        lg: '[&>svg]:size-5',
        xl: '[&>svg]:size-5',
      },
      align: {
        'inline-start': cn(
          'order-first me-2',
          // kbds aligning
          'has-[>kbd]:ml-[-0.35rem]'
        ),
        'inline-end': cn(
          'order-last ms-2 text-xs',
          // kbds aligning
          'has-[>kbd]:mr-[-0.35rem]'
        ),
        'block-start': cn(
          'order-first w-full justify-start pt-3',
          // Padding adjustments
          'group-has-[>input]/input-group:pt-2.5',
          '[.border-b]:pb-3'
        ),
        'block-end': cn(
          'order-last w-full justify-start pb-3',
          // Padding adjustments
          'group-has-[>input]/input-group:pb-2.5',
          '[.border-t]:pt-3'
        ),
      },
    },
    compoundVariants: [
      { size: 'xs', align: 'inline-start', class: 'me-1 gap-1' },
      { size: 'xs', align: 'inline-end', class: 'ms-1 gap-1' },
      { size: 'sm', align: 'inline-start', class: 'me-1.5 gap-1.5' },
      { size: 'sm', align: 'inline-end', class: 'ms-1.5 gap-1.5' },
    ],
    defaultVariants: {
      align: 'inline-start',
    },
  }
);

/**
 * Container for icons, text labels, or action buttons within an InputGroup.
 * It automatically delegates clicks to focus the parent input, unless the user clicks an interactive child (like a button).
 */
function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  const { size, variant, inputRef } = useInputGroup();

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: we can have onClick in this case without according key handle
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        inputGroupAddonVariants({ align, variant, size }),
        className
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        inputRef?.current?.focus();
      }}
      {...props}
    />
  );
}

export { InputGroupAddon, inputGroupAddonVariants };
