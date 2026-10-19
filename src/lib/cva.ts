/**
 * `cva`, re-exported with its config kept on the returned recipe.
 *
 * The upstream helper closes over the config and never hands it back, so a test
 * cannot enumerate a component's variants — it would have to hardcode them,
 * which is exactly the list that drifts. Keeping a reference lets one generic
 * test walk every recipe in the package and snapshot the class string each
 * variant produces, so a change to a shared base string shows up as a diff on
 * every variant it touched rather than as a silent visual regression.
 *
 * Purely additive: the returned function behaves identically and `VariantProps`
 * still resolves through it. Components import `cva` from here, never from
 * `class-variance-authority` directly.
 */
import { cva as baseCva } from 'class-variance-authority';

export type { VariantProps } from 'class-variance-authority';

/**
 * Structural view of a cva config, deliberately widened.
 *
 * The precise generic type would be inlined into every component's generated
 * `.d.ts`, turning a one-line recipe into a wall of literal keys and making the
 * published surface churn on every variant edit. Consumers never read this; the
 * recipe test walks it at runtime, where the widened shape is enough.
 */
export interface CvaConfig {
  variants?: Record<string, Record<string, unknown>>;
  defaultVariants?: Record<string, unknown>;
  compoundVariants?: Record<string, unknown>[];
}

type CvaArgs<T> = Parameters<typeof baseCva<T>>;

export const cva = <T>(...args: CvaArgs<T>) =>
  Object.assign(baseCva<T>(...args), {
    config: args[1] as CvaConfig | undefined,
  });
