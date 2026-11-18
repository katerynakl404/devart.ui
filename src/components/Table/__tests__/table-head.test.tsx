import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../index';

describe('TableHead', () => {
  /** A head narrower than its word is cut with an ellipsis under fixed layout,
   *  as the cells are — it does not run over the next column. */
  it('cuts its label under layout="fixed"', () => {
    const { container } = render(
      <Table layout="fixed">
        <TableHeader>
          <TableRow>
            <TableHead width="sm">Contributors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody />
      </Table>
    );
    const th = container.querySelector(
      '[data-slot="table-head"]'
    ) as HTMLElement;
    expect(th).toHaveClass(
      '[[data-layout=fixed]_&]:overflow-hidden',
      '[[data-layout=fixed]_&]:text-ellipsis'
    );
  });

  it('cuts a sortable label inside its button and keeps the glyph', () => {
    const { container } = render(
      <Table layout="fixed">
        <TableHeader>
          <TableRow>
            <TableHead width="sm" sortable sortDirection="asc">
              Last activity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody />
      </Table>
    );
    const button = container.querySelector('th button') as HTMLElement;
    expect(button).toHaveClass('max-w-full');
    expect(button.querySelector('span.truncate')).toHaveTextContent(
      'Last activity'
    );
    expect(button.querySelector('svg')).not.toBeNull();
  });
});
