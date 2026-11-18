import { expect, it } from 'vitest';
import type { SwitchProps } from '../index';

// Type-level cases: `check-types` fails if an `@ts-expect-error` stops erroring.
const accepted: SwitchProps[] = [
  {},
  { label: 'Active' },
  { 'aria-label': 'Active' },
  { description: 'Stops syncing', label: 'Active' },
  { description: 'Stops syncing', 'aria-label': 'Active' },
  { description: 'Stops syncing', 'aria-labelledby': 'heading' },
  { tooltip: 'Owner only' },
  { tooltip: true, 'aria-label': 'Activate' },
  { tooltip: true, 'aria-label': 'Activate', label: 'Active' },
];

const rejected: SwitchProps[] = [
  // @ts-expect-error a description needs label, aria-label or aria-labelledby
  { description: 'Stops syncing' },
  // @ts-expect-error label must not be empty when it names a described switch
  { description: 'Stops syncing', label: undefined },
  // @ts-expect-error tooltip={true} repeats the aria-label, so it needs one
  { tooltip: true },
  // @ts-expect-error a visible label is not what tooltip={true} repeats
  { tooltip: true, label: 'Active' },
];

it('keeps the SwitchProps naming rules', () => {
  expect(accepted.length + rejected.length).toBeGreaterThan(0);
});
