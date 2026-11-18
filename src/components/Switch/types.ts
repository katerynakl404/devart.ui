import type { ReactNode } from 'react';

/** A description needs a name for the switch to describe. */
export type SwitchDescriptionProps =
  | { description?: undefined }
  | {
      /** Secondary text under the label. */
      description: ReactNode;
      label: NonNullable<ReactNode>;
    }
  | { description: ReactNode; 'aria-label': string }
  | { description: ReactNode; 'aria-labelledby': string };

/** `tooltip={true}` repeats the `aria-label`, so it needs one. */
export type SwitchTooltipProps =
  | { tooltip?: Exclude<ReactNode, true> }
  | { tooltip: true; 'aria-label': string };
