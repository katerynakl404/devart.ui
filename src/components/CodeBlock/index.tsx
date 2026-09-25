'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Copy } from 'lucide-react';
import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { cn } from '../../lib/utils';
import { IconButton } from '../IconButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

const codeBlockVariants = cva(
  cn(
    'relative',
    'rounded-md border border-stroke bg-surface-bg',
    'font-mono text-ink-body'
  ),
  {
    variants: {
      // Same two rungs as StatTile and the rest of the padded surfaces.
      size: {
        sm: 'p-3 text-xxs',
        md: 'p-4 text-xs',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export interface CodeBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof codeBlockVariants> {
  /** The text shown, and the text copied. One source, so they cannot drift. */
  code: string;
  /** Rendered instead of the raw text — highlighted markup, for instance. */
  children?: ReactNode;
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
 * obviously attached to anything.
 *
 * The confirmation is the button itself — the glyph becomes a tick for two
 * seconds. A toast for "copied" is a page-level interruption for something the
 * user is watching happen.
 */
function CodeBlock({
  code,
  children,
  copyable = true,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  size,
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

  return (
    <div className={cn(codeBlockVariants({ size }), className)} {...props}>
      {copyable ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              aria-label={copied ? copiedLabel : copyLabel}
              size="2xs"
              variant="tertiary"
              // Inside the block's own padding, clear of the first line.
              className="absolute end-2 top-2"
              onClick={copy}
            >
              {copied ? <Check /> : <Copy />}
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>{copied ? copiedLabel : copyLabel}</TooltipContent>
        </Tooltip>
      ) : null}
      <pre
        className={cn(
          // The kit draws a hairline scrollbar and this pre never asked for
          // it, so a long command got the browser default: a 16px trough with
          // stepper arrows on Windows, under a 4px-radius code block. The
          // preset that ships `scrollbar-thin` names `.cp-code-pre` as one of
          // the three kit rules it was copied FROM, so the code block is where
          // the utility came from in the first place.
          'scrollbar-thin overflow-x-auto whitespace-pre',
          // Room for the button on the first line only — the rest of the block
          // uses the full width, so a long line is not indented for nothing.
          copyable && '[&>code]:pe-8'
        )}
      >
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock, codeBlockVariants };
