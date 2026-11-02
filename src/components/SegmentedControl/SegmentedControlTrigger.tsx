'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { useSegmentedControl } from './SegmentedControlContext';

// Base holds only cross-variant primitives (layout, focus, disabled). The pill
// track's fill/shadow lives in the `default` variant so `underline` — a flat,
// content-width tab — doesn't inherit the raised-pill background or stretch.
const segmentedControlTriggerVariants = cva(
  cn(
    'inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap',
    'font-medium text-ink-secondary',
    'transition-[background-color,color,box-shadow] duration-fast',
    // Icon follows currentColor — no per-state icon override.
    '[&_svg]:shrink-0',

    // Hover (inactive only): half-step lift + neutral rim + primary text.
    'enabled:data-[state=inactive]:hover:bg-segctrl-hover-bg',
    'enabled:data-[state=inactive]:hover:text-ink-primary',
    'enabled:data-[state=inactive]:hover:shadow-segctrl-hover',

    // Active / selected: raised pill (Surface/Card light, Chips dark) + rim.
    'data-[state=active]:bg-surface-card',
    'dark:data-[state=active]:bg-surface-chips',
    'data-[state=active]:text-ink-primary',
    'data-[state=active]:shadow-segctrl-active',

    // Focus — brand-tinted ring with a Surface/Card gap.
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    // Disabled — unified opacity recipe.
    // Not `pointer-events-none`: it hides the not-allowed cursor, and the
    // tooltip that says why the control is off. A disabled control fires
    // nothing either way.
    'disabled:cursor-not-allowed disabled:opacity-disabled'
  ),
  {
    variants: {
      size: {
        sm: 'h-5 px-1 text-xs [&_svg]:size-3',
        md: 'h-8 px-3 text-sm [&_svg]:size-3.5',
      },
      // Inset one step from the track so the raised pill follows its corners.
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded',
        lg: 'rounded-md',
        xl: 'rounded-lg',
        full: 'rounded-full',
      },
      /**
       * DRAFT. What the selected half MEANS, for a control whose two options
       * are not equivalent.
       *
       * `neutral` is the default and the only one that existed: the selected
       * half is a raised card-tone pill, and which half that is carries no
       * meaning beyond "this one". Right for Read / Read & write, Light / Dark,
       * Create / Edit — alternatives of the same kind.
       *
       * `positive` and `negative` are for a control that states a FACT with a
       * consequence: included or excluded, allowed or blocked, on or off. A
       * column of these is read down at a glance, and a neutral pill makes the
       * reader parse the label on every row to find the exceptions; a green or
       * red fill is read without parsing. The tone belongs to the TRIGGER, not
       * to the control: only the option itself knows whether it is the
       * permissive one.
       *
       * Unselected, both are the same neutral text as any other trigger, and
       * hovered they lift like any other: the colour is the answer, not the
       * offer. A grey option turning red under the pointer announced a Deny
       * nobody had chosen. Only a `tinted` option — already that colour —
       * answers the pointer in its tone (below).
       */
      tone: {
        neutral: '',
        positive: cn(
          // One green and one red in both themes, white on both, like the
          // destructive button: --fb-green and --fb-red are the fills that do
          // not move with the theme.
          // The `dark:` line is not a second colour: the base recipe's
          // `dark:data-[state=active]:bg-surface-chips` is more specific than a
          // bare `data-[state=active]:`, and painted the chip grey over the fill
          // in dark theme — so the tone has to say it in dark as well.
          'data-[state=active]:bg-fb-green',
          'dark:data-[state=active]:bg-fb-green',
          'data-[state=active]:text-content-on-solid',
          'data-[state=active]:shadow-none'
        ),
        negative: cn(
          'data-[state=active]:bg-fb-red',
          'dark:data-[state=active]:bg-fb-red',
          'data-[state=active]:text-content-on-solid',
          'data-[state=active]:shadow-none'
        ),
      },
      /**
       * DRAFT. The value in effect on this row without being chosen on it —
       * inherited from a level above, or a default. The tone's fill at 10%,
       * with the tone's ink (--fb-green-text / --fb-red-text): a Badge's pale
       * fill, a step lighter because it sits on the recessed track, where 15%
       * left the red ink 4.4:1 on dark. The solid pill stays "chosen here";
       * the pale one is the same value, arrived from elsewhere. Inactive only
       * — a selected option is drawn selected. Hovered, it keeps its fill and
       * its ink and takes the rim every other option takes: a deeper fill
       * under the same ink dropped below 4.5:1 in both themes, and the base
       * recipe's white lift bleached it, which read as a fault.
       */
      tinted: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        tinted: true,
        tone: 'neutral',
        class:
          'data-[state=inactive]:bg-surface-card/60 data-[state=inactive]:text-ink-primary',
      },
      {
        tinted: true,
        tone: 'positive',
        class: cn(
          'data-[state=inactive]:bg-fb-green/10 data-[state=inactive]:text-fb-green-text',
          'enabled:data-[state=inactive]:hover:bg-fb-green/10',
          'enabled:data-[state=inactive]:hover:text-fb-green-text'
        ),
      },
      {
        tinted: true,
        tone: 'negative',
        class: cn(
          'data-[state=inactive]:bg-fb-red/10 data-[state=inactive]:text-fb-red-text',
          'enabled:data-[state=inactive]:hover:bg-fb-red/10',
          'enabled:data-[state=inactive]:hover:text-fb-red-text'
        ),
      },
    ],
    defaultVariants: {
      size: 'md',
      rounded: 'md',
      tone: 'neutral',
      tinted: false,
    },
  }
);

type SegmentedControlTriggerProps = ComponentProps<
  typeof TabsPrimitive.Trigger
> &
  VariantProps<typeof segmentedControlTriggerVariants> & {
    /**
     * Read after the label while `tinted` and not selected, so a screen reader
     * hears the value in effect, not only "not checked". Hidden from sight —
     * the pale fill says it there.
     */
    tintedLabel?: string;
  };

const SegmentedControlTrigger = ({
  className,
  tone,
  tinted,
  tintedLabel = 'in effect',
  ref,
  onMouseDown,
  onKeyDown,
  children,
  ...props
}: SegmentedControlTriggerProps) => {
  /* `size` and `rounded` come from the control, because the track and its pills
     have to agree. `tone` does not: it is a property of the one option, so it
     is passed per trigger. */
  const { size, rounded, deselectable, semantics, value, clear } =
    useSegmentedControl();
  const selected = value === props.value;
  // `deselectable`: a press on the selected option clears it. Handled before
  // Radix's own handler, which ignores that press — `preventDefault` is what
  // tells Radix to stand down.
  const clears = deselectable && !props.disabled && selected;
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-tinted={tinted ? '' : undefined}
      {...(semantics === 'radio'
        ? {
            role: 'radio',
            'aria-checked': selected,
            'aria-selected': undefined,
            'aria-controls': undefined,
          }
        : {})}
      className={cn(
        segmentedControlTriggerVariants({ size, rounded, tone, tinted }),
        className
      )}
      onMouseDown={(e) => {
        onMouseDown?.(e);
        if (clears && !e.defaultPrevented && e.button === 0 && !e.ctrlKey) {
          e.preventDefault();
          clear();
        }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (
          clears &&
          !e.defaultPrevented &&
          (e.key === 'Enter' || e.key === ' ')
        ) {
          e.preventDefault();
          clear();
        }
      }}
      {...props}
    >
      {children}
      {tinted && !selected ? (
        <span className="sr-only">, {tintedLabel}</span>
      ) : null}
    </TabsPrimitive.Trigger>
  );
};

SegmentedControlTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { SegmentedControlTrigger, segmentedControlTriggerVariants };
