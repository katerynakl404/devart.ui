'use client';

import {
  Children,
  Fragment,
  isValidElement,
  type ReactNode,
  type Ref,
  useId,
  useRef,
} from 'react';
import {
  isPhoneViewport,
  radiusOf,
  resolveTargets,
  type TargetRect,
  type TourTarget,
  targetKey,
  unionRect,
  useMeasure,
  usePortal,
} from '../../hooks/use-target-rect';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';

export interface AnnotationProps {
  /** The control(s) the label points at — the ring goes around their union. */
  target: TourTarget;
  /** A glyph on a 24px disc before the text. */
  icon?: ReactNode;
  /** The label. `<b>`/`<strong>` take Text/Primary 600. */
  children?: ReactNode;
}

export interface AnnotationGroupProps {
  /** The line every label sits on (viewport px). `null` hides the group. */
  top?: number | null;
  /** `Annotation` elements. */
  children?: ReactNode;
  'aria-hidden'?: boolean | 'true' | 'false';
  /** Fades the group out — while it unmounts. */
  leaving?: boolean;
  className?: string;
  /** Render into this element instead of `document.body`. */
  portalContainer?: HTMLElement | null;
  ref?: Ref<HTMLDivElement>;
}

/* Hidden ≤ 640px — a coachmark lists the same texts there instead. */
const annotationGroupVariants = cva(
  cn(
    'pointer-events-none fixed inset-0 z-[calc(var(--spotlight-z)+1)]',
    'motion-reduce:animate-none [@media(max-width:640px)]:hidden'
  ),
  {
    variants: {
      leaving: {
        true: 'animate-spotlight-out',
        false: 'animate-annotation-in',
      },
    },
    defaultVariants: { leaving: false },
  }
);

const annotationVariants = cva(
  cn(
    'fixed flex max-w-60 items-center gap-2 px-3 py-2',
    'rounded-md border border-stroke bg-surface-card shadow-dropdown',
    'font-medium text-ink-body text-xs',
    '[transition:left_0.3s,top_0.3s] motion-reduce:transition-none',
    '[&_b]:font-semibold [&_b]:text-ink-primary',
    '[&_strong]:font-semibold [&_strong]:text-ink-primary'
  ),
  {
    variants: {
      /* Rendered invisible first to learn its width, then placed. */
      measuring: { true: 'invisible', false: '' },
    },
    defaultVariants: { measuring: false },
  }
);

const annotationIconVariants = cva(
  cn(
    'flex size-6 flex-none items-center justify-center rounded-full',
    'bg-brand-primary/10 text-ink-highlight [&_svg]:size-3.5'
  )
);

/** One label inside an `AnnotationGroup`. Renders nothing by itself. */
function Annotation(_props: AnnotationProps) {
  return null;
}

Annotation.displayName = 'Annotation';

interface Layout {
  /** the label's left edge */
  x: number;
  /** the target's ring */
  t: TargetRect;
  /** the target's centre */
  tx: number;
  /** where the arrow leaves the label */
  sx: number;
  sy: number;
  /** the ring's corner — concentric with the target's, 3px out */
  rad: number;
}

/** Neighbouring rings never touch: two side by side split the gap, 6px apart. */
const RING_GAP = 6;

/**
 * Labels that point at specific controls inside a lit area. Every label sits
 * on one line (`top`) and fans out from its target without overlapping its
 * neighbour — the first one ends just past its target, the rest start just
 * before theirs — and a curved brand arrow runs from it to a dashed ring
 * around the controls, concentric with them. Rings side by side keep 6px
 * apart. Hidden ≤ 640px.
 */
function AnnotationGroup({
  top,
  children,
  'aria-hidden': ariaHidden,
  leaving = false,
  className,
  portalContainer,
  ref,
}: AnnotationGroupProps) {
  const items = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => child.props as AnnotationProps);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const portal = usePortal(portalContainer);
  const headId = `${useId().replace(/[^\w-]/g, '')}-annotation-head`;

  const layout = useMeasure<(Layout | null)[] | null>(() => {
    if (isPhoneViewport() || top == null) return null;
    let minX = 12;
    const out = items.map((item, i): Layout | null => {
      const elements = resolveTargets(item.target);
      const t = unionRect(elements, 3);
      const el = labels.current[i];
      if (!t || !el) return null;
      const tx = (t.left + t.right) / 2;
      const w = el.offsetWidth;
      let x = i === 0 ? tx - w + 28 : tx - 28;
      x = Math.round(Math.max(minX, Math.min(x, window.innerWidth - w - 12)));
      minX = x + w + 12;
      const sx = Math.max(x + 18, Math.min(tx, x + w - 18));
      return { x, t, tx, sx, sy: top - 2, rad: radiusOf(elements) + 3 };
    });
    for (const a of out) {
      for (const b of out) {
        if (!a || !b || a === b || a.t.left >= b.t.left) continue;
        const sameRow = a.t.top < b.t.bottom && b.t.top < a.t.bottom;
        if (!sameRow || b.t.left - a.t.right >= RING_GAP) continue;
        const mid = (a.t.right + b.t.left) / 2;
        a.t = { ...a.t, right: mid - RING_GAP / 2 };
        b.t = { ...b.t, left: mid + RING_GAP / 2 };
      }
    }
    return out;
  }, [top, items.map((item) => targetKey(item.target)).join(',')]);

  return portal(
    <div
      ref={ref}
      data-slot="annotation-group"
      data-state={leaving ? 'leaving' : 'open'}
      aria-hidden={ariaHidden}
      className={cn(annotationGroupVariants({ leaving }), className)}
    >
      <svg
        aria-hidden="true"
        className="fixed inset-0 size-full overflow-visible"
      >
        <defs>
          <marker
            id={headId}
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" className="fill-brand-primary" />
          </marker>
        </defs>
        {(layout ?? []).map((l, i) =>
          l ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: one ring and arrow per label, in the labels' order
            <Fragment key={i}>
              <rect
                x={l.t.left}
                y={l.t.top}
                width={l.t.right - l.t.left}
                height={l.t.bottom - l.t.top}
                rx={l.rad}
                className="fill-none stroke-[1.5] stroke-brand-primary [stroke-dasharray:4_3]"
              />
              <path
                d={`M${l.sx} ${l.sy} C ${l.sx} ${l.sy - 18}, ${l.tx} ${l.t.bottom + 22}, ${l.tx} ${l.t.bottom + 3}`}
                markerEnd={`url(#${headId})`}
                className="fill-none stroke-2 stroke-brand-primary"
              />
            </Fragment>
          ) : null
        )}
      </svg>
      {items.map((item, i) => {
        const l = layout?.[i];
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: labels are positional — the layout above is indexed the same way
            key={i}
            ref={(node) => {
              labels.current[i] = node;
            }}
            data-slot="annotation"
            className={cn(annotationVariants({ measuring: !l }))}
            style={l ? { left: l.x, top: top ?? 0 } : { top: top ?? 0 }}
          >
            {item.icon ? (
              <span
                data-slot="annotation-icon"
                className={cn(annotationIconVariants())}
              >
                {item.icon}
              </span>
            ) : null}
            <span>{item.children}</span>
          </div>
        );
      })}
    </div>
  );
}

AnnotationGroup.displayName = 'AnnotationGroup';

export {
  Annotation,
  AnnotationGroup,
  annotationGroupVariants,
  annotationIconVariants,
  annotationVariants,
};
