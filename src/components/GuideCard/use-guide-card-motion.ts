import { useEffect, useState } from 'react';
import type { GuideCardMotion } from './types';

const NUDGE_DURATION_MS = 420;

interface GuideCardMotionOptions {
  nudgeCount?: number;
  isLeaving: boolean;
}

export const useGuideCardMotion = ({
  nudgeCount,
  isLeaving,
}: GuideCardMotionOptions): GuideCardMotion => {
  const [isNudging, setIsNudging] = useState(false);

  useEffect(() => {
    if (!nudgeCount) return;

    setIsNudging(false);
    const frame = requestAnimationFrame(() => setIsNudging(true));
    const timer = setTimeout(() => setIsNudging(false), NUDGE_DURATION_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [nudgeCount]);

  if (isLeaving) return 'out';

  return isNudging ? 'nudge' : 'in';
};
