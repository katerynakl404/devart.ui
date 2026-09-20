'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn, glyphStroke } from '../../lib/utils';
import { useInputGroup } from './InputGroupContext';

const inputGroupAddonVariants = cva(
  cn(
    'flex h-full items-center justify-center gap-2',
    'cursor-text select-none',

    // Disabled
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:text-ink-inactive',
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:[&>button]:text-ink-inactive',
    'group-has-[[data-slot=input-group-control]:disabled]/input-group:cursor-not-allowed',

    // Kbd shortcut styling
    '[&>kbd]:rounded-[calc(var(--radius)-5px)]',

    /* A decorative glyph reads as part of the placeholder, not as content: it
       takes the placeholder's own ink so an empty field is one weight of grey
       rather than two. Scoped to the addon's direct `svg` so addon *text* and
       a `kbd` keep the addon colour — those are labels, and a label at
       placeholder weight reads as disabled.

       (The kit puts the leading glyph on `--ink-secondary`, one step darker.
       This is a deliberate step lighter — see DESIGN-SYSTEM-CHANGES §50.) */
    '[&>svg]:text-ink-inactive',
    glyphStroke,

    /* A docked control is not decoration: it answers the pointer. Rest sits on
       the addon's own step and hover lifts to Text/Body, which is the kit's
       `.igrp-act` recipe exactly. Written as a child selector because the
       nested IconButton sets its own `text-ink-body`, and a plain class on the
       button would lose to it. No pill, no surface — the field already owns
       hover, focus and press. */
    '[&>button]:text-ink-secondary',
    '[&>button]:transition-colors',
    '[&>button:hover]:text-ink-body'
  ),
  {
    variants: {
      variant: {
        primary: 'text-ink-secondary',
        outline: 'text-ink-secondary',
      },
      /* Direct child, not descendant. The addon sizes ITS OWN decorative glyph;
         anything nested inside it that has a size of its own — an IconButton for
         clearing the field, the visibility toggle in PasswordInput — sizes its
         glyph by its own size step.

         As a descendant rule (`[&_svg]`) this out-specified every nested
         control: a `2xs` IconButton asking for a 14px glyph rendered 20px, and
         PasswordInput had to fight back with three `!size-4`. */
      /* The shared icon ladder — 14/16/16/20/20 for xs..xl. It is the same
         ladder Button and IconButton carry, so a field, a text button and an
         icon-only control at the same size step all show the same glyph. The
         kit states this outright and expresses it as one set of tokens
         (--icon-xs … --icon-xl) read by .btn, .iconbtn, .field and .igrp
         alike; here the three cva ladders have to agree by hand.

         `xl` repeats `lg` at 20px rather than taking the kit's 24px: a 24px
         glyph in a 44px field reads as an icon that outgrew its control, and
         it dwarfs the text beside it. The ladder repeats at both ends — 16
         across sm/md, 20 across lg/xl. */
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
          'has-[>kbd]:-ml-1'
        ),
        'inline-end': cn(
          'order-last ms-2',
          // kbds aligning
          'has-[>kbd]:-mr-1'
        ),
        'block-start': cn(
          'order-first w-full justify-start px-0 pt-3',
          // Padding adjustments
          'group-has-[>input]/input-group:pt-2.5',
          '[.border-b]:pb-3'
        ),
        'block-end': cn(
          'order-last w-full justify-start px-0 pb-3',
          // Padding adjustments
          'group-has-[>input]/input-group:pb-2.5',
          '[.border-t]:pt-3'
        ),
      },
    },
    compoundVariants: [
      /* The glyph gap has three steps, not one: 4 / 6 / 8 / 8 / 8, the same
         ladder Button carries.

         The 28px field tightens to 4px because at that height a 14px icon with
         8px of air each side is most of the remaining width — which is why the
         kit gives .field.is-xs its own gap rather than one value for the whole
         ladder. The 32px step sits at 6: it is the size the product uses most,
         and 8px there reads loose against a 14px label. */
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
