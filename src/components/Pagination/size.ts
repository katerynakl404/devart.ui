/**
 * The pager's rung. **Draft.**
 *
 * `sm` — 32px, the default, and what a pager is when it is the page's own
 * control: one object under one list, with room to be pressed without aim.
 *
 * `xs` — 24px, for a pager that is part of a TABLE's footer rather than the
 * page's. There it shares a band with the range it annotates ("Showing
 * 1–20 of 300") at `body12`, and a 32px control beside 12px text is the
 * loudest thing in a footer whose whole job is to be quiet. Below 24 the
 * hit target stops being one.
 */
export type PaginationSize = 'sm' | 'xs';

/** The square the page numbers and the nav buttons are drawn in. */
export const PAGINATION_BOX: Record<PaginationSize, string> = {
  sm: 'size-8',
  xs: 'size-6',
};
