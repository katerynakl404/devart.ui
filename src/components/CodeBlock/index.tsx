'use client';

import { Check, Copy } from 'lucide-react';
import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

const codeBlockVariants = cva(
  cn(
    // The header and the error tint are fills of their own; clipping is what
    // keeps them inside the rounded corners.
    'relative overflow-hidden',
    'rounded-md border border-stroke bg-surface-page',
    'font-mono text-ink-body'
  ),
  {
    variants: {
      // Same two rungs as StatTile and the rest of the padded surfaces. The
      // padding itself is on the code, not here — see SIZE_BODY.
      size: {
        sm: 'text-xxs',
        md: 'text-xs',
      },
      /* Error tints the CODE, not the block. The wash is laid over the block's
         own Surface/Page, so it reads the same on a card as on the page, and
         the header keeps its surface: it is where the caller says what failed,
         and the output under it is the thing that failed. An alpha on
         Feedback/Red-text rather than a token of its own — the first branch of
         SPEC's "Adding a Token". The border stays neutral, so the header's
         divider and the block's edge remain one line. */
      variant: {
        default: '',
        error: '[&>[data-slot=code-block-body]]:bg-fb-red-text/8',
      },
    },
    defaultVariants: { size: 'md', variant: 'default' },
  }
);

/* The size's rungs on the parts. Plain maps beside the recipe,
   because cva styles the root and these land on children. */
const SIZE_BODY = {
  sm: 'gap-3 p-3',
  md: 'gap-4 p-4',
} as const;

/* 40px at md puts a 24px Copy 8px from the top and, with `pe-2`, 8px from the
   end — the spot it takes in a block with no header, so it does not move when
   one is added. */
const SIZE_HEADER = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-10 px-4 text-sm',
} as const;

/**
 * The syntax colours, as the classes a highlighter puts on its spans.
 *
 * The package ships the palette and never a parser: which word is a keyword
 * is the caller's knowledge of the language, the colour it takes is the
 * system's. Tokenise `code` however suits, wrap each token in
 * `<span className={codeSyntaxVariants({ variant: 'keyword' })}>`, and pass
 * the result as `children`. Text between tokens stays Ink/Body from the block.
 */
const codeSyntaxVariants = cva('', {
  variants: {
    variant: {
      keyword: 'text-code-keyword',
      string: 'text-code-string',
      number: 'text-code-number',
      // Italic as well as quieter, so a comment still reads as one without its
      // colour (WCAG 1.4.1).
      comment: 'text-code-comment italic',
    },
  },
});

export interface CodeBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof codeBlockVariants> {
  /** The text shown, and the text copied. One source, so they cannot drift. */
  code: string;
  /** Rendered instead of the raw text — highlighted markup, for instance. It
   *  must render the same lines as `code`: the gutter counts those. */
  children?: ReactNode;
  /** A bar above the code — a label, a language glyph, a status Badge. Copy
   *  moves into it, at its end. */
  header?: ReactNode;
  /** A gutter of line numbers, out of the selection and the accessibility
   *  tree. For source, which does not wrap: with `wrap`, a long line takes two
   *  rows and the numbers fall out of step. */
  lineNumbers?: boolean;
  /** Any CSS length, or a number of pixels. The code scrolls inside it; the
   *  header stays put. */
  maxHeight?: string | number;
  /** Wraps long lines instead of scrolling sideways — for output read as
   *  prose (a log, a traceback), not for source. */
  wrap?: boolean;
  /** @default true */
  copyable?: boolean;
  /** @default 'Copy' */
  copyLabel?: string;
  /** @default 'Copied' */
  copiedLabel?: string;
}

/**
 * A block of code with the one control it always needs.
 *
 * Copy lives in the block rather than beside it: a snippet the user is meant
 * to paste somewhere else and a button that does the pasting are one object,
 * and separating them is how a page ends up with a copy button that is not
 * obviously attached to anything. With a `header`, it is the header's last
 * item; without one, it sits in the block's top corner.
 *
 * The confirmation is the button itself — the glyph becomes a tick for two
 * seconds. A toast for "copied" is a page-level interruption for something the
 * user is watching happen.
 */
function CodeBlock({
  code,
  children,
  header,
  lineNumbers = false,
  maxHeight,
  wrap = false,
  copyable = true,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  size,
  variant,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      // `navigator.clipboard` needs a secure context, which a page opened from
      // the filesystem is not. The deprecated command still works there, so the
      // control keeps its promise instead of silently doing nothing.
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.append(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const copyButton = copyable ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          aria-label={copied ? copiedLabel : copyLabel}
          size="2xs"
          variant="tertiary"
          // In the header, pushed to its end; otherwise inside the block's own
          // padding, clear of the first line.
          className={header ? 'ms-auto shrink-0' : 'absolute end-2 top-2'}
          onClick={copy}
        >
          {copied ? <Check /> : <Copy />}
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>{copied ? copiedLabel : copyLabel}</TooltipContent>
    </Tooltip>
  ) : null;

  /* One number per line of `code` — the text that is copied, so the gutter
     cannot count lines the reader is not shown. A trailing newline ends the
     last line rather than opening another: a <pre> does not draw it, so
     neither does the gutter. */
  const gutter = lineNumbers
    ? Array.from(
        { length: code.replace(/\r?\n$/, '').split(/\r?\n/).length },
        (_, i) => i + 1
      ).join('\n')
    : null;

  return (
    <div
      data-slot="code-block"
      className={cn(codeBlockVariants({ size, variant }), className)}
      {...props}
    >
      {header ? (
        <div
          data-slot="code-block-header"
          className={cn(
            'flex items-center gap-1.5',
            'border-stroke border-b bg-surface-card',
            'font-medium font-sans text-ink-primary',
            '[&>svg]:size-3.5 [&>svg]:shrink-0',
            SIZE_HEADER[size ?? 'md'],
            copyable && 'pe-2'
          )}
        >
          {header}
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      <pre
        data-slot="code-block-body"
        style={maxHeight === undefined ? undefined : { maxHeight }}
        className={cn(
          // The kit draws a hairline scrollbar and this pre never asked for
          // it, so a long command got the browser default: a 16px trough with
          // stepper arrows on Windows, under a 4px-radius code block. The
          // preset that ships `scrollbar-thin` names `.cp-code-pre` as one of
          // the three kit rules it was copied FROM, so the code block is where
          // the utility came from in the first place.
          'scrollbar-thin overflow-auto',
          SIZE_BODY[size ?? 'md'],
          wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
          lineNumbers && 'flex',
          // Room for the corner button. Unwrapped, on the first line only —
          // the rest of the block uses the full width, so a long line is not
          // indented for nothing. Wrapped, every line could reach the corner,
          // so the whole column stops short of it.
          copyable && !header && (wrap ? 'pe-10' : '[&>code]:pe-8')
        )}
      >
        {gutter ? (
          <span
            aria-hidden="true"
            data-slot="code-block-gutter"
            className="shrink-0 select-none text-end text-ink-inactive"
          >
            {gutter}
          </span>
        ) : null}
        {/* Beside the gutter the code is a flex item, and a flex item will not
            shrink below its longest word unless told to — so it would run out
            of the block instead of wrapping. */}
        <code className={cn(gutter && wrap && 'min-w-0')}>
          {children ?? code}
        </code>
      </pre>
    </div>
  );
}

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock, codeBlockVariants, codeSyntaxVariants };
