import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityTray, ActivityTrayItem } from '../index';

// jsdom has no ResizeObserver; the kit's ScrollShadow (used inside the
// plate's content) constructs one unguarded.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver =
  ResizeObserverStub as unknown as typeof ResizeObserver;

// Radix Presence (behind Collapsible/CollapsibleContent) calls CSS.escape
// from its animationend handling; jsdom has no CSS global.
if (typeof CSS === 'undefined') {
  globalThis.CSS = {
    escape: (value: string) => value,
  } as unknown as typeof CSS;
}

describe('ActivityTray', () => {
  it('renders the title, icon, and rows inside a list', () => {
    const { container } = render(
      <ActivityTray
        headerTitle="Uploads"
        headerIcon={<span aria-hidden>ICON</span>}
      >
        <ActivityTrayItem title="Row one" />
        <ActivityTrayItem title="Row two" />
      </ActivityTray>
    );

    const iconSlot = container.querySelector(
      '[data-slot="activity-tray-icon"]'
    );
    expect(iconSlot?.textContent).toBe('ICON');

    expect(screen.getByRole('button', { name: 'Uploads' })).toBeTruthy();
    expect(screen.getByRole('list')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Row one')).toBeTruthy();
    expect(screen.getByText('Row two')).toBeTruthy();
  });

  it('expands by default: aria-expanded is true and the list is present', () => {
    render(
      <ActivityTray headerTitle="Uploads">
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    const trigger = screen.getByRole('button', { name: 'Uploads' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('list')).toBeTruthy();
  });

  it('toggles aria-expanded, hides the list, and reports onOpenChange(false) on click', () => {
    const onOpenChange = vi.fn();
    render(
      <ActivityTray headerTitle="Uploads" onOpenChange={onOpenChange}>
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    const trigger = screen.getByRole('button', { name: 'Uploads' });
    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    // The list stays mounted (forceMount) but leaves the a11y tree.
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByRole('list', { hidden: true })).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('starts closed when defaultOpen is false', () => {
    render(
      <ActivityTray headerTitle="Uploads" defaultOpen={false}>
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    const trigger = screen.getByRole('button', { name: 'Uploads' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByRole('list', { hidden: true })).toBeTruthy();
  });

  /** Controlled: the DOM follows `open`, never the trigger's own click. */
  it('stays closed under open={false} after a click, while onOpenChange(true) still fires', () => {
    const onOpenChange = vi.fn();
    render(
      <ActivityTray
        headerTitle="Uploads"
        open={false}
        onOpenChange={onOpenChange}
      >
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    const trigger = screen.getByRole('button', { name: 'Uploads' });
    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByRole('list', { hidden: true })).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("uses toggleLabel as the trigger's accessible name when given", () => {
    render(
      <ActivityTray headerTitle="Uploads" toggleLabel="Toggle uploads panel">
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    expect(
      screen.getByRole('button', { name: 'Toggle uploads panel' })
    ).toBeTruthy();
  });

  it('renders a heading with no trigger button when isCollapsible is false, and always shows the list', () => {
    render(
      <ActivityTray headerTitle="Uploads" isCollapsible={false}>
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    expect(screen.queryByRole('button', { name: 'Uploads' })).toBeNull();
    expect(screen.getByText('Uploads')).toBeTruthy();
    expect(screen.getByRole('list')).toBeTruthy();
  });

  it('renders no dismiss control when onDismiss is not provided', () => {
    render(
      <ActivityTray headerTitle="Uploads">
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });

  it('renders a "Dismiss"-labelled control that calls onDismiss without touching aria-expanded', () => {
    const onDismiss = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ActivityTray
        headerTitle="Uploads"
        onDismiss={onDismiss}
        onOpenChange={onOpenChange}
      >
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    const trigger = screen.getByRole('button', { name: 'Uploads' });
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    // The ✕ wires `onClick={onDismiss}` directly, so `onDismiss` receives
    // the click event as its argument — assert call count, not arguments.
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('honors a custom dismissLabel', () => {
    render(
      <ActivityTray
        headerTitle="Uploads"
        dismissLabel="Close panel"
        onDismiss={vi.fn()}
      >
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    expect(screen.getByRole('button', { name: 'Close panel' })).toBeTruthy();
  });

  it('passes role and aria-label through to the root', () => {
    render(
      <ActivityTray
        headerTitle="Uploads"
        role="region"
        aria-label="Upload status"
      >
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    expect(screen.getByRole('region', { name: 'Upload status' })).toBeTruthy();
  });
});

describe('ActivityTrayItem', () => {
  const renderRow = (row: ReactNode) =>
    render(<ActivityTray headerTitle="Uploads">{row}</ActivityTray>);

  it('renders the title as a button and calls onActivate on click', () => {
    const onActivate = vi.fn();
    renderRow(<ActivityTrayItem title="file.pdf" onActivate={onActivate} />);

    fireEvent.click(screen.getByRole('button', { name: 'file.pdf' }));

    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('renders the title as plain text with no button when onActivate is absent', () => {
    renderRow(<ActivityTrayItem title="file.pdf" />);

    const row = screen.getByRole('listitem');
    expect(within(row).queryAllByRole('button')).toHaveLength(0);
    expect(screen.getByText('file.pdf')).toBeTruthy();
  });

  it('renders a progressbar with aria-valuenow and the given label when hasProgress is set', () => {
    renderRow(
      <ActivityTrayItem
        title="file.pdf"
        hasProgress
        progress={62}
        progressLabel="Uploading file.pdf"
      />
    );

    const progressbar = screen.getByRole('progressbar', {
      name: 'Uploading file.pdf',
    });
    expect(progressbar.getAttribute('aria-valuenow')).toBe('62');
  });

  it('omits the progressbar when hasProgress is not set', () => {
    renderRow(<ActivityTrayItem title="file.pdf" />);

    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('renders the description, rightSlot, and trailingIcon slots', () => {
    const { container } = renderRow(
      <ActivityTrayItem
        title="file.pdf"
        description="Failed"
        rightSlot="62%"
        trailingIcon={<span aria-hidden>trailing</span>}
      />
    );

    const description = container.querySelector(
      '[data-slot="activity-tray-item-description"]'
    );
    expect(description?.textContent).toBe('Failed');

    const rightSlot = container.querySelector(
      '[data-slot="activity-tray-item-right"]'
    );
    expect(rightSlot?.textContent).toBe('62%');

    const trailingIcon = container.querySelector(
      '[data-slot="activity-tray-item-trailing-icon"]'
    );
    expect(trailingIcon?.textContent).toBe('trailing');
  });

  it('renders errorText instead of description when both would apply', () => {
    const { container } = renderRow(
      <ActivityTrayItem
        title="file.pdf"
        errorText="The file is larger than the 25 MB limit"
        description="should not show"
      />
    );

    const error = container.querySelector(
      '[data-slot="activity-tray-item-error-text"]'
    );
    expect(error?.textContent).toBe('The file is larger than the 25 MB limit');
    expect(
      container.querySelector('[data-slot="activity-tray-item-description"]')
    ).toBeNull();
  });

  /** No provider, no context — the row must fail loudly rather than render broken. */
  it('throws when rendered outside an ActivityTray', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<ActivityTrayItem title="orphan" />)).toThrow(
      'ActivityTray components must be used within an ActivityTray root'
    );

    consoleError.mockRestore();
  });
});

describe('auto-dismiss', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('marks a dismissible row as leaving after the delay, and removes it on animationend', async () => {
    render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={vi.fn()}
      >
        <ActivityTrayItem title="file.pdf" dismissible />
      </ActivityTray>
    );

    expect(
      screen.getByRole('listitem').getAttribute('data-leaving')
    ).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await act(async () => {});

    expect(screen.getByRole('listitem').getAttribute('data-leaving')).toBe('');

    fireEvent.animationEnd(screen.getByRole('listitem'));
    // The row's own unregister queues a microtask (the plate's emptiness
    // check); flush it so that update isn't left dangling outside act().
    await act(async () => {});

    expect(screen.queryByRole('listitem')).toBeNull();
  });

  it('never marks a non-dismissible row as leaving', () => {
    render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={vi.fn()}
      >
        <ActivityTrayItem title="file.pdf" />
      </ActivityTray>
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByRole('listitem').getAttribute('data-leaving')
    ).toBeNull();
  });

  /** The plate's own emptiness check runs a microtask after the last row unregisters. */
  it('marks the plate as leaving once its last dismissible row retires, and calls onDismiss when the root finishes leaving', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={onDismiss}
      >
        <ActivityTrayItem title="file.pdf" dismissible />
      </ActivityTray>
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    fireEvent.animationEnd(screen.getByRole('listitem'));

    await act(async () => {
      await Promise.resolve();
    });

    const root = container.querySelector(
      '[data-slot="activity-tray"]'
    ) as HTMLElement;
    expect(root.getAttribute('data-leaving')).toBe('');

    fireEvent.animationEnd(root);

    // The plate's own exit calls `onDismiss()` directly (no arguments), but
    // assert call count only, matching the ✕ button's passthrough call.
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('never marks the plate as leaving while a non-dismissible row remains', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={onDismiss}
      >
        <ActivityTrayItem title="done.pdf" dismissible />
        <ActivityTrayItem title="failed.pdf" />
      </ActivityTray>
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const leavingRow = screen
      .getAllByRole('listitem')
      .find((row) => row.getAttribute('data-leaving') === '');
    expect(leavingRow).toBeTruthy();

    if (leavingRow) {
      fireEvent.animationEnd(leavingRow);
    }

    await act(async () => {
      await Promise.resolve();
    });

    const root = container.querySelector(
      '[data-slot="activity-tray"]'
    ) as HTMLElement;
    expect(root.getAttribute('data-leaving')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does nothing after the delay when autoDismiss is false', () => {
    render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismissDelay={1500}
        onDismiss={vi.fn()}
      >
        <ActivityTrayItem title="file.pdf" dismissible />
      </ActivityTray>
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByRole('listitem').getAttribute('data-leaving')
    ).toBeNull();
    expect(screen.getByRole('listitem')).toBeTruthy();
  });

  /** A row taken out of dismissible contention must cancel its pending timer. */
  it('cancels the retirement timer when dismissible flips back to false before the delay', () => {
    const { rerender } = render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={vi.fn()}
      >
        <ActivityTrayItem title="file.pdf" dismissible />
      </ActivityTray>
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    rerender(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={vi.fn()}
      >
        <ActivityTrayItem title="file.pdf" dismissible={false} />
      </ActivityTray>
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByRole('listitem').getAttribute('data-leaving')
    ).toBeNull();
  });

  /**
   * forceMount keeps rows mounted while collapsed, so collapsing must not
   * itself be misread as the last row unregistering.
   */
  it('does not mark the plate as leaving or call onDismiss merely from collapsing', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={onDismiss}
      >
        <ActivityTrayItem title="file.pdf" dismissible />
      </ActivityTray>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Uploads' }));
    await act(async () => {});

    const root = container.querySelector(
      '[data-slot="activity-tray"]'
    ) as HTMLElement;
    expect(root.getAttribute('data-leaving')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  /**
   * A dismissible row's own retirement timer does not depend on the plate
   * being open (forceMount keeps it mounted, hidden, while collapsed). Once
   * it retires it stays gone; and once the plate is reopened, the guard
   * inside the plate's own emptiness check reads live (now-open) state, so
   * the plate follows the row out and `onDismiss` fires on the root's own
   * `animationend`.
   */
  it('keeps a dismissible row retiring while the plate is collapsed, then leaves the plate once reopened', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <ActivityTray
        headerTitle="Uploads"
        autoDismiss
        autoDismissDelay={1500}
        onDismiss={onDismiss}
      >
        <ActivityTrayItem title="file.pdf" dismissible />
      </ActivityTray>
    );

    const trigger = screen.getByRole('button', { name: 'Uploads' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const hiddenRow = screen.getByRole('listitem', { hidden: true });
    expect(hiddenRow.getAttribute('data-leaving')).toBe('');

    fireEvent.animationEnd(hiddenRow);
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    await act(async () => {});

    expect(screen.queryByRole('listitem')).toBeNull();

    const root = container.querySelector(
      '[data-slot="activity-tray"]'
    ) as HTMLElement;
    expect(root.getAttribute('data-leaving')).toBe('');

    fireEvent.animationEnd(root);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
