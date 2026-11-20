import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { StatTile } from '../index';

describe('StatTile', () => {
  it('reads label, value, description in that order', () => {
    const { container } = render(
      <StatTile
        label="Queries"
        value="1,608"
        description="in the last 30 days"
      />
    );

    const root = container.querySelector('[data-slot="stat-tile"]');
    const slots = [...(root?.querySelectorAll('[data-slot]') ?? [])].map((el) =>
      el.getAttribute('data-slot')
    );
    expect(slots).toEqual([
      'stat-tile-header',
      'stat-tile-label',
      'stat-tile-value',
      'stat-tile-description',
    ]);
    expect(root).toHaveTextContent('Queries1,608in the last 30 days');
  });

  it('renders no description line without a description', () => {
    const { container } = render(<StatTile label="Users" value={0} />);

    expect(
      container.querySelector('[data-slot="stat-tile-description"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-slot="stat-tile-value"]')
    ).toHaveTextContent('0');
  });

  it('puts rightSlot in the header beside the label', () => {
    const { getByText } = render(
      <StatTile label="Connections" value={3} rightSlot={<b>1 not set</b>} />
    );

    expect(getByText('1 not set').parentElement).toHaveAttribute(
      'data-slot',
      'stat-tile-header'
    );
  });

  it('forwards ref and extra props to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <StatTile ref={ref} label="Users" value={1} aria-label="Users: 1" />
    );

    expect(ref.current).toBe(
      container.querySelector('[data-slot="stat-tile"]')
    );
    expect(ref.current).toHaveAttribute('aria-label', 'Users: 1');
  });
});
