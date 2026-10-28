import { type KeyboardEvent, useRef } from 'react';

const ARROW_DELTA: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

const RADIO_SELECTOR =
  '[data-slot="choice-card"][role="radio"]:not(:disabled), [data-slot="choice-card"] > [role="radio"]:not(:disabled)';

export const useArrowNavigation = (allowArrowNav: boolean) => {
  const isArrowNavigating = useRef(false);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta = ARROW_DELTA[event.key];

    if (!allowArrowNav || !delta) return;

    const radioCards = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(RADIO_SELECTOR)
    );
    const activeIndex = radioCards.indexOf(
      document.activeElement as HTMLElement
    );

    if (activeIndex < 0) return;

    event.preventDefault();
    const nextCard =
      radioCards[(activeIndex + delta + radioCards.length) % radioCards.length];
    isArrowNavigating.current = true;

    try {
      nextCard?.focus();
      nextCard?.click();
    } finally {
      isArrowNavigating.current = false;
    }
  };

  return { isArrowNavigating, onKeyDown };
};
