/**
 * Runs the consumer's handler first, then ours unless the consumer cancelled
 * the event — the same order Radix uses, so a `preventDefault()` upstream
 * keeps meaning "skip the built-in behaviour".
 */
export const composeEventHandlers =
  <E extends { defaultPrevented: boolean }>(
    consumerHandler: ((event: E) => void) | undefined,
    ourHandler: (event: E) => void
  ) =>
  (event: E) => {
    consumerHandler?.(event);

    if (!event.defaultPrevented) ourHandler(event);
  };
