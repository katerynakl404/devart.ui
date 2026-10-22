import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCloseOnViewportChange } from '../use-close-on-viewport-change';

interface Props {
  enabled: boolean;
  onClose: () => void;
}

const setup = (enabled: boolean, content: HTMLElement | null = null) => {
  const onClose = vi.fn();
  const contentRef = { current: content };
  const hook = renderHook(
    (props: Props) => useCloseOnViewportChange({ contentRef, ...props }),
    { initialProps: { enabled, onClose } as Props }
  );
  return { ...hook, onClose };
};

const mountedElements: HTMLElement[] = [];
const mount = (parent: HTMLElement = document.body) => {
  const el = document.createElement('div');
  parent.appendChild(el);
  mountedElements.push(el);
  return el;
};

const scroll = (target: EventTarget) =>
  target.dispatchEvent(new Event('scroll', { bubbles: false }));

describe('useCloseOnViewportChange', () => {
  afterEach(() => {
    for (const el of mountedElements.splice(0)) el.remove();
  });

  it('adds no listeners when disabled', () => {
    const { onClose } = setup(false);

    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes once on window resize', () => {
    const { onClose } = setup(true);

    window.dispatchEvent(new Event('resize'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on window scroll', () => {
    const { onClose } = setup(true);

    window.dispatchEvent(new Event('scroll'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores a scroll inside the content but closes on an unrelated one', () => {
    const content = mount();
    const inside = mount(content);
    const outside = mount();
    const { onClose } = setup(true, content);

    scroll(inside);
    scroll(content);
    expect(onClose).not.toHaveBeenCalled();

    scroll(outside);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('removes listeners when enabled turns false', () => {
    const { rerender, onClose } = setup(true);

    rerender({ enabled: false, onClose });
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('removes listeners on unmount', () => {
    const { unmount, onClose } = setup(true);

    unmount();
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls the latest onClose', () => {
    const { rerender, onClose } = setup(true);
    const next = vi.fn();

    rerender({ enabled: true, onClose: next });
    window.dispatchEvent(new Event('resize'));

    expect(onClose).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
