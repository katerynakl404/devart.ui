/**
 * The developers' `ActivityTray` folder, frozen at their 1.4.0 — `git show
 * f69ebc9:src/components/ActivityTray/ActivityTrayItem.types.ts`, import paths alone changed.
 * The Before half of the ActivityTray page renders this folder, so it is the
 * tray the developer storybook ships, not a drawing of it. What it imports
 * from outside the folder is the live package's. Not edited: replace the
 * folder whole when the base moves.
 */

import type { ComponentProps, ReactNode } from 'react';

interface ActivityTrayItemBaseProps
  extends Omit<ComponentProps<'li'>, 'title' | 'children'> {
  title: ReactNode;
  icon?: ReactNode;
  errorText?: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  rightSlot?: ReactNode;
  trailingIcon?: ReactNode;
  dismissible?: boolean;
  onActivate?: () => void;
}

type ActivityTrayItemProps =
  | (ActivityTrayItemBaseProps & {
      hasProgress: true;
      progress: number;
      progressLabel?: string;
    })
  | (ActivityTrayItemBaseProps & {
      hasProgress?: false;
      progress?: never;
      progressLabel?: never;
    });

export type { ActivityTrayItemProps };
