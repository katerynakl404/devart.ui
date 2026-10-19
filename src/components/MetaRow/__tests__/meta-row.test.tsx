import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetaRow } from '../index';

const row = (container: HTMLElement) =>
  container.querySelector('[data-slot="meta-row"]') as HTMLElement;

describe('MetaRow', () => {
  describe('sticky', () => {
    it('stays in the flow, transparent, by default', () => {
      const { container } = render(
        <MetaRow>
          <MetaRow.Count>5 connections</MetaRow.Count>
        </MetaRow>
      );

      expect(row(container)).not.toHaveClass('sticky');
      expect(row(container)).toHaveClass('bg-transparent');
      expect(row(container).style.top).toBe('');
    });

    /**
     * The page colour, not transparency: a sticky row the list scrolls under
     * has to hide the rows passing behind it.
     */
    it('pins to the top of the scroller on the page colour', () => {
      const { container } = render(
        <MetaRow sticky>
          <MetaRow.Count>3 selected</MetaRow.Count>
        </MetaRow>
      );

      expect(row(container)).toHaveClass('sticky', 'bg-surface-page');
      expect(row(container)).not.toHaveClass('bg-transparent');
      expect(row(container).style.top).toBe('0px');
    });

    it('offsets by the caller’s length', () => {
      const { container } = render(
        <MetaRow sticky stickyOffset="3.5rem">
          <MetaRow.Count>3 selected</MetaRow.Count>
        </MetaRow>
      );

      expect(row(container).style.top).toBe('3.5rem');
    });

    it('sets no offset while not sticky, even when one is passed', () => {
      const { container } = render(
        <MetaRow stickyOffset="3.5rem">
          <MetaRow.Count>5 connections</MetaRow.Count>
        </MetaRow>
      );

      expect(row(container).style.top).toBe('');
    });

    it('keeps the caller’s own style alongside the offset', () => {
      const { container } = render(
        <MetaRow sticky style={{ zIndex: 30 }}>
          <MetaRow.Count>3 selected</MetaRow.Count>
        </MetaRow>
      );

      expect(row(container).style.top).toBe('0px');
      expect(row(container).style.zIndex).toBe('30');
    });
  });
});
