import type { RefObject } from 'react';
import { useCallback, useLayoutEffect, useState } from 'react';

export const useValueLength = (
  ref: RefObject<HTMLTextAreaElement | null>,
  enabled: boolean
) => {
  const [length, setLength] = useState(0);

  const syncLength = useCallback(() => {
    if (enabled && ref.current) {
      setLength(ref.current.value.length);
    }
  }, [enabled, ref]);

  useLayoutEffect(syncLength);

  return [length, syncLength] as const;
};
