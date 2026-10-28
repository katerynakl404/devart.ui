'use client';

import { Minus, Plus } from 'lucide-react';
import {
  createContext,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useContext,
} from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { HighlightText } from '../HighlightText';
import { IconButton } from '../IconButton';
import { Skeleton } from '../Skeleton';
import { Spinner } from '../Spinner';
import { Typography } from '../Typography';

/* Tree — a hierarchy read row by row: a data source's catalogs, schemas,
   tables and columns; folders and files.

   Every row has the same height, the same control column on the left and the
   same right edge at every level, so the eye reads the hierarchy down the
   left and the states down the right. Depth changes one thing: the indent.

   One level in is one toggle and its gap — 20 + 8 = 28px — so a level's +/−
   starts under the icon of the level above it, and the tree reads as one
   staircase rather than toggles stepping in by less than they are wide.

   Every level carries its icon (`icon`), and every row keeps the toggle's
   slot — empty on a row that cannot open, a column — so each level's icon
   stands one full step (28px) in from its parent's. A leaf without the slot
   put its icon under its parent's and read as a sibling.

   The tree knows nothing of what it holds. Which rows exist, which are open,
   what loads and what a search keeps is the caller's: the parts here are the
   container (`Tree`), the row (`TreeItem`) and the line a branch shows while
   its children load (`TreeLoadingRow`). */

/** The row toggle (`IconButton` `3xs`, §101) and the gap after it. */
export const TREE_INDENT = 28;

const TreeContext = createContext<{ inset: number }>({ inset: 16 });

export interface TreeProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The edge of what holds the tree, in px, at both ends of every row — 24
   * in a card, under its title; 16 in a pane beside a list. The first
   * toggle sits on it.
   * @default 16
   */
  inset?: number;
}

export const Tree = ({
  inset = 16,
  className,
  children,
  ...props
}: TreeProps) => (
  <TreeContext.Provider value={{ inset }}>
    <div data-slot="tree" className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  </TreeContext.Provider>
);

const treeItemVariants = cva(
  cn(
    'flex min-h-10 flex-wrap items-center gap-x-2 gap-y-1',
    // A rule under every row; the last one ends on the border of what holds
    // the tree — two lines there read as one thick one.
    'border-stroke border-b py-1 last:border-b-0'
  ),
  {
    variants: {
      variant: {
        /**
         * A node. The pointer works on these. A row's wash, not a control's
         * (§6a, as Table's rows): `state-hover` over the card is exactly
         * `surface-card2` on dark, so a hovered node took the head's tone and
         * ran into it (2026-10-27). The row wash sits between the two.
         */
        default: 'hover:bg-tbl-row-hover',
        /**
         * The head of a branch the caller groups by — a connection over its
         * catalogs: the card's second surface, no hover, the name a step up.
         * `surface-card2`, not the page's grey: on dark the page is darker
         * than the card, and a head on it read as a hole in the card rather
         * than as the row over its branch (2026-10-27). card2 is a step
         * lighter than the card on dark and a tinted band on light.
         */
        head: 'bg-surface-card2',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface TreeItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof treeItemVariants> {
  /** What the row names. Also names its toggle: "Expand {name}". */
  name: string;
  /** Depth, from 0. */
  level?: number;
  /**
   * What kind of node it is, before the name in the secondary ink —
   * `Catalog · sakila`. For a hierarchy whose levels are not obvious from
   * the names; leave it out where the icon says enough.
   */
  label?: ReactNode;
  /** The level's mark, 14px, in the secondary ink. Every level has one; a  row's (a logo) keeps its own size. */
  icon?: ReactNode;
  /** Has children (or may, once read): the row shows a +/− and opens on a press anywhere on it. */
  expandable?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The tree's search; the part of the name it matched is marked (`HighlightText`). */
  query?: string;
  /** Gone from the source — the name struck through, in the secondary ink. */
  struck?: boolean;
  /** Being read again — the name under a `Skeleton`, its own size, so nothing on the row moves. */
  loading?: boolean;
  /** Right after the name — a warning mark, a count. */
  after?: ReactNode;
  /**
   * At the right edge — the row's controls. A press on them never folds the
   * row.
   */
  actions?: ReactNode;
  /** @default 'Expand' */
  expandLabel?: string;
  /** @default 'Collapse' */
  collapseLabel?: string;
}

export const TreeItem = ({
  name,
  level = 0,
  label,
  icon,
  expandable = false,
  open = false,
  onOpenChange,
  query = '',
  struck = false,
  loading = false,
  after,
  actions,
  expandLabel = 'Expand',
  collapseLabel = 'Collapse',
  variant,
  className,
  style,
  onClick,
  ...props
}: TreeItemProps) => {
  const { inset } = useContext(TreeContext);
  const toggle = () => onOpenChange?.(!open);
  const head = variant === 'head';
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: a pointer convenience over the whole band; the keyboard opens the row with its toggle
    <div
      data-slot="tree-item"
      data-level={level}
      data-state={expandable ? (open ? 'open' : 'closed') : undefined}
      /* The whole row opens it: the +/− is a 20px target on a 40px band,
         and a tree is read by opening things. */
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented && expandable) toggle();
      }}
      className={cn(
        treeItemVariants({ variant }),
        expandable && 'cursor-pointer',
        className
      )}
      style={{
        paddingInlineStart: inset + level * TREE_INDENT,
        paddingInlineEnd: inset,
        ...style,
      }}
      {...props}
    >
      {
        <span
          data-slot="tree-item-toggle"
          className="flex size-5 shrink-0 items-center justify-center"
        >
          {expandable ? (
            <IconButton
              aria-label={`${open ? collapseLabel : expandLabel} ${name}`}
              aria-expanded={open}
              size="3xs"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
            >
              {open ? <Minus /> : <Plus />}
            </IconButton>
          ) : null}
        </span>
      }

      {icon ? (
        <span
          data-slot="tree-item-icon"
          className={cn(
            'flex shrink-0 text-ink-secondary',
            // A head carries its own mark (a source's logo) at its own size.
            !head && '[&_svg]:size-3.5'
          )}
        >
          {icon}
        </span>
      ) : null}

      <Typography
        element="span"
        textStyle={head ? 'title14' : 'body14'}
        textColor={struck ? 'secondary' : 'primary'}
        lineThrough={struck}
        className="min-w-0 truncate"
      >
        {label ? <span className="text-ink-secondary">{label} · </span> : null}
        {loading ? (
          <Skeleton
            isLoaded={false}
            rounded="sm"
            animation="shimmer"
            className="align-middle"
          >
            {name}
          </Skeleton>
        ) : (
          <HighlightText text={name} query={query} />
        )}
      </Typography>

      {after}

      {actions ? (
        // biome-ignore lint/a11y/useKeyWithClickEvents: only stops the row's own click; the controls inside carry the keyboard
        <span
          data-slot="tree-item-actions"
          onClick={(e) => e.stopPropagation()}
          className="ms-auto flex shrink-0 items-center gap-2"
        >
          {actions}
        </span>
      ) : null}
    </div>
  );
};

export interface TreeLoadingRowProps extends HTMLAttributes<HTMLDivElement> {
  /** The level of the rows coming — one deeper than the branch reading them. */
  level?: number;
  /** "Loading tables…" */
  text: string;
}

/** What an opened branch shows while its children are read: the spinner in
 *  the coming rows' icon slot, the words where their names will start. */
export const TreeLoadingRow = ({
  level = 0,
  text,
  className,
  style,
  ...props
}: TreeLoadingRowProps) => {
  const { inset } = useContext(TreeContext);
  return (
    // biome-ignore lint/a11y/useSemanticElements: <output> is a phrasing-only form result, not a row of a tree
    <div
      data-slot="tree-loading-row"
      role="status"
      className={cn(
        'flex min-h-10 items-center gap-2 border-stroke border-b py-1',
        className
      )}
      style={{
        paddingInlineStart: inset + level * TREE_INDENT + TREE_INDENT,
        paddingInlineEnd: inset,
        ...style,
      }}
      {...props}
    >
      <span className="flex w-3.5 shrink-0 justify-center">
        <Spinner size="xs" />
      </span>
      <Typography element="span" textStyle="body12" textColor="secondary">
        {text}
      </Typography>
    </div>
  );
};

export { treeItemVariants };
