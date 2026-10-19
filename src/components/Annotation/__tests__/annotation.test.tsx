import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Annotation, AnnotationGroup } from '../index';

const setWidth = (px: number) =>
  Object.defineProperty(window, 'innerWidth', {
    value: px,
    configurable: true,
    writable: true,
  });

const target = (id: string, left: number) => {
  const el = document.createElement('button');
  el.id = id;
  el.getBoundingClientRect = () =>
    ({
      left,
      top: 100,
      right: left + 40,
      bottom: 132,
      width: 40,
      height: 32,
    }) as DOMRect;
  document.body.appendChild(el);
  return el;
};

const labels = () =>
  Array.from(
    document.body.querySelectorAll<HTMLElement>('[data-slot="annotation"]')
  );

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  setWidth(1024);
});

describe('Annotation', () => {
  it('renders nothing on its own', () => {
    const { container } = render(<Annotation target="#x">Text</Annotation>);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('AnnotationGroup', () => {
  it('portals one label per annotation onto the given line', () => {
    target('attach', 200);
    target('model', 600);
    render(
      <AnnotationGroup top={180}>
        <Annotation target="#attach" icon={<svg />}>
          Attach a file
        </Annotation>
        <Annotation target="#model">Pick a model</Annotation>
      </AnnotationGroup>
    );

    expect(labels()).toHaveLength(2);
    expect(labels()[0]).toHaveTextContent('Attach a file');
    for (const label of labels()) expect(label.style.top).toBe('180px');
  });

  it('draws a dashed ring and an arrow per located target', async () => {
    target('attach', 200);
    render(
      <AnnotationGroup top={180}>
        <Annotation target="#attach">Attach a file</Annotation>
        <Annotation target="#missing">Not on the page</Annotation>
      </AnnotationGroup>
    );

    await waitFor(() =>
      expect(document.body.querySelectorAll('svg rect')).toHaveLength(1)
    );
    // the ring is the target's box grown by 3px
    const ring = document.body.querySelector('svg rect');
    expect(ring).toHaveAttribute('x', '197');
    expect(ring).toHaveAttribute('width', '46');
    expect(document.body.querySelectorAll('svg path[marker-end]')).toHaveLength(
      1
    );
  });

  it('keeps neighbouring rings 6px apart', async () => {
    target('attach', 200); // ring 197–243
    target('connect', 244); // ring 241–287: they would overlap
    render(
      <AnnotationGroup top={180}>
        <Annotation target="#attach">Attach</Annotation>
        <Annotation target="#connect">Connect</Annotation>
      </AnnotationGroup>
    );

    await waitFor(() =>
      expect(document.body.querySelectorAll('svg rect')).toHaveLength(2)
    );
    const [a, b] = Array.from(document.body.querySelectorAll('svg rect'));
    // the gap is split at 242: the first ends at 239, the second starts at 245
    expect(a).toHaveAttribute('x', '197');
    expect(a).toHaveAttribute('width', '42');
    expect(b).toHaveAttribute('x', '245');
  });

  it('fades out while leaving', () => {
    render(
      <AnnotationGroup top={180} leaving>
        <Annotation target="#x">Text</Annotation>
      </AnnotationGroup>
    );

    const group = document.body.querySelector('[data-slot="annotation-group"]');
    expect(group).toHaveAttribute('data-state', 'leaving');
    expect(group?.className).toContain('animate-spotlight-out');
  });

  it('lays nothing out at 640px and below', () => {
    setWidth(640);
    target('attach', 200);
    render(
      <AnnotationGroup top={180}>
        <Annotation target="#attach">Attach a file</Annotation>
      </AnnotationGroup>
    );

    expect(document.body.querySelectorAll('svg rect')).toHaveLength(0);
    expect(labels()[0]?.className).toContain('invisible');
  });
});
