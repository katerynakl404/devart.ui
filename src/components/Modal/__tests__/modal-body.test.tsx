import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SheetBody } from '../../Sheet';
import { ModalBody } from '../ModalBody';

const classes = (el: HTMLElement) => el.className.split(/\s+/);

/**
 * jsdom has no layout, so these pin the class contract that decides where a
 * body sits: it reaches over its surface's padding only when the surface has
 * one, and a caller's `mx-0` / own inset replaces the default rather than
 * stacking on it (§176 — `ConfirmationDialog` once kept `-mx-4` beside its
 * `mr-0` and would have pulled its text 16px past the dialog's left edge).
 */
describe('ModalBody', () => {
  it('reaches over ModalContent’s p-4 by default', () => {
    render(<ModalBody>body</ModalBody>);
    const el = screen.getByText('body');
    expect(classes(el)).toEqual(
      expect.arrayContaining(['-mx-4', 'px-4', 'scrollbar-thin'])
    );
  });

  it('takes a padding-less surface’s mx-0 and its own inset instead', () => {
    render(<ModalBody className="mx-0 px-5">body</ModalBody>);
    const el = screen.getByText('body');
    expect(classes(el)).toEqual(expect.arrayContaining(['mx-0', 'px-5']));
    expect(classes(el)).not.toContain('-mx-4');
    expect(classes(el)).not.toContain('px-4');
  });
});

describe('SheetBody', () => {
  it('reaches over SheetContent’s p-6 by default, on the system’s thin bar', () => {
    render(<SheetBody>body</SheetBody>);
    const el = screen.getByText('body');
    expect(classes(el)).toEqual(
      expect.arrayContaining([
        '-mx-6',
        'px-6',
        'overflow-y-auto',
        'scrollbar-thin',
      ])
    );
  });

  it('takes a padding-less sheet’s mx-0', () => {
    render(<SheetBody className="mx-0">body</SheetBody>);
    const el = screen.getByText('body');
    expect(classes(el)).toContain('mx-0');
    expect(classes(el)).not.toContain('-mx-6');
  });
});
