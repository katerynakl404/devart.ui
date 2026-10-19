import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TooltipProvider } from '../../Tooltip';
import { CodeBlock, type CodeBlockProps, codeSyntaxVariants } from '../index';

const renderBlock = (props: Partial<CodeBlockProps> = {}) =>
  render(
    <TooltipProvider>
      <CodeBlock code={'SELECT 1;\nSELECT 2;'} {...props} />
    </TooltipProvider>
  );

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`);

describe('CodeBlock', () => {
  describe('copy', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      });
    });

    afterEach(() => {
      writeText.mockClear();
    });

    /** Highlighted children change what is shown, never what is copied. */
    it('copies `code`, not the rendered children', async () => {
      renderBlock({ children: <span>highlighted</span> });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
      });

      expect(writeText).toHaveBeenCalledWith('SELECT 1;\nSELECT 2;');
      expect(screen.getByRole('button', { name: 'Copied' })).toBeVisible();
    });

    it('renders no control when not copyable', () => {
      renderBlock({ copyable: false });

      expect(screen.queryByRole('button')).toBeNull();
    });
  });

  describe('header', () => {
    it('is absent unless given', () => {
      const { container } = renderBlock();

      expect(slot(container, 'code-block-header')).toBeNull();
    });

    /** One control, in one place: the header's end, not also the corner. */
    it('takes Copy into the bar beside what the caller passed', () => {
      const { container } = renderBlock({ header: 'Output' });

      const header = slot(container, 'code-block-header');
      expect(header).toHaveTextContent('Output');
      expect(screen.getAllByRole('button')).toHaveLength(1);
      expect(header).toContainElement(screen.getByRole('button'));
      expect(screen.getByRole('button')).not.toHaveClass('absolute');
    });

    it('keeps Copy in the corner without one', () => {
      renderBlock();

      expect(screen.getByRole('button')).toHaveClass('absolute');
    });
  });

  describe('lineNumbers', () => {
    it('draws no gutter by default', () => {
      const { container } = renderBlock();

      expect(slot(container, 'code-block-gutter')).toBeNull();
    });

    /** Out of the selection and out of the accessibility tree. */
    it('numbers every line of `code` in a gutter nobody selects or hears', () => {
      const { container } = renderBlock({ lineNumbers: true });

      const gutter = slot(container, 'code-block-gutter');
      expect(gutter?.textContent).toBe('1\n2');
      expect(gutter).toHaveAttribute('aria-hidden', 'true');
      expect(gutter).toHaveClass('select-none');
      expect(slot(container, 'code-block-body')).toHaveTextContent('SELECT 1;');
    });

    /** A <pre> does not draw a trailing newline, so neither does the gutter. */
    it('does not count a trailing newline, and reads CRLF as one break', () => {
      const { container } = renderBlock({
        code: 'a\r\nb\r\nc\n',
        lineNumbers: true,
      });

      expect(slot(container, 'code-block-gutter')?.textContent).toBe('1\n2\n3');
    });
  });

  describe('body', () => {
    it('caps its height with any CSS length', () => {
      const { container } = renderBlock({ maxHeight: '14rem' });

      const body = slot(container, 'code-block-body') as HTMLElement;
      expect(body.style.maxHeight).toBe('14rem');
      expect(body).toHaveClass('overflow-auto');
    });

    it('sets no height of its own without one', () => {
      const { container } = renderBlock();

      const body = slot(container, 'code-block-body') as HTMLElement;
      expect(body.style.maxHeight).toBe('');
    });

    it('keeps lines whole by default and wraps them on request', () => {
      const plain = renderBlock();
      expect(slot(plain.container, 'code-block-body')).toHaveClass(
        'whitespace-pre'
      );
      plain.unmount();

      const wrapped = renderBlock({ wrap: true });
      expect(slot(wrapped.container, 'code-block-body')).toHaveClass(
        'whitespace-pre-wrap'
      );
    });
  });

  describe('variant', () => {
    it('tints the code, not the header, on error', () => {
      const { container } = renderBlock({
        variant: 'error',
        header: 'Output',
      });

      const root = slot(container, 'code-block');
      expect(root?.className).toContain('bg-fb-red-text/8');
      expect(slot(container, 'code-block-header')).toHaveClass(
        'bg-surface-card'
      );
    });

    it('carries no tint by default', () => {
      const { container } = renderBlock();

      expect(slot(container, 'code-block')?.className).not.toContain('fb-red');
    });
  });
});

describe('codeSyntaxVariants', () => {
  it('maps each syntax role to its code token', () => {
    expect(codeSyntaxVariants({ variant: 'keyword' })).toBe(
      'text-code-keyword'
    );
    expect(codeSyntaxVariants({ variant: 'string' })).toBe('text-code-string');
    expect(codeSyntaxVariants({ variant: 'number' })).toBe('text-code-number');
  });

  /** Italic too, so a comment still reads as one without its colour. */
  it('sets comments in italic as well as in their colour', () => {
    expect(codeSyntaxVariants({ variant: 'comment' })).toBe(
      'text-code-comment italic'
    );
  });
});
