'use client';

import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

function Input({ className, type, ref, ...props }: ComponentProps<'input'>) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        // The field edge lives on the InputGroup shell; the control carries
        // none of its own horizontal padding.
        'h-full w-full min-w-0 px-0',
        'bg-transparent',
        // Focus is signalled by the shell's 1px --input-focus border, never by
        // an outer ring — brand colour never visualises form-control focus.
        'focus-visible:outline-none',
        'transition-[color,box-shadow]',

        //Disabled
        'disabled:pointer-events-none',
        'disabled:cursor-not-allowed',
        'disabled:text-ink-inactive',
        'disabled:placeholder:text-ink-inactive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
