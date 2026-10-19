import * as Dialog from '@radix-ui/react-dialog';
import { render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { DialogTitleFallback } from '../index';

/**
 * Radix requires a title inside every dialog and warns when one is missing, so
 * the fallback supplies an invisible one. It has to stand down the moment a
 * real title exists, which is the whole reason it re-measures on every render.
 */
const inDialog = (children: ReactNode) =>
  render(
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Content aria-describedby={undefined}>{children}</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

describe('DialogTitleFallback', () => {
  it('renders a label for screen readers only', async () => {
    inDialog(<DialogTitleFallback>Delete file</DialogTitleFallback>);

    const title = await waitFor(() => {
      const found = document.querySelector('h2');
      expect(found).not.toBeNull();
      return found as HTMLElement;
    });

    expect(title).toHaveTextContent('Delete file');
    expect(title).toHaveClass('sr-only');
    expect(title).not.toHaveAttribute('hidden');
  });

  it('hides itself entirely when there is no label to give', async () => {
    inDialog(<DialogTitleFallback />);

    const title = await waitFor(() => {
      const found = document.querySelector('h2');
      expect(found).not.toBeNull();
      return found as HTMLElement;
    });

    expect(title).toHaveAttribute('hidden');
    expect(title).not.toHaveClass('sr-only');
  });

  it('treats an empty string as no label', async () => {
    inDialog(<DialogTitleFallback>{''}</DialogTitleFallback>);

    const title = await waitFor(() => document.querySelector('h2'));
    expect(title).toHaveAttribute('hidden');
  });

  /**
   * Radix hands both titles the same id from context, so once a real one is
   * mounted the fallback must remove itself — otherwise the dialog carries two
   * elements with one id and `aria-labelledby` resolves to whichever the
   * browser saw first.
   */
  it('stands down once a real title is present', async () => {
    inDialog(
      <>
        <Dialog.Title>Real title</Dialog.Title>
        <DialogTitleFallback>Fallback</DialogTitleFallback>
      </>
    );

    await waitFor(() =>
      expect(document.querySelectorAll('h2')).toHaveLength(1)
    );
    expect(document.body.textContent).toContain('Real title');
    expect(document.body.textContent).not.toContain('Fallback');
  });

  it('keeps rendering while it is the only title', async () => {
    inDialog(<DialogTitleFallback>Fallback</DialogTitleFallback>);

    await waitFor(() =>
      expect(document.querySelectorAll('h2')).toHaveLength(1)
    );
    expect(document.body.textContent).toContain('Fallback');
  });
});
