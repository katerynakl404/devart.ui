import type { Ref } from 'react';

type Cleanup = () => void;

const setRef = <T>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') return ref(value) as Cleanup | undefined;
  if (ref) ref.current = value;
};

/**
 * Merges several refs into one callback ref, so a component can keep its own
 * ref on an element while still honouring the one a consumer passed. A
 * callback ref that returns a cleanup (React 19) gets that cleanup called on
 * detach instead of a `null` call, as React itself would do.
 */
export const composeRefs =
  <T>(...refs: (Ref<T> | undefined)[]) =>
  (value: T | null) => {
    const cleanups = refs.map((ref) => setRef(ref, value));

    if (!cleanups.some((cleanup) => typeof cleanup === 'function')) return;

    return () => {
      cleanups.forEach((cleanup, index) => {
        if (typeof cleanup === 'function') cleanup();
        else setRef(refs[index], null);
      });
    };
  };
