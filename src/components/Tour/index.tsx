'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  resolveTargets,
  type TourTarget,
  useTargetRect,
} from '../../hooks/use-target-rect';
import { cn } from '../../lib/utils';
import { Annotation, AnnotationGroup } from '../Annotation';
import { Button } from '../Button';
import {
  Coachmark,
  type CoachmarkPlacement,
  type CoachmarkSide,
} from '../Coachmark';
import { Spotlight } from '../Spotlight';
import { StepProgress, type StepProgressStep } from '../StepProgress';

export interface TourAnnotation {
  /** The control(s) the label points at. */
  target: TourTarget;
  icon?: ReactNode;
  text: ReactNode;
}

export interface TourStep {
  id: string;
  /** What this step lights. */
  target: TourTarget;
  title: ReactNode;
  icon?: ReactNode;
  /** The coachmark's body. */
  content?: ReactNode;
  /** The step's short name in the progress read-out. Default: `title`, when it is a string. */
  label?: string;
  /** Preferred coachmark sides, in order. */
  side?: CoachmarkSide | readonly CoachmarkSide[];
  width?: 'md' | 'lg';
  /** Labels drawn under the lit area; listed inside the coachmark ≤ 640px. */
  annotations?: TourAnnotation[];
}

export type TourCloseReason = 'finish' | 'skip' | 'escape';

export interface TourLabels {
  back?: string;
  next?: string;
  skip?: string;
  finish?: string;
}

export interface TourProps {
  open?: boolean;
  steps: TourStep[];
  /** 0-based index of the step on screen — the caller holds it. @default 0 */
  step?: number;
  onStepChange?: (step: number) => void;
  onClose?: (reason: TourCloseReason) => void;
  /** Back on the first step — the tour continues a longer flow. Shows Back there. */
  onBeforeFirst?: () => void;
  /**
   * The flow the tour is part of, for the read-out: its steps and where the
   * tour starts in it. Default: the tour's own steps.
   */
  progress?: { steps: StepProgressStep[]; offset?: number };
  /** @default { back: 'Back', next: 'Next', skip: 'Skip', finish: 'Done' } */
  labels?: TourLabels;
  /** The area the tour may use (selector, element or ref). Default: the viewport. */
  boundary?: TourTarget;
  /** Grows the lit area on every side. @default 8 */
  padding?: number;
}

const DEFAULT_LABELS: Required<TourLabels> = {
  back: 'Back',
  next: 'Next',
  skip: 'Skip',
  finish: 'Done',
};

/* How long a closing tour stays mounted while it fades out. */
const LEAVE_MS = 300;

/* Labels drawn below the lit area clear it — or the coachmark, when the card
   sits under the target — by 34px. */
const ANNOTATION_GAP = 34;

/* The annotations' texts, inside the bottom-sheet coachmark ≤ 640px. */
const TOUR_LIST = cn(
  'm-0 mt-3 hidden list-none flex-col gap-2 p-0',
  '[@media(max-width:640px)]:flex'
);
const TOUR_LIST_ITEM = cn(
  'flex items-center gap-2 text-ink-body text-sm',
  '[&_b]:font-semibold [&_b]:text-ink-primary',
  '[&_strong]:font-semibold [&_strong]:text-ink-primary'
);
const TOUR_LIST_ICON = cn(
  'flex size-6 flex-none items-center justify-center rounded-full',
  'bg-brand-primary/10 text-ink-highlight [&_svg]:size-3.5'
);

/**
 * A guided walk over the real interface: `Spotlight` + `Coachmark` (+
 * `AnnotationGroup`) per step, with the step held by the caller.
 *
 * The coachmark carries the progress (`StepProgress size="sm" fill`), the
 * step's title and body, and Back · Skip · Next (Done on the last step).
 * Keyboard: → next, ← back, Esc closes — ignored while typing in a field.
 * Focus moves to the coachmark on every step; a click on the scrim nudges it.
 * Closing (`open` → false) fades the whole tour out over 300ms, then unmounts.
 */
function Tour({
  open = false,
  steps,
  step = 0,
  onStepChange,
  onClose,
  onBeforeFirst,
  progress,
  labels,
  boundary,
  padding,
}: TourProps) {
  const i = Math.max(0, Math.min(step, steps.length - 1));
  const current: Partial<TourStep> = steps[i] ?? {};
  const last = i === steps.length - 1;
  const L = { ...DEFAULT_LABELS, ...labels };

  /* Closing never just vanishes: open → false keeps the tour mounted for
     LEAVE_MS while every layer fades out and takes no clicks. */
  const [shown, setShown] = useState(open);
  const [leaving, setLeaving] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reacts to `open` only — `shown` is read to skip a close that never opened
  useEffect(() => {
    if (open) {
      setShown(true);
      setLeaving(false);
      return;
    }
    if (!shown) return;
    setLeaving(true);
    const timer = setTimeout(() => {
      setShown(false);
      setLeaving(false);
    }, LEAVE_MS);
    return () => clearTimeout(timer);
  }, [open]);
  const mounted = open || shown;

  const geo = useTargetRect(mounted ? current.target : null, {
    padding,
    boundary,
  });
  const coachmark = useRef<HTMLDivElement | null>(null);
  const [nudge, setNudge] = useState(0);
  const [placed, setPlaced] = useState<CoachmarkPlacement | null>(null);

  /* the latest callbacks, for the document listener and the buttons */
  const props = useRef({ onStepChange, onClose, onBeforeFirst });
  props.current = { onStepChange, onClose, onBeforeFirst };

  const canBack = i > 0 || Boolean(onBeforeFirst);
  const go = (n: number) => props.current.onStepChange?.(n);
  const next = () => {
    if (last) props.current.onClose?.('finish');
    else go(i + 1);
  };
  const back = () => {
    if (i > 0) go(i - 1);
    else props.current.onBeforeFirst?.();
  };

  /* Every step: bring the target into view, then move focus to the card. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-runs per step on purpose — `i` is the step, and the target is that step's
  useEffect(() => {
    if (!open) return;
    const first = resolveTargets(current.target)[0];
    first?.scrollIntoView?.({ block: 'nearest' });
    const timer = setTimeout(
      () => coachmark.current?.focus({ preventScroll: true }),
      60
    );
    return () => clearTimeout(timer);
  }, [open, i]);

  /* Re-registered every render, so the handler always sees this step. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      const t = event.target as HTMLElement | null;
      const editing =
        t &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (editing) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowLeft' && canBack) {
        event.preventDefault();
        back();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        props.current.onClose?.('escape');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  if (!mounted) return null;

  const prog = progress ?? {
    steps: steps.map((s) => ({
      id: s.id,
      label: s.label || (typeof s.title === 'string' ? s.title : undefined),
    })),
    offset: 0,
  };
  const annotations = current.annotations ?? [];
  const r = geo.rect;
  const annotationTop = r
    ? Math.max(
        r.bottom,
        placed && placed.side === 'bottom' ? placed.bottom : 0
      ) + ANNOTATION_GAP
    : null;

  const footer = (
    <>
      {canBack ? (
        <Button variant="tertiary" size="sm" type="button" onClick={back}>
          {L.back}
        </Button>
      ) : null}
      <span data-slot="tour-spacer" className="flex-1" />
      {last ? null : (
        <Button
          variant="tertiary"
          size="sm"
          type="button"
          onClick={() => props.current.onClose?.('skip')}
        >
          {L.skip}
        </Button>
      )}
      <Button
        variant="primary"
        size="sm"
        type="button"
        data-tour-next=""
        onClick={next}
      >
        {last ? L.finish : L.next}
      </Button>
    </>
  );

  return (
    <>
      <Spotlight
        rect={r}
        bounds={geo.bounds}
        radius={geo.radius}
        leaving={leaving}
        onScrimClick={() => setNudge((n) => n + 1)}
      />
      {annotations.length ? (
        <AnnotationGroup top={annotationTop} leaving={leaving}>
          {annotations.map((a, k) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: annotations are positional within a step
            <Annotation key={k} target={a.target} icon={a.icon}>
              {a.text}
            </Annotation>
          ))}
        </AnnotationGroup>
      ) : null}
      <Coachmark
        ref={coachmark}
        rect={r}
        bounds={geo.bounds}
        leaving={leaving}
        side={current.side}
        width={current.width}
        nudge={nudge}
        onPlace={setPlaced}
        header={
          <StepProgress
            size="sm"
            fill
            showStepLabel
            steps={prog.steps}
            current={(prog.offset ?? 0) + i}
            aria-label="Progress"
          />
        }
        icon={current.icon}
        title={current.title}
        footer={footer}
      >
        {current.content}
        {annotations.length ? (
          <ul data-slot="tour-annotation-list" className={TOUR_LIST}>
            {annotations.map((a, k) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: annotations are positional within a step
              <li key={k} className={TOUR_LIST_ITEM}>
                {a.icon ? (
                  <span className={TOUR_LIST_ICON}>{a.icon}</span>
                ) : null}
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Coachmark>
    </>
  );
}

Tour.displayName = 'Tour';

export { Tour };
