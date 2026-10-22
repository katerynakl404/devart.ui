import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from '../index';

const heading = () => screen.getByRole('heading', { level: 2 });

/**
 * Fork difference: the developers' row is the heading's parent. The fork groups
 * the back control, the title and the badge into a cluster inside the row, so
 * the row is the `page-header` slot itself.
 */
const titleRow = () => heading().closest('[data-slot="page-header"]');

describe('PageHeader', () => {
  it('renders the title as the page’s level-two heading', () => {
    render(<PageHeader title="Files" />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Files' })
    ).toBeInTheDocument();
  });

  it('places the actions beside the title', () => {
    render(
      <PageHeader
        title="Files"
        actions={<button type="button">Upload</button>}
      />
    );

    const row = titleRow();
    expect(row).toContainElement(
      screen.getByRole('button', { name: 'Upload' })
    );
    expect(row?.childElementCount).toBe(2);
  });

  /**
   * `canCreate && <Button />` hands the row `false`, not `null`. Checking for
   * `null` would keep an empty wrapper — and its gap — on the far edge.
   */
  it('renders no actions wrapper for a falsy actions value', () => {
    render(<PageHeader title="Files" actions={false} />);

    expect(titleRow()?.childElementCount).toBe(1);
  });

  /**
   * Fork difference: `titleLeft` opens the row, outside the cluster that holds
   * the back control, the title and `titleRight`; `titleRight` is wrapped in
   * the span that carries its 12px from the title.
   */
  it('places titleLeft before the title and titleRight after it', () => {
    render(
      <PageHeader
        title="Files"
        titleLeft={<span data-testid="title-left">Before</span>}
        titleRight={<button type="button">About</button>}
      />
    );

    const row = Array.from(titleRow()?.children ?? []);
    const titleGroup = Array.from(heading().parentElement?.children ?? []);

    expect(row).toHaveLength(2);
    expect(row[0]).toBe(screen.getByTestId('title-left'));
    expect(row[1]).toBe(heading().parentElement);
    expect(titleGroup).toHaveLength(2);
    expect(titleGroup[0]).toBe(heading());
    expect(titleGroup[1]).toContainElement(
      screen.getByRole('button', { name: 'About' })
    );
  });

  it('renders nothing for falsy titleLeft or titleRight', () => {
    render(<PageHeader title="Files" titleLeft={false} titleRight={false} />);

    expect(heading().parentElement?.childElementCount).toBe(1);
    expect(titleRow()?.childElementCount).toBe(1);
  });

  /** The mobile sidebar trigger goes here: it opens the row, before the arrow. */
  it('puts titleLeft before the back control', () => {
    render(
      <PageHeader
        title="Files"
        onBack={() => {}}
        backLabel="Back to home"
        titleLeft={<button type="button">Open navigation</button>}
      />
    );

    const [first, second] = screen.getAllByRole('button');

    expect(first).toHaveAccessibleName('Open navigation');
    expect(second).toHaveAccessibleName('Back to home');
    expect(heading().parentElement).toContainElement(
      screen.getByRole('button', { name: 'Back to home' })
    );
  });

  it('truncates the title by default', () => {
    render(<PageHeader title="Files" />);

    expect(heading()).toHaveClass('truncate');
  });

  /**
   * Without `truncate` the title loses the overflow that let it shrink beside
   * the actions, so `min-w-0` has to give that back.
   */
  it('wraps the title instead of truncating it with wrapTitle', () => {
    render(<PageHeader title="Data Sources" wrapTitle />);

    expect(heading()).not.toHaveClass('truncate');
    expect(heading()).toHaveClass('min-w-0', 'break-words');
  });

  it('keeps the condensed size on a wrapping title', () => {
    render(<PageHeader title="Data Sources" wrapTitle condensed />);

    expect(heading()).toHaveClass('text-xl');
    expect(heading()).not.toHaveClass('md:text-3xl');
  });

  it('lets className override the root spacing', () => {
    const { container } = render(<PageHeader title="Files" className="mb-6" />);

    expect(container.firstElementChild).toHaveClass('mb-6');
    expect(container.firstElementChild).not.toHaveClass('mb-2');
  });
});
