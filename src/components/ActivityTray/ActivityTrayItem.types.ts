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
