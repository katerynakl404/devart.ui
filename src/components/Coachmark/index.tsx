'use client';

import {
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  isPhoneViewport,
  type TargetRect,
  type TourTarget,
  usePortal,
  useTargetRect,
} from '../../hooks/use-target-rect';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import {
  type CoachmarkPosition,
  type CoachmarkSide,
  placeCoachmark,
} from './place';

export interface CoachmarkPlacement {
  top: number;
  bottom: number;
  side: CoachmarkSide;
}

export interface CoachmarkProps {
  /** What the card explains: a selector, an element, a ref, or an array of them. */
  target?: TourTarget;
  /** A rect already measured — wins over `target`. */
  rect?: TargetRect | null;
  /** The area the card is placed in, with `rect`. Default: the boundary, else the viewport. */
  bounds?: TargetRect;
  /** The area the card may use (selector, element or ref). Default: the viewport. */
  boundary?: TourTarget;
  /** Preferred sides, in order. @default ['bottom', 'top', 'right', 'left'] */
  side?: CoachmarkSide | readonly CoachmarkSide[];
  /** @default 'md' (352px) — `lg` is 464px. */
  width?: 'md' | 'lg';
  /** Above the title, e.g. `<StepProgress size="sm" fill />`. */
  header?: ReactNode;
  /** A glyph on a 32px disc before the title. */
  icon?: ReactNode;
  title?: ReactNode;
  /** The body. `<p>`s are spaced 12px; `<b>`/`<strong>` take Text/Body 600. */
  children?: ReactNode;
  /** The actions row. */
  footer?: ReactNode;
  /** A number — each change shakes the card once (e.g. a click on the scrim). */
  nudge?: number;
  /** Where the card landed; `null` while it is a bottom sheet or has no target. */
  onPlace?: (placement: CoachmarkPlacement | null) => void;
  /** Fades the card out and drops it 8px, taking no clicks — while it unmounts. */
  leaving?: boolean;
  className?: string;
  /** Render into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
  /** The card itself — focusable (`tabIndex={-1}`), so a tour can move focus to it. */
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_SIDES: readonly CoachmarkSide[] = [
  'bottom',
  'top',
  'right',
  'left',
];

/*
 * A popover-surface card. ≤ 640px it is a bottom sheet instead: inset 12px
 * from the sides and the bottom (plus the safe area), full width, no arrow.
 * The breakpoint is `max-width: 640px` on purpose — the same test the
 * placement runs in JS (`innerWidth <= 640`) — not Tailwind's `max-sm:`.
 */
const coachmarkVariants = cva(
  cn(
    'fixed z-[calc(var(--spotlight-z)+2)] max-w-[calc(100vw-1.5rem)] p-4',
    'rounded-lg border border-stroke bg-surface-card text-ink-primary shadow-dropdown',
    '[transition:top_var(--spotlight-move),left_var(--spotlight-move)]',
    'focus:outline-none',
    'motion-reduce:animate-none motion-reduce:transition-none',
    '[@media(max-width:640px)]:!left-3 [@media(max-width:640px)]:right-3',
    '[@media(max-width:640px)]:!top-auto [@media(max-width:640px)]:bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]',
    '[@media(max-width:640px)]:w-auto [@media(max-width:640px)]:max-w-none'
  ),
  {
    variants: {
      width: { md: 'w-[22rem]', lg: 'w-[29rem]' },
      /* Rises in once; a nudge shakes it without restarting the rise;
         leaving, it fades and drops 8px and takes no clicks. */
      motion: {
        in: 'animate-coachmark-in',
        nudge: 'animate-coachmark-nudge',
        out: 'pointer-events-none animate-coachmark-out',
      },
      /* Rendered once off-screen-invisible to learn its size, then placed. */
      measuring: { true: 'invisible top-0 left-0', false: '' },
    },
    defaultVariants: { width: 'md', motion: 'in', measuring: false },
  }
);

/* A 12px square turned 45° with two of its borders dropped, so the card's
   hairline runs on round it. It sits 7px outside the card. */
const coachmarkArrowVariants = cva(
  cn(
    'absolute size-3 rotate-45 border border-stroke bg-surface-card',
    '[@media(max-width:640px)]:hidden'
  ),
  {
    variants: {
      side: {
        right: '-left-[7px] border-t-0 border-r-0',
        left: '-right-[7px] border-b-0 border-l-0',
        bottom: '-top-[7px] border-r-0 border-b-0',
        top: '-bottom-[7px] border-t-0 border-l-0',
      },
    },
    defaultVariants: { side: 'bottom' },
  }
);

const coachmarkIconVariants = cva(
  cn(
    'flex size-8 flex-none items-center justify-center rounded-full',
    'bg-brand-primary/10 text-ink-highlight [&_svg]:size-4'
  )
);

const coachmarkBodyVariants = cva(
  cn(
    'mt-2 text-ink-secondary text-sm leading-relaxed',
    '[&_p+p]:mt-3 [&_p]:m-0',
    '[&_b]:font-semibold [&_b]:text-ink-body',
    '[&_strong]:font-semibold [&_strong]:text-ink-body'
  )
);

const samePosition = (a: CoachmarkPosition, b: CoachmarkPosition) =>
  a.x === b.x &&
  a.y === b.y &&
  a.side === b.side &&
  JSON.stringify(a.arrow) === JSON.stringify(b.arrow);

/**
 * The explanation next to what a spotlight lights: a popover-surface card
 * with an arrow at the target.
 *
 * It takes the first preferred side where it fits whole, never covering the
 * target, and re-places itself as the page moves. ≤ 640px it is a bottom
 * sheet. `role="dialog"` (non-modal), labelled by its title.
 */
function Coachmark({
  target,
  rect,
  bounds,
  boundary,
  side,
  width = 'md',
  header,
  icon,
  title,
  children,
  footer,
  nudge,
  onPlace,
  leaving = false,
  className,
  portalContainer,
  ref,
}: CoachmarkProps) {
  const geo = useTargetRect(rect !== undefined ? null : target, { boundary });
  const r = rect !== undefined ? rect : geo.rect;
  const b = bounds ?? geo.bounds;
  const portal = usePortal(portalContainer);
  const own = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<CoachmarkPosition | null>(null);
  const [nudging, setNudging] = useState(false);
  const titleId = useId();
  const prefer: readonly CoachmarkSide[] = side
    ? typeof side === 'string'
      ? [side]
      : side
    : DEFAULT_SIDES;
  const reported = useRef('');

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      own.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const report = (placement: CoachmarkPlacement | null) => {
    const key = JSON.stringify(placement);
    if (key === reported.current) return;
    reported.current = key;
    onPlace?.(placement);
  };

  /* Every render: measure the card, place it, report where it went. State
     only changes when the numbers do. */
  useLayoutEffect(() => {
    const el = own.current;
    if (!el) return;
    if (isPhoneViewport() || !r) {
      setPos(null);
      report(null);
      return;
    }
    const next = placeCoachmark(r, b, el.offsetWidth, el.offsetHeight, prefer);
    setPos((prev) => (prev && samePosition(prev, next) ? prev : next));
    report({ top: next.y, bottom: next.y + el.offsetHeight, side: next.side });
  });

  useEffect(() => {
    if (!nudge) return;
    setNudging(false);
    const frame = requestAnimationFrame(() => setNudging(true));
    const timer = setTimeout(() => setNudging(false), 420);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [nudge]);

  return portal(
    <div
      ref={setRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={title ? titleId : undefined}
      tabIndex={-1}
      data-slot="coachmark"
      data-side={pos ? pos.side : 'none'}
      data-state={leaving ? 'leaving' : 'open'}
      className={cn(
        coachmarkVariants({
          width,
          motion: leaving ? 'out' : nudging ? 'nudge' : 'in',
          measuring: !pos && !isPhoneViewport(),
        }),
        className
      )}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
    >
      {pos ? (
        <span
          data-slot="coachmark-arrow"
          aria-hidden="true"
          className={cn(coachmarkArrowVariants({ side: pos.side }))}
          style={pos.arrow}
        />
      ) : null}
      {header ? (
        <div data-slot="coachmark-header" className="mb-3">
          {header}
        </div>
      ) : null}
      {title ? (
        <div
          data-slot="coachmark-title-row"
          className="flex items-center gap-2.5"
        >
          {icon ? (
            <span
              data-slot="coachmark-icon"
              aria-hidden="true"
              className={cn(coachmarkIconVariants())}
            >
              {icon}
            </span>
          ) : null}
          <h3
            id={titleId}
            data-slot="coachmark-title"
            className="m-0 font-semibold text-base text-ink-primary"
          >
            {title}
          </h3>
        </div>
      ) : null}
      {children ? (
        <div data-slot="coachmark-body" className={cn(coachmarkBodyVariants())}>
          {children}
        </div>
      ) : null}
      {footer ? (
        <div
          data-slot="coachmark-footer"
          className="mt-4 flex items-center gap-2"
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

Coachmark.displayName = 'Coachmark';

export {
  Coachmark,
  type CoachmarkPosition,
  type CoachmarkSide,
  coachmarkArrowVariants,
  coachmarkBodyVariants,
  coachmarkIconVariants,
  coachmarkVariants,
};
