'use client';

import { ArrowLeft } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

export interface PageHeaderProps
  extends Omit<ComponentProps<'header'>, 'title'> {
  /** The page title — an `h2`, the developers' level and the product's. */
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
   * Slot immediately after the title, inside the title cluster — a status chip,
   * the data source a form is connecting to, an environment tag.
   *
   * It is not `actions`: `actions` is pushed to the opposite edge of the row,
   * where a badge stops reading as part of the title and starts reading as one
   * more control next to Save.
   */
  badge?: ReactNode;
  /**
   * DRAFT. The same header, shorter: a `heading20` where the full one has a
   * `heading30` (`heading24` below `md`), and the back control a step smaller.
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
  /**
   * The title wraps onto as many lines as it needs instead of truncating.
   *
   * For a title that must be read whole: on a phone a two-word title beside a
   * button loses its second word to an ellipsis ("Data So…"), and when that
   * word is the one that tells two pages apart the ellipsis hides the page's
   * name. The arrow and the badge stay centred on the wrapped title and the
   * actions keep their edge, so the row only grows taller.
   */
  wrapTitle?: boolean;
}

/**
 * The title row every screen starts with: an optional back control, the page
 * title (an `h2`), and trailing actions.
 *
 * It has no inset of its own — the developers' shape, and the kit's, where
 * `.cl-page` pads `.cl-page-head`. The page owns the padding (`ListPageLayout`'s
 * sticky header, or the consumer's container), so the row lines up with the
 * content under it whatever wraps it.
 *
 * The title is the kit's `.cl-page-title`: `heading30` (500), stepping to
 * `heading24` below `md` — the same `text-2xl md:text-3xl` as Typography's `h2`
 * variant — and `heading20` once condensed. Insightis set it first; §110.
 *
 * Two details are what make it read as one unit rather than three parts:
 *
 * - **The back arrow is a 24px glyph**, not the 16px used inside dense
 *   controls. It sits beside a 24–30px title, and a 16px arrow reads as a stray
 *   icon rather than the page's own control.
 * - **The arrow's box sits 6px from the title** (its glyph, 12px), while
 *   everything else in the row is 12px apart. The arrow belongs to the title —
 *   it is not a sibling of it, and the tighter gap is what says so.
 * - **Its box starts on the row's edge**, which is the page's inset, so the
 *   hover pill lines up with the content below — the search field, the table,
 *   the cards. It is not pulled out to put the *glyph* on that line. See the
 *   note on the control.
 */
function PageHeader({
  title,
  onBack,
  backLabel = 'Back',
  actions,
  leading,
  badge,
  condensed,
  wrapTitle,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      data-condensed={condensed ? '' : undefined}
      className={cn('flex shrink-0 items-center gap-3', className)}
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
            the row; next to the full-size title that arrow read as a stray icon. The
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
            table, the cards all begin at the page's inset — so every time
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
        {/* Condensing animates whole (§111): the title's size, the arrow's box
            and its glyph move over `--motion-slow` (240ms), the standard curve
            — the consumer animates its padding over the same — so the header
            shrinks as one thing. A title stepping 30 → 20px in a frame while
            the padding glides read as a jump. Reduced motion keeps the step. */}
        {onBack ? (
          <IconButton
            aria-label={backLabel}
            className="me-0.5 shrink-0 duration-slow motion-reduce:transition-none"
            onClick={onBack}
            /* The arrow is sized against the TITLE, not against the row — so
               it steps down with it. `condensed` puts a `heading20` where the
               full header has a `heading30`, and a 24px arrow beside 20px type
               stops reading as the title's own control and starts reading as
               a control that outgrew it. */
            size={condensed ? 'sm' : 'md'}
            variant="tertiary"
          >
            <ArrowLeft
              className={cn(
                'transition-all duration-slow motion-reduce:transition-none',
                !condensed && '!size-6'
              )}
            />
          </IconButton>
        ) : null}
        {/* The kit's `.cl-page-title` (§110): 24px below `md`, 30px from it —
            `md:text-3xl` over `heading24` is Typography's own `h2` variant —
            and 20px condensed. Wrapping, it needs `min-w-0` to shrink beside
            the actions — `truncate`'s overflow gave it that for free — and
            `break-words` for a single word wider than the row. */}
        <Typography
          element="h2"
          textStyle={condensed ? 'heading20' : 'heading24'}
          textColor="primary"
          className={cn(
            wrapTitle ? 'min-w-0 break-words' : 'truncate',
            'transition-all duration-slow motion-reduce:transition-none',
            !condensed && 'md:text-3xl'
          )}
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
