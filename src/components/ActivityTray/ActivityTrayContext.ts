'use client';

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
