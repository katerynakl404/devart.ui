'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Loader2,
  X,
} from 'lucide-react';
import {
  Children,
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { ProgressBar } from '../ProgressBar';

/**
 * The plate raised during and after a file upload: a summary bar that expands
 * into the per-file list, plus a dismiss ✕.
 *
 * Two hard parts of the contract, both from the kit's `.upl-tray`:
 *
 * 1. **The whole bar except the ✕ is the expand target**, and the ✕ is its
 *    *sibling* — never nested. A button inside a button is invalid markup and
 *    unreachable by keyboard. The chevron is a state indicator, not the click
 *    target.
 * 2. **The plate is positioning-neutral.** It has a width and a cap and no
 *    placement of its own; the page docks it. That is what lets the same plate
 *    sit in a drawer, a panel, or at the bottom of a page.
 */
const uploadTrayVariants = cva(
  cn(
    /* A WIDTH, not a cap. `w-full max-w-[26rem]` measures against the parent,
       so in a shrink-to-fit container — a fixed dock, an inline-flex wrapper —
       'full' is whatever the contents happen to need, and the plate narrowed
       as its rows left. The kit is explicit about this for its own popover:
       the width is fixed across every state, loading, empty, filled and
       scrolling alike, or the surface resizes as content arrives and goes.

       26rem is the kit's own width for this plate. `max-w-full` keeps it
       inside a viewport narrower than that. */
    'w-[26rem] max-w-full',
    'border border-stroke bg-surface-card',
    // 10px — the kit's own value, and not a step on the radius scale.
    'rounded-[0.625rem] shadow-overlay-soft',
    // The head's focus ring is inset because of this: an outside ring on a
    // full-bleed bar would be clipped away.
    'overflow-hidden'
  )
);

/**
 * The summary glyph carries the batch outcome — and never carries it alone.
 * The title states it in words too ("3 uploading", "5 uploads complete",
 * "1 of 5 uploads failed"), which is what keeps the plate off colour-only.
 */
const HEAD_ICON = (spinner: boolean) =>
  ({
    /**
     * `spinner` is a prop and not an assumption (DRAFT). The glyph spins
     * while something is actually moving — an upload — and a batch can also
     * be open and waiting on the PERSON: a list of things still to be set
     * up, where nothing will advance until somebody goes and does it. A
     * spinner there promises progress nothing is making, and left on screen
     * it reads as a transfer that has hung.
     *
     * And with no spinner there is NO GLYPH, not a still one. The mark in this
     * slot exists to say something is happening; held still it has nothing to
     * say, and a ring standing in an open batch reads as a loader that stalled.
     * The title already states the count, so the slot simply goes.
     */
    uploading: spinner ? (
      <Loader2
        aria-hidden="true"
        className="animate-spin motion-reduce:animate-none"
      />
    ) : null,
    complete: <CircleCheck aria-hidden="true" />,
    failed: <CircleAlert aria-hidden="true" />,
  }) as const;

const headIconVariants = cva(
  'flex size-4 shrink-0 items-center justify-center [&_svg]:size-4',
  {
    variants: {
      /* No colour in the head, on any status. The kit paints this glyph —
         brand while uploading, green complete, red failed — and its own rule
         is that the colour is never the only cue: the title states the outcome
         in words right beside it. Asked for a plain head, the words are what
         is left, and they were already carrying it.

         The ROWS keep their colour. That is where 'which file failed' is
         answered; the head only counts. */
      status: {
        uploading: 'text-ink-secondary',
        complete: 'text-ink-secondary',
        failed: 'text-ink-secondary',
      },
    },
    defaultVariants: { status: 'uploading' },
  }
);

/**
 * How long a settled row stays before it leaves, when `autoDismiss` is on.
 *
 * 4s is the package's own reading-time step, not a kit value — the kit has no
 * auto-dismiss at all. Long enough to see which file finished, short enough
 * that a batch of ten does not become a list to dismiss by hand.
 */
const AUTO_DISMISS_MS = 4000;

/**
 * What a row needs from the plate, and the one thing the plate needs back.
 *
 * A context rather than cloned children because the rows are the consumer's
 * elements: the plate cannot unmount them, so each row retires itself and says
 * so, and the plate only counts.
 */
const AutoDismissContext = createContext<{
  enabled: boolean;
  delay: number;
  onRowGone: () => void;
} | null>(null);

export type UploadTrayStatus = 'uploading' | 'complete' | 'failed';

export interface UploadTrayProps
  extends Omit<ComponentProps<'div'>, 'title'>,
    VariantProps<typeof uploadTrayVariants> {
  /** Which outcome the summary glyph paints. */
  status: UploadTrayStatus;
  /**
   * The summary sentence. It must state the outcome in words, not lean on the
   * glyph's colour — "5 uploads complete", "1 of 5 uploads failed".
   */
  title: string;
  /** The rows. `UploadTrayItem`, one per file. */
  children?: ReactNode;
  /** Controlled open state. Omit both to let the plate manage its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the `uploading` glyph turns (DRAFT). On by default, because a
   * transfer in flight is what the status usually means. Off for a batch that
   * is open and waiting on the PERSON — a list of things still to set up,
   * where nothing advances until somebody acts: a spinner there promises
   * progress nothing is making, and left on screen it reads as a transfer
   * that has hung.
   */
  spinner?: boolean;
  /** Renders the ✕. Omit it and the plate cannot be dismissed. */
  onDismiss?: () => void;
  /** @default 'Dismiss' */
  dismissLabel?: string;
  /** @default 'Show the files' */
  expandLabel?: string;
  /** @default 'Hide the files' */
  collapseLabel?: string;
  /**
   * Settled rows retire themselves: a row that reaches `done` is marked, waits
   * `autoDismissDelay`, then fades out and takes its own height with it. When
   * the last row goes, the plate follows and `onDismiss` fires.
   *
   * Off by default, and deliberately: a plate that clears itself is right for
   * a background upload the reader is not watching, and wrong for one they are
   * — a row they were reading disappears under them. A `failed` row never
   * retires either way, because it is the one row that still needs an answer.
   *
   * @default false
   */
  autoDismiss?: boolean;
  /** @default 4000 */
  autoDismissDelay?: number;
}

function UploadTray({
  status,
  title,
  children,
  open,
  defaultOpen = true,
  onOpenChange,
  onDismiss,
  dismissLabel = 'Dismiss',
  expandLabel = 'Show the files',
  collapseLabel = 'Hide the files',
  spinner = true,
  autoDismiss = false,
  autoDismissDelay = AUTO_DISMISS_MS,
  className,
  ...props
}: UploadTrayProps) {
  // Uncontrolled unless `open` is passed, so a consumer can dock the plate
  // without owning its state. Either way there is exactly one `isOpen`, and
  // both the chevron and the list read it — the kit's rule is that the visual
  // can never disagree with the announced state, and one value is how that is
  // guaranteed rather than remembered.
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  const toggle = () => {
    if (open === undefined) setUncontrolledOpen(!isOpen);
    onOpenChange?.(!isOpen);
  };

  /* The plate counts rows rather than reading them: it starts at however many
     children it was given and goes down as they retire. Counting is enough
     because the only question it has to answer is "is the list empty now". */
  const [liveRows, setLiveRows] = useState(() => Children.count(children));
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!autoDismiss) return;
    if (liveRows > 0) return;
    if (Children.count(children) === 0) return;
    setLeaving(true);
  }, [autoDismiss, liveRows, children]);

  return (
    <div
      className={cn(
        uploadTrayVariants(),
        leaving &&
          cn('animate-panel-out', 'motion-reduce:[animation-duration:1ms]'),
        className
      )}
      data-leaving={leaving ? '' : undefined}
      data-slot="upload-tray"
      data-status={status}
      onAnimationEnd={(event) => {
        if (!leaving) return;
        if (event.target !== event.currentTarget) return;
        onDismiss?.();
      }}
      {...props}
    >
      {/* The bar: a title that toggles, then two real controls.

          The kit makes the whole bar one button with the chevron as a mute
          indicator inside it. Both icons are tertiary buttons here instead, so
          the split is: the TITLE is the expand target, and the chevron and the
          ✕ are siblings of it. None is nested in another — a button inside a
          button is invalid markup and unreachable by keyboard, which is the
          trap the kit's own note is about, and two sibling toggles are fine:
          pressing either the title or the chevron opens the list. */}
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button
          aria-expanded={isOpen}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-2.5 px-1 py-1',
            'cursor-pointer rounded-md border-none bg-transparent text-left',
            'font-medium text-ink-primary text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset'
          )}
          data-slot="upload-tray-head"
          onClick={toggle}
          type="button"
        >
          {HEAD_ICON(spinner)[status] ? (
            <span className={headIconVariants({ status })}>
              {HEAD_ICON(spinner)[status]}
            </span>
          ) : null}
          <span className="min-w-0 flex-1 truncate">{title}</span>
        </button>

        <IconButton
          aria-label={isOpen ? collapseLabel : expandLabel}
          className="shrink-0"
          data-slot="upload-tray-toggle"
          onClick={toggle}
          size="xs"
          variant="tertiary"
        >
          {/* Points UP collapsed and down once open, off the same `isOpen` the
              head announces — so the visual cannot disagree with the announced
              state.

              Up-when-closed because the plate is docked at the BOTTOM of the
              screen: it is pinned by its lower edge, so the list arrives above
              the bar and the plate grows upward. The chevron points where the
              content is about to come from, which on a bottom-docked surface
              is the opposite of the same control in a page-top accordion. */}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'transition-transform duration-base',
              !isOpen && 'rotate-180'
            )}
          />
        </IconButton>

        {onDismiss ? (
          <IconButton
            aria-label={dismissLabel}
            className="shrink-0"
            data-slot="upload-tray-dismiss"
            onClick={onDismiss}
            size="xs"
            variant="tertiary"
          >
            <X aria-hidden="true" />
          </IconButton>
        ) : null}
      </div>

      {/* A divider above, so the bar reads as a header once the list is open. */}
      <div
        className="scrollbar-thin max-h-56 overflow-y-auto border-stroke border-t p-1"
        data-slot="upload-tray-list"
        hidden={!isOpen}
      >
        <AutoDismissContext.Provider
          value={{
            enabled: autoDismiss,
            delay: autoDismissDelay,
            onRowGone: () => setLiveRows((n) => n - 1),
          }}
        >
          {children}
        </AutoDismissContext.Provider>
      </div>
    </div>
  );
}

/**
 * `items-start` and a 2px nudge on the glyph are the kit’s rule for a row
 * with a progress bar or an error under the name: the glyph belongs to the
 * FIRST line, not to the block.
 *
 * A row with only a name has no second line to align away from, and the same
 * two rules then push the glyph 2px below the text it labels. So the row
 * centres instead — one line, one centre.
 */
const itemVariants = cva('flex gap-2.5 rounded-md p-2', {
  variants: {
    status: {
      uploading: '',
      done: '',
      /* No tint. The kit fills a failed row with 5% red; the plate here is a
         plain white surface, and a tinted band inside it reads as the plate
         having a state rather than one row having one.

         The failure is still not colour-only, which is the rule that matters:
         the glyph is red, the sentence under the name says what went wrong,
         and the title counts the failures. Losing the tint loses redundancy,
         not the message. */
      failed: '',
    },
  },
  defaultVariants: { status: 'uploading' },
});

/**
 * The leading slot is the FILE’s mark, not the row’s state: a glyph for its
 * kind, or a product’s own type chip. It takes no status colour, because the
 * row says its state at the end now — and a row saying it at both ends would
 * be saying it twice in two different alphabets.
 */
/**
 * The row's glyph slot.
 *
 * A BOX, not a bare size: an <svg> handed to this slot is an inline element,
 * so without a flex context it sits on the text baseline and the descender gap
 * pushes it down — 6px on a 36px row, which reads as an icon that is not
 * centred against its own row. The head's slot has always been flex; this one
 * only ever held components that set their own display, so the gap went
 * unnoticed until a page passed a plain glyph.
 */
const itemIconVariants = cva(
  'flex size-4 shrink-0 items-center justify-center text-ink-secondary [&_svg]:size-4'
);

/**
 * The state, at the end of the row.
 *
 * `uploading` shows nothing: the progress bar under the name is already the
 * answer, and a second mark beside it would be a second clock for one wait.
 */
const STATUS_MARK = {
  uploading: null,
  done: <CircleCheck aria-hidden="true" className="size-4 text-fb-green" />,
  failed: (
    <CircleAlert aria-hidden="true" className="size-4 text-fb-red-text" />
  ),
} as const;

export type UploadTrayItemStatus = 'uploading' | 'done' | 'failed';

export interface UploadTrayItemProps extends ComponentProps<'div'> {
  status: UploadTrayItemStatus;
  /** The file's name. Truncates — it is never wrapped. */
  name: string;
  /**
   * The leading mark. The kit draws a 16px glyph here; a product with its own
   * file-type chip passes that instead.
   */
  icon?: ReactNode;
  /** 0–100, while `status` is `uploading`. */
  progress?: number;
  /** A reading beside the name — a size, a count. Tabular. */
  meta?: ReactNode;
  /**
   * Why this one failed, in a sentence and no trailing period. It is required
   * in practice: the red glyph alone makes the failure colour-only.
   */
  error?: string;
  /** The one action a failed row gets — a `LinkButton` reading "Retry". */
  action?: ReactNode;
  /**
   * What the row does. **Required — a row is always the click target**, so
   * there is no second, inert kind of row to configure into existence.
   *
   * That is a real constraint and not a convenience: the hover surface is a
   * promise, and a row that paints one while doing nothing is the defect
   * §4 took off `Card variant="outline"`. Making the handler required is
   * what keeps the promise and the behaviour from ever separating.
   *
   * The row is NOT wrapped in a button. The NAME becomes the control and
   * stretches over the row with a pseudo-element — the package’s own
   * row-link recipe (`Table.md`) — so the accessible target stays the file
   * name rather than an unlabelled box the size of the row, and `action`
   * keeps working: a button inside a button is invalid markup and
   * unreachable by keyboard, which is the same trap the plate’s head and
   * ✕ are kept apart for.
   */
  onRowClick: () => void;
}

function UploadTrayItem({
  status,
  name,
  icon,
  progress,
  meta,
  error,
  action,
  onRowClick,
  className,
  ...props
}: UploadTrayItemProps) {
  /* Whether the row has anything under its name. It decides two things at
     once — where the row aligns and whether the glyph takes the nudge — so
     it is read once here rather than asked twice in the class strings. */
  const hasSecondLine =
    error !== undefined || (status === 'uploading' && progress !== undefined);

  const auto = useContext(AutoDismissContext);
  const ref = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  /* Only a `done` row retires. A `failed` one stays however the plate is
     configured — it is the only row still waiting for an answer, and clearing
     it would clear the question with it. */
  const retires = auto?.enabled === true && status === 'done';

  useEffect(() => {
    if (!retires) return;
    const id = setTimeout(() => {
      /* The row's own height is handed to the animation as a custom property,
         because `height: auto` cannot be animated and the row's height is
         whatever its name and progress bar made it. */
      const el = ref.current;
      if (el) el.style.setProperty('--row-height', `${el.offsetHeight}px`);
      setLeaving(true);
    }, auto.delay);
    return () => clearTimeout(id);
  }, [retires, auto?.delay]);

  if (gone) return null;

  return (
    <div
      className={cn(
        itemVariants({ status }),
        hasSecondLine ? 'items-start' : 'items-center',
        'relative cursor-pointer',
        'transition-colors duration-fast',
        'hover:bg-state-hover',
        'active:bg-state-pressed',
        leaving &&
          cn(
            'animate-row-out overflow-hidden',
            // NOT `motion-reduce:animate-none`: the row retires on
            // `animationend`, so removing the animation removes the
            // retirement with it and the plate never empties. Reduced
            // motion shortens the exit to one frame instead — one code
            // path, and no second timer to keep in step with it.
            'motion-reduce:[animation-duration:1ms]'
          ),
        className
      )}
      data-leaving={leaving ? '' : undefined}
      data-slot="upload-tray-item"
      data-status={status}
      onAnimationEnd={(event) => {
        if (!leaving) return;
        if (event.target !== event.currentTarget) return;
        setGone(true);
        auto?.onRowGone();
      }}
      ref={ref}
      {...props}
    >
      {icon ? (
        <span className={cn(itemIconVariants(), hasSecondLine && 'mt-0.5')}>
          {icon}
        </span>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* `after:absolute after:inset-0` is the stretched row link: the hit
            area is the row, the accessible target is the name. There is no
            plain-text branch — every row is a target. */}
        <button
          className={cn(
            'truncate text-left text-ink-body text-sm',
            'cursor-pointer border-none bg-transparent p-0',
            'after:absolute after:inset-0',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-inset'
          )}
          onClick={onRowClick}
          type="button"
        >
          {name}
        </button>

        {status === 'uploading' && progress !== undefined ? (
          <ProgressBar className="w-full" size="md" value={progress} />
        ) : null}

        {error ? (
          <span className="text-balance text-fb-red-text text-xs">{error}</span>
        ) : null}
      </div>

      {meta ? (
        <span className="relative shrink-0 text-ink-secondary text-xs tabular-nums">
          {meta}
        </span>
      ) : null}

      {action ? (
        <span className="relative flex shrink-0 items-center text-xs">
          {action}
        </span>
      ) : null}

      {STATUS_MARK[status] ? (
        <span
          className={cn(
            'flex shrink-0 items-center',
            /* Aligned to the name’s line when the row has a second one, the
               same rule the leading glyph follows. */
            hasSecondLine && 'mt-0.5 self-start'
          )}
          data-slot="upload-tray-item-status"
        >
          {STATUS_MARK[status]}
        </span>
      ) : null}
    </div>
  );
}

UploadTray.displayName = 'UploadTray';
UploadTrayItem.displayName = 'UploadTrayItem';

export { UploadTray, UploadTrayItem, itemVariants, uploadTrayVariants };
