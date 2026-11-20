'use client';

import { ChevronUp } from 'lucide-react';
import {
  Children,
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { type AlertProps, alertVariants } from '../Alert';
import { Button } from '../Button';

type AlertVariant = NonNullable<AlertProps['variant']>;

const ALERT_VARIANTS = {
  success: true,
  info: true,
  warning: true,
  error: true,
  neutral: true,
} satisfies Record<AlertVariant, true>;

// Folded, the box is one notice tall plus the edges showing under it: 8px per
// edge. `isolate` keeps the deck's own layering (notice over edges, the first
// edge over the second) from reaching anything outside it.
const alertStackVariants = cva('', {
  variants: {
    open: {
      true: 'flex flex-col gap-3',
      false: 'relative isolate',
    },
    edges: {
      1: 'pb-2',
      2: 'pb-4',
    },
  },
  defaultVariants: {
    open: false,
  },
});

// The edge of a notice lying behind the first: painted by `Alert`'s own recipe
// for that notice's variant (see `edgeClassName`), and placed here — 8px lower
// and 12px narrower a side per layer, so only its bottom shows. The edges
// spread on hover (their shared box is the `edges` group). The front edge is
// the control; it carries the focus ring itself, not being a `Button`. `p-0`
// drops the padding `Alert` lays out its copy with: an edge has none.
const alertStackEdgeVariants = cva(
  cn(
    'pointer-events-auto absolute cursor-pointer p-0',
    'transition-transform duration-150 motion-reduce:transition-none',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-surface-card',
    'focus-visible:ring-focus-ring-brand'
  ),
  {
    variants: {
      layer: {
        front: 'inset-x-3 top-2 z-[1] group-hover/edges:translate-y-1',
        back: 'inset-x-6 top-4 z-0 group-hover/edges:translate-y-2',
      },
      // Alone, the front edge reaches the bottom; with a second edge under it,
      // it stops 8px short so the second one shows.
      edges: {
        1: 'bottom-0',
        2: 'bottom-2',
      },
    },
    defaultVariants: {
      layer: 'front',
      edges: 1,
    },
  }
);

export interface AlertStackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The notices — `Alert`s. The deck paints each folded notice's edge from the
   * child's own `variant` prop, so a wrapper component must take `variant` and
   * pass it on: `<WorkspaceBlockedAlert variant="warning" />`. A child with no
   * `variant` prop gets a neutral edge.
   */
  children: ReactNode;
  /** @default 'Show Less' */
  lessLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  ref?: Ref<HTMLDivElement>;
  /** @default (n) => `Show ${n} more notice(s)` */
  moreLabel?: (count: number) => string;
  onOpenChange?: (open: boolean) => void;
}

const isAlertVariant = (value: unknown): value is AlertVariant =>
  typeof value === 'string' && value in ALERT_VARIANTS;

const variantOf = (child: ReactNode): AlertVariant => {
  const variant = isValidElement<{ variant?: unknown }>(child)
    ? child.props.variant
    : undefined;
  return isAlertVariant(variant) ? variant : 'neutral';
};

/** The edge of `child`: `Alert`'s surface for its variant, placed in the deck. */
const edgeClassName = (
  child: ReactNode,
  placement: VariantProps<typeof alertStackEdgeVariants>
) =>
  cn(
    alertVariants({ variant: variantOf(child) }),
    alertStackEdgeVariants(placement)
  );

const defaultMoreLabel = (count: number) =>
  `Show ${count} more ${count === 1 ? 'notice' : 'notices'}`;

/**
 * Several notices as one group. Folded, it is a deck: the first notice on top, the
 * next two lying behind it — each 8px lower and 12px narrower a side, so only their
 * bottom edges show, in their own colours. The page keeps one notice's height until
 * the person asks for the rest: the edges spread on hover, and a press opens the
 * pile; "Show Less" closes it. One notice is just that notice.
 *
 * The edges are the control — no extra "show more" button. The first edge takes the
 * focus and names what it opens. Opening or folding moves focus to the control that
 * replaced the pressed one ("Show Less", or the edge), so it never lands on a control
 * that just left — without scrolling the page to it.
 *
 * The first notice stays in the same place in the tree in every state, so it is
 * never remounted by opening, folding, or a second notice arriving.
 */
const AlertStack = ({
  children,
  lessLabel = 'Show Less',
  open,
  defaultOpen = false,
  className,
  ref,
  moreLabel = defaultMoreLabel,
  onOpenChange,
  ...props
}: AlertStackProps) => {
  const list = Children.toArray(children);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const moreRef = useRef<HTMLButtonElement>(null);
  const lessRef = useRef<HTMLButtonElement>(null);
  // Set by a toggle, so focus follows the person's press but not the first render.
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    // The page stays where it was: the opened pile pushes "Show Less" down,
    // and a scrolling focus would jump to it.
    (isOpen ? lessRef : moreRef).current?.focus({ preventScroll: true });
  }, [isOpen]);

  const toggle = (next: boolean) => {
    moveFocus.current = true;
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  if (list.length === 0) return null;

  const stacked = list.length > 1;
  const opened = stacked && isOpen;
  const folded = stacked && !isOpen;
  const [front, back] = list.slice(1, 3);
  const edges = back ? 2 : 1;

  return (
    <div
      ref={ref}
      className={cn(
        alertStackVariants({
          open: opened,
          edges: folded ? edges : undefined,
        }),
        className
      )}
      {...props}
    >
      <div className="relative z-[2]">{list[0]}</div>

      {opened ? (
        <>
          {list.slice(1)}
          <div className="flex">
            <Button
              ref={lessRef}
              variant="tertiary"
              size="xs"
              type="button"
              // Pulled 4px into the gap above so the row adds the label, not the
              // button's box; 4px to the 14px chevron, as on the kit's xs button.
              className="-my-1 gap-1 px-2 [&_svg]:size-3.5"
              aria-expanded
              rightSlot={<ChevronUp aria-hidden="true" />}
              onClick={() => toggle(false)}
            >
              {lessLabel}
            </Button>
          </div>
        </>
      ) : null}

      {folded ? (
        <div className="group/edges pointer-events-none absolute inset-0">
          <button
            ref={moreRef}
            type="button"
            aria-expanded={false}
            aria-label={moreLabel(list.length - 1)}
            className={edgeClassName(front, { layer: 'front', edges })}
            onClick={() => toggle(true)}
          />
          {back ? (
            // A second way to the same press: hidden from the tree and the Tab
            // order, so the deck is announced and reached once.
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className={edgeClassName(back, { layer: 'back' })}
              onClick={() => toggle(true)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

AlertStack.displayName = 'AlertStack';

export { AlertStack, alertStackEdgeVariants, alertStackVariants };
