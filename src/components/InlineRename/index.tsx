'use client';

import {
  type ComponentProps,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../Input';

export interface InlineRenameProps
  extends Omit<
    ComponentProps<'input'>,
    'defaultValue' | 'onChange' | 'type' | 'value'
  > {
  /** The title being renamed. The field opens holding it, all of it selected. */
  defaultValue: string;
  /**
   * Required. The field takes the place of the visible title, so nothing else
   * labels it ("Chat name", "Report name").
   */
  'aria-label': string;
  /**
   * Enter or blur, with the new title trimmed. Called only when it is neither
   * empty nor unchanged — either of those is a cancel.
   */
  onCommit: (value: string) => void;
  /** Esc, or a commit that would change nothing. */
  onCancel: () => void;
}

/**
 * A title that turns into a field where it stands — rename in a list row, a
 * card, a breadcrumb — and back again.
 *
 * The parent owns whether it is showing: render it in place of the title, and
 * put the title back on `onCommit` or `onCancel`. Exactly one of the two fires,
 * once. Enter commits and so does the blur that follows; the second is
 * swallowed rather than committing twice.
 *
 * Empty or unchanged is a cancel, not a commit: there is no such thing as a
 * nameless row, and saving a name that did not change is a request for nothing.
 */
function InlineRename({
  defaultValue,
  onCommit,
  onCancel,
  className,
  onBlur,
  onClick,
  onKeyDown,
  ref: refProp,
  ...props
}: InlineRenameProps) {
  const [draft, setDraft] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const settled = useRef(false);

  const mergedRef = useCallback(
    (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof refProp === 'function') {
        refProp(el);
      } else if (refProp) {
        (refProp as RefObject<HTMLInputElement | null>).current = el;
      }
    },
    [refProp]
  );

  // Selected on open, so typing replaces the old name and one arrow key keeps
  // it — the two things a rename is for.
  //
  // A tick late on purpose. Rename is usually a menu item, and Radix runs an
  // item's `onSelect` synchronously while the menu's focus trap still holds:
  // focused on mount, the field would be pulled straight back into the menu,
  // then blur — and commit — as the menu closed.
  useEffect(() => {
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const settle = (commit: boolean) => {
    if (settled.current) return;
    settled.current = true;

    const next = draft.trim();
    if (commit && next && next !== defaultValue) {
      onCommit(next);
    } else {
      onCancel();
    }
  };

  return (
    <Input
      {...props}
      ref={mergedRef}
      type="text"
      data-slot="inline-rename"
      value={draft}
      className={cn(
        // The line it replaces is a 14px title on a 20px line. The box is
        // 24px — the row-action step, level with the IconButtons beside it —
        // and gives the 4px back as a negative block margin, so swapping the
        // title for the field does not move the row.
        '-my-0.5 h-6 px-1.5',
        'rounded border border-stroke bg-surface-card',
        'font-normal text-ink-primary text-sm',
        // Focus is the field border, as on every field — never a ring.
        'focus-visible:border-input-focus',
        // A clickable row is `cursor-pointer select-none`, and both inherit.
        // Inside a field they would hide the caret and stop a drag-select.
        'cursor-text select-text',
        className
      )}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={(event) => {
        onBlur?.(event);
        settle(true);
      }}
      onClick={(event) => {
        // A click that places the caret is not a click on the row.
        event.stopPropagation();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        // Every key typed here belongs to the field — a Space must not toggle
        // the row, an arrow must not move a list's focus.
        event.stopPropagation();
        onKeyDown?.(event);
        if (event.defaultPrevented) return;

        // Not mid-composition: Enter there picks an IME candidate.
        if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
          event.preventDefault();
          settle(true);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          settle(false);
        }
      }}
    />
  );
}

InlineRename.displayName = 'InlineRename';

export { InlineRename };
