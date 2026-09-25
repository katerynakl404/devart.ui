'use client';

import { ArrowLeft } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

export interface PageHeaderProps
  extends Omit<ComponentProps<'header'>, 'title'> {
  /** The page's one `h1`. */
  title: ReactNode;
  /** Renders the back control. Omit it on a top-level page. */
  onBack?: () => void;
  /** Accessible name for the back control. */
  backLabel?: string;
  /** Trailing actions, pushed to the end of the row. */
  actions?: ReactNode;
  /** Slot between the back control and the title — a breadcrumb, a logo. */
  leading?: ReactNode;
  /**
   * Slot immediately after the `h1`, inside the title cluster — a status chip,
   * the data source a form is connecting to, an environment tag.
   *
   * It is not `actions`: `actions` is pushed to the opposite edge of the row,
   * where a badge stops reading as part of the title and starts reading as one
   * more control next to Save.
   */
  badge?: ReactNode;
  /**
   * DRAFT. The same header, shorter: half the vertical padding and a `title16`
   * where the full one has a `title24` — 40px tall instead of 72px.
   *
   * It exists for a header that STAYS on screen while the page scrolls under
   * it. At full height a sticky header spends a fifth of a short window on a
   * line already read; condensed it keeps what a scrolled page still needs from
   * it — which page this is, the way out, and the commit — and gives the rest
   * back to the content.
   *
   * It is a state of the same row, not a second component: the back control,
   * the title and the actions keep their columns, so nothing moves sideways as
   * it changes. The consumer decides when — a page that does not scroll has no
   * use for it.
   */
  condensed?: boolean;
}

/**
 * The title row every screen starts with: an optional back control, the page's
 * `h1`, and trailing actions.
 *
 * Two details are what make it read as one unit rather than three parts:
 *
 * - **The back arrow is a 24px glyph**, not the 16px used inside dense
 *   controls. It sits beside a `title24`, and a 16px arrow reads as a stray
 *   icon rather than the page's own control.
 * - **The arrow's box sits 6px from the title** (its glyph, 12px), while
 *   everything else in the row is 12px apart. The arrow belongs to the title —
 *   it is not a sibling of it, and the tighter gap is what says so.
 * - **Its box starts on the header's own inset**, so the hover pill lines up
 *   with the content below — the search field, the table, the cards. It is not
 *   pulled out to put the *glyph* on that line. See the note on the control.
 */
function PageHeader({
  title,
  onBack,
  backLabel = 'Back',
  actions,
  leading,
  badge,
  condensed,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      data-condensed={condensed ? '' : undefined}
      className={cn(
        'flex shrink-0 items-center gap-3 px-6 py-5',
        // The padding is what shrinks, and it is animated: the row is on screen
        // while it changes, so a jump reads as the page flinching. The type is
        // not animated — a font-size transition is a reflow every frame, and the
        // one step it would smooth is 8px.
        'transition-[padding] duration-fast',
        condensed && 'py-2.5',
        className
      )}
      {...props}
    >
      {leading}

      {/* gap-1: the arrow belongs to the title, so it sits closer to it than
          anything else in the row is to anything else. */}
      <div className="flex min-w-0 items-center gap-1">
        {/* `shrink-0`, or the box collapses: it is a flex item beside a
            truncating title, so under pressure it gave up its own padding and
            rendered 26px wide around a 24px glyph — no inset left, and a
            hover pill the same size as the icon.

            `md` rather than `sm`: a 24px glyph needs a 36px box to read as a
            pill rather than as a frame.

            The arrow is sized against the TITLE, not against the row. It was
            briefly `sm` with the component's own 16px glyph, on the reasoning
            that a tertiary button should measure like every other control in
            the row; next to a `title24` that arrow read as a stray icon. The
            cost of `md` is known and accepted: the control is 36px in a row
            whose other members are 32, so a header with a back arrow is 4px
            taller than one without.

            NO negative inset. There was one — `-ms-1.5 -me-1.5` — on the
            principle that a tertiary control is measured by its glyph, not by
            the box its hover state happens to paint, so pulling the 36px box
            6px out put the 24px GLYPH on the page's content rail.

            That principle holds for a control with no surface. This one has a
            surface. The pill appears on hover and on focus, and when it does it
            started 6px LEFT of everything under it — the search field, the
            table, the cards all begin at the header's own inset — so every time
            the pointer crossed the arrow, the page's left edge visibly broke.
            A glyph sitting inset inside its own control is how every other icon
            control on the page already reads; a painted surface overhanging the
            rail is not. So the box starts on the inset and the glyph sits 6px
            inside it.

            There is no `-me-1.5` either, and that one was simply a defect:
            −6px against the cluster's 4px gap put the box's right edge 2px
            INSIDE the title, so on hover the pill ran under the first letter.
            A small positive end margin instead — the pill keeps 6px of
            clearance and the glyph sits 12px from the title, still tighter than
            the 12px the rest of the row is spaced at, which is what says the
            arrow belongs to the title rather than being its neighbour. */}
        {onBack ? (
          <IconButton
            aria-label={backLabel}
            className="me-0.5 shrink-0"
            onClick={onBack}
            /* The arrow is sized against the TITLE, not against the row — so
               it steps down with it. `condensed` puts a `title16` where the
               full header has a `title24`, and a 24px arrow beside 16px type
               stops reading as the title's own control and starts reading as
               a control that outgrew it. */
            size={condensed ? 'sm' : 'md'}
            variant="tertiary"
          >
            <ArrowLeft className={condensed ? undefined : '!size-6'} />
          </IconButton>
        ) : null}
        <Typography
          element="h1"
          textStyle={condensed ? 'title16' : 'title24'}
          textColor="primary"
          className="truncate"
        >
          {title}
        </Typography>
        {/* `ms-2` on top of the cluster's `gap-1` puts the badge 12px from the
            title — the same gap the rest of the row uses. The 4px inside the
            cluster belongs to the arrow, which is part of the title; a badge is
            a separate object sitting next to it and reads as glued on at 4px. */}
        {badge ? (
          <span className="ms-2 flex shrink-0 items-center">{badge}</span>
        ) : null}
      </div>

      {actions ? (
        <div className="ms-auto flex items-center gap-3">{actions}</div>
      ) : null}
    </header>
  );
}

export { PageHeader };
