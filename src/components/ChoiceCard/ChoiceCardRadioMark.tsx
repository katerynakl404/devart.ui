import { Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { radioIndicatorVariants, radioVariants } from '../RadioButton';

interface ChoiceCardRadioMarkProps {
  isSelected: boolean;
  className: string;
}

const ChoiceCardRadioMark = ({
  isSelected,
  className,
}: ChoiceCardRadioMarkProps) => (
  <span
    data-slot="choice-card-indicator"
    data-state={isSelected ? 'checked' : 'unchecked'}
    aria-hidden="true"
    className={cn(radioVariants(), 'pointer-events-none', className)}
  >
    {isSelected && (
      <span className={cn(radioIndicatorVariants())}>
        <Circle className="fill-current text-current" />
      </span>
    )}
  </span>
);

export { ChoiceCardRadioMark };
