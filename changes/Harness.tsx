import type { ReactNode } from 'react';
import { cn } from '../src/lib/utils';

/**
 * What kind of thing the case is — marked only when it changes how the panels
 * should be read. Git state is deliberately not one of these: whether a file is
 * committed is a question the client answers, and putting it on a design review
 * only invites the reader to think about branches instead of pixels.
 *
 * - `docs-only`            — a recipe written down, no code change.
 * - `proposed`             — not made anywhere yet; the After half is the
 *   proposal, simulated from outside the component.
 * - `not-a-library-change` — the defect is real but does not live in this
 *   package, so there is nothing here to accept or reject.
 * - `draft`                — built and working, but it exists to serve ONE
 *   design concept that has not been chosen. If that concept is dropped the
 *   variant goes with it, so nothing should be built on it meanwhile. This is
 *   not the same as `proposed`: a proposal has not been made, a draft has —
 *   what is undecided is whether it gets to stay.
 */
export type ChangeState =
  | 'docs-only'
  | 'proposed'
  | 'not-a-library-change'
  | 'draft';

const STATE_LABEL: Record<ChangeState, string> = {
  'docs-only': 'Documentation only',
  proposed: 'Proposed — not made yet',
  'not-a-library-change': 'Not a library change',
  draft: 'Draft — tied to an unchosen concept',
};

const STATE_CLASS: Record<ChangeState, string> = {
  'docs-only': 'border-stroke bg-surface-chips text-ink-secondary',
  proposed: 'border-brand-primary/40 bg-brand-primary/10 text-ink-body',
  'not-a-library-change': 'border-fb-red/40 bg-fb-red/10 text-ink-body',
  /* Attention, not brand: a draft is something to come back to, and the
     attention tokens are what this system already uses for "needs a decision"
     (the Workspaces warning, the unconfigured badge). */
  draft: 'border-fb-attention/40 bg-fb-attention/10 text-ink-body',
};

/** A caps micro-label — the same step the component stories use. */
function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'font-medium text-xxs uppercase leading-4 tracking-caps',
        className
      )}
    >
      {children}
    </span>
  );
}

/** A frozen class string, a token value, a selector — quoted verbatim. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-chips px-1 py-0.5 font-mono text-ink-body text-xxs">
      {children}
    </code>
  );
}

/**
 * One side of a comparison. `before` tints the frame red and after green, so
 * the two halves stay apart at a glance even when the change itself is a single
 * pixel.
 */
function Panel({
  side,
  note,
  children,
}: {
  side: 'before' | 'after';
  note?: ReactNode;
  children: ReactNode;
}) {
  const isBefore = side === 'before';
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col overflow-hidden rounded-lg border',
        isBefore ? 'border-fb-red/35' : 'border-fb-green/35'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 border-b px-3 py-1.5',
          isBefore
            ? 'border-fb-red/25 bg-fb-red/10'
            : 'border-fb-green/25 bg-fb-green/10'
        )}
      >
        <Eyebrow className={isBefore ? 'text-fb-red' : 'text-fb-green'}>
          {isBefore ? 'Before' : 'After'}
        </Eyebrow>
        {note ? (
          <span className="min-w-0 truncate text-ink-secondary text-xxs">
            {note}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 items-start bg-surface-card p-4">
        {children}
      </div>
    </div>
  );
}

export interface ChangeCaseProps {
  /** Section number in `DESIGN-SYSTEM-CHANGES.md`. */
  n: number | string;
  title: string;
  /** Source paths the change touches, repo-relative. */
  files?: string[];
  /** Marked only when the kind of case changes how to read it. */
  state?: ChangeState;
  /** Why the old state was wrong — one or two sentences, not a changelog. */
  why: ReactNode;
  /**
   * How the *Before* half is produced. The baseline is always the developer
   * storybook — the published catalog — never an earlier draft of this page.
   * Two kinds: a token override or a frozen class string reproduces the old
   * rendering exactly, while a hand-built replica only stands in for it.
   */
  beforeSource?: ReactNode;
  before?: ReactNode;
  after: ReactNode;
  beforeNote?: ReactNode;
  afterNote?: ReactNode;
  /** Anything that needs saying under the comparison. */
  footnote?: ReactNode;
}

/**
 * One numbered change, rendered as Before | After.
 *
 * With no `before` the case renders a single wide panel — that is the shape for
 * a new component, where there is nothing to compare against because the thing
 * did not exist.
 */
export function ChangeCase({
  n,
  title,
  files,
  state,
  why,
  beforeSource,
  before,
  after,
  beforeNote,
  afterNote,
  footnote,
}: ChangeCaseProps) {
  return (
    <section className="flex flex-col gap-3 border-stroke border-b pb-8 last:border-b-0">
      <header className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink-inactive text-sm tabular-nums">
            §{n}
          </span>
          <h3 className="font-semibold text-base text-ink-primary">{title}</h3>
          {state ? (
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-xxs',
                STATE_CLASS[state]
              )}
            >
              {STATE_LABEL[state]}
            </span>
          ) : null}
        </div>
        {files?.length ? (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {files.map((file) => (
              <Code key={file}>{file}</Code>
            ))}
          </div>
        ) : null}
        <p className="max-w-[72ch] text-ink-body text-sm leading-5">{why}</p>
      </header>

      {before ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel note={beforeNote} side="before">
            {before}
          </Panel>
          <Panel note={afterNote} side="after">
            {after}
          </Panel>
        </div>
      ) : (
        <Panel note={afterNote} side="after">
          {after}
        </Panel>
      )}

      {beforeSource ? (
        <p className="max-w-[72ch] text-ink-secondary text-xs leading-5">
          <span className="font-medium text-ink-body">Before is: </span>
          {beforeSource}
        </p>
      ) : null}

      {footnote ? (
        <p className="max-w-[72ch] text-ink-secondary text-xs leading-5">
          {footnote}
        </p>
      ) : null}
    </section>
  );
}

/** The page frame every change story shares. */
export function ChangePage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-[1100px] flex-col gap-8 p-2">
      <header className="flex flex-col gap-2">
        <Eyebrow className="text-ink-inactive">Proposed changes</Eyebrow>
        <h2 className="font-semibold text-ink-primary text-xl">{title}</h2>
        {intro ? (
          <p className="max-w-[72ch] text-ink-body text-sm leading-5">
            {intro}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

/**
 * A demo surface for a case whose subject is a state — hover, press, focus.
 * The instruction sits with the control, because a reviewer who does not know
 * to hover sees two identical panels and concludes nothing changed.
 */
export function TryIt({
  children,
  action,
}: {
  children: ReactNode;
  action: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {children}
      <Eyebrow className="text-ink-inactive">{action}</Eyebrow>
    </div>
  );
}
