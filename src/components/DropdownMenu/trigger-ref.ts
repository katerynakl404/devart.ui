import { createContext, type RefObject } from 'react';

export const TriggerRefContext =
  createContext<RefObject<HTMLButtonElement | null> | null>(null);
