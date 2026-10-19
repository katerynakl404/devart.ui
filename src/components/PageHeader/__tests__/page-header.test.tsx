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
