'use client';

import type { CSSProperties, MouseEvent, Ref } from 'react';
import {
  type TargetGeometry,
  type TargetRect,
  type TourTarget,
  type UseTargetRectOptions,
  usePortal,
  useTargetRect,
} from '../../hooks/use-target-rect';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

export interface SpotlightProps {
  /** What to light: a selector, an element, a ref, or an array of them (lit as one union). */
  target?: TourTarget;
  /** A rect already measured (and padded) — wins over `target`. `null` dims everything. */
  rect?: TargetRect | null;
  /** The area the scrim covers, with `rect`. Default: the boundary, else the viewport. */
  bounds?: TargetRect;
  /**
   * The cutout's and the ring's corner. Default: concentric with the targets
   * — their own radius + `padding` (`useTargetRect().radius`), else 12.
   */
  radius?: number;
  /** Grows the lit area on every side. @default 8 */
  padding?: number;
  /** The area the scrim may cover (selector, element or ref). Default: the viewport. */
  boundary?: TourTarget;
  /** A click anywhere on the scrim. The cutout takes no clicks of its own. */
  onScrimClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** The ring's breathing pulse. @default true */
  pulse?: boolean;
  /** Fades the layer out and lets every click through — while it unmounts. */
  leaving?: boolean;
  className?: string;
  /** Render into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
  ref?: Ref<HTMLDivElement>;
}

/* Fades in once; `leaving` fades it out and nothing in it takes a click.
   While it is in the page, a toast sits one step under the scrim: sonner's
   own layer (999999999) would put "X connected" over a dimmed page, on top of
   the tour that explains it. What pops out of a lit control — a tooltip, a
   menu, a popover (Radix's popper wrapper, z-50 inline, hence the !) — goes
   one step OVER it, beside the annotations and under the coachmark: under
   the scrim it read as a half-transparent grey box. */
const spotlightVariants = cva(
  cn(
    'pointer-events-none fixed inset-0 z-[var(--spotlight-z)] motion-reduce:animate-none',
    '[:root:has(&)_[data-sonner-toaster]]:z-[calc(var(--spotlight-z)-1)]',
    '[:root:has(&)_[data-radix-popper-content-wrapper]]:!z-[calc(var(--spotlight-z)+1)]'
  ),
  {
    variants: {
      leaving: {
        true: '[&_*]:!pointer-events-none animate-spotlight-out',
        false: 'animate-spotlight-in',
      },
    },
    defaultVariants: { leaving: false },
  }
);

/* The scrim is ONE layer over the bounds with a rounded hole cut by its
   clip-path, so the dim follows the ring's corners and no corner is left
   undimmed. The hole is not painted, so a click in it reaches the page. The
   colour is the modal scrim's own; only the blur is the tour's. The hole
   glides to the next target on --spotlight-move. */
const spotlightVeilVariants = cva(
  cn(
    'pointer-events-auto fixed bg-overlay-scrim backdrop-blur-spotlight',
    '[transition:clip-path_var(--spotlight-move)] motion-reduce:transition-none'
  )
);

/* The 2px brand ring with its halo and glow, on the cutout's corner (inline);
   `pulse` adds a second ring that breathes outward and fades, every 2.2s. */
const spotlightFrameVariants = cva(
  cn(
    'fixed border-2 border-brand-primary shadow-spotlight',
    '[transition:left_var(--spotlight-move),top_var(--spotlight-move),width_var(--spotlight-move),height_var(--spotlight-move),border-radius_var(--spotlight-move)]',
    'motion-reduce:transition-none'
  ),
  {
    variants: {
      pulse: {
        true: cn(
          "after:absolute after:-inset-0.5 after:rounded-[inherit] after:content-['']",
          'after:border-2 after:border-brand-primary',
          'after:animate-spotlight-ring motion-reduce:after:hidden'
        ),
        false: '',
      },
    },
    defaultVariants: { pulse: true },
  }
);

/**
 * The scrim's clip: the whole layer, minus a rounded rect — `evenodd`, so the
 * inner path is a hole. Coordinates are relative to the layer. The corner is
 * capped at half the hole's shorter side.
 */
function holePath(
  w: number,
  h: number,
  x: number,
  y: number,
  rw: number,
  rh: number,
  radius: number
) {
  const r = Math.max(0, Math.min(radius, rw / 2, rh / 2));
  const right = x + rw;
  const bottom = y + rh;
  return (
    `path(evenodd, "M0 0H${w}V${h}H0Z` +
    `M${x + r} ${y}H${right - r}A${r} ${r} 0 0 1 ${right} ${y + r}` +
    `V${bottom - r}A${r} ${r} 0 0 1 ${right - r} ${bottom}` +
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${bottom - r}` +
    `V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z")`
  );
}

/**
 * Dims and blurs the area around one or more targets. The cutout stays sharp
 * and live — clicks reach the controls inside it — and everything else takes
 * no clicks. A 2px brand ring with a soft glow and a pulse frames the cutout,
 * concentric with what it lights, and glides to the next one when the target
 * changes.
 *
 * Portalled to `document.body` (or the nearest `PortalContainer`), fixed to
 * the viewport, on `--spotlight-z`.
 */
function Spotlight({
  target,
  rect,
  bounds,
  radius,
  padding,
  boundary,
  onScrimClick,
  pulse = true,
  leaving = false,
  className,
  portalContainer,
  ref,
}: SpotlightProps) {
  const geo = useTargetRect(rect ? null : target, { padding, boundary });
  const portal = usePortal(portalContainer);
  const r = rect !== undefined ? rect : geo.rect;
  const b = bounds ?? geo.bounds;
  const corner = radius ?? (geo.radius || 12);
  const w = b.right - b.left;
  const h = b.bottom - b.top;

  const veilStyle: CSSProperties = {
    left: b.left,
    top: b.top,
    width: w,
    height: h,
    clipPath: r
      ? holePath(
          w,
          h,
          r.left - b.left,
          r.top - b.top,
          r.right - r.left,
          r.bottom - r.top,
          corner
        )
      : undefined,
  };

  return portal(
    <div
      ref={ref}
      data-slot="spotlight"
      data-state={leaving ? 'leaving' : 'open'}
      className={cn(spotlightVariants({ leaving }), className)}
    >
      <div
        data-slot="spotlight-veil"
        aria-hidden="true"
        className={cn(spotlightVeilVariants())}
        style={veilStyle}
        onClick={onScrimClick}
      />
      {r ? (
        <div
          data-slot="spotlight-frame"
          aria-hidden="true"
          className={cn(spotlightFrameVariants({ pulse }))}
          style={{
            left: r.left,
            top: r.top,
            width: r.right - r.left,
            height: r.bottom - r.top,
            borderRadius: corner,
          }}
        />
      ) : null}
    </div>
  );
}

Spotlight.displayName = 'Spotlight';

export {
  Spotlight,
  spotlightFrameVariants,
  spotlightVariants,
  spotlightVeilVariants,
  type TargetGeometry,
  type TargetRect,
  type TourTarget,
  type UseTargetRectOptions,
  useTargetRect,
};
