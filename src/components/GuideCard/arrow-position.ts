import type { GuideCardSide } from './types';

const toArrowPosition = (side: GuideCardSide, offset: number | string) =>
  side === 'left' || side === 'right' ? { top: offset } : { left: offset };

export { toArrowPosition };
