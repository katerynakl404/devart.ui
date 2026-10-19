'use client';

import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

/* HighlightText — the part of a name a search matched, marked where the name
   is shown.

   Where: a tree, or text long enough to hide the match. A tree searched shows
   each match with the path above it, and only the mark tells the matching row
   from the rows shown to place it. NOT a flat list of short names filtered by
   name: the filter already says why a row stayed, most products leave those
   rows unmarked, and a mark on every row is noise.

   A highlighter: the brand tint behind the match — `--badge-brand-bg`, the
   `brand` badge's fill (brand mixed into the card; 1.34:1 against the card in
   light, 1.31:1 in dark) — under the name's own ink, `text-ink-primary`
   (13:1 and 11:1 on it), rounded to the small radius, with a step of weight
   (`font-medium`) so it does not rest on colour alone. Tried first and not
   seen: ink alone (`--ink-highlight`, no fill) on a 500-weight list name, and
   the Primary badge's Brand-50 fill (1.14:1 against white). The badge's own
   `--badge-brand-text` is not used: 4.30:1 on this fill in dark.

   Every occurrence, case-insensitive, as plain substring search — the same
   test a list uses to keep the row, so what is marked is exactly why the row
   is there. No regular expressions: a query is text, and "a.b" means a, a
   dot, b.

   A `<mark>`, because that is what it is, its UA yellow and black replaced.
   An empty query renders the text as it is, so a caller passes the query
   through without a condition of its own. */

export interface HighlightTextProps {
  /** The whole string — a row's name. */
  text: string;
  /** What was searched for. Empty, or only spaces: the text as it is. */
  query?: string;
  /** Added to each marked part. */
  className?: string;
}

export const HighlightText = ({
  text,
  query = '',
  className,
}: HighlightTextProps) => {
  const q = query.trim().toLowerCase();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(q);
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark
        key={at}
        data-slot="highlight-text-match"
        className={cn(
          'rounded-sm bg-badge-brand-bg font-medium text-ink-primary',
          className
        )}
      >
        {text.slice(at, at + q.length)}
      </mark>
    );
    from = at + q.length;
    at = lower.indexOf(q, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return <>{parts}</>;
};
