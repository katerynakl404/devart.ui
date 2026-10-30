'use client';

/**
 * The developers' `ActivityTray` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/ActivityTray/ActivityTrayContext.ts`, import paths alone changed.
 * The Before half of the ActivityTray page renders this folder, so it is the
 * tray the developer storybook ships, not a drawing of it. What it imports
 * from outside the folder is the live package's. Not edited: replace the
 * folder whole when the base moves.
 */

import { createContext, useContext } from 'react';

interface ActivityTrayContextValue {
  autoDismiss: boolean;
  autoDismissDelay: number;
  registerItem: () => () => void;
}

const ActivityTrayContext = createContext<ActivityTrayContextValue | null>(
  null
);

const useActivityTray = () => {
  const context = useContext(ActivityTrayContext);

  if (!context) {
    throw new Error(
      'ActivityTray components must be used within an ActivityTray root'
    );
  }

  return context;
};

export { ActivityTrayContext, useActivityTray };
