import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';
import { cva } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { ChoiceCardButton } from './ChoiceCardButton';

const choiceCardHeadVariants = cva(
  cn(
    'flex w-full items-start gap-2.5 px-3 py-2.5',
    'rounded-[inherit] border-0 bg-transparent text-left',
    'cursor-pointer focus-visible:outline-none disabled:cursor-not-allowed'
  )
);

interface ChoiceCardExpandableProps {
  ref?: Ref<HTMLElement>;
  className: string;
  style?: CSSProperties;
  state: 'checked' | 'unchecked';
  disabled: boolean;
  headProps: Omit<
    ComponentProps<'button'>,
    'type' | 'ref' | 'className' | 'children' | 'disabled'
  >;
  panel: ReactNode;
  children: ReactNode;
}

const ChoiceCardExpandable = ({
  ref,
  className,
  style,
  state,
  disabled,
  headProps,
  panel,
  children,
}: ChoiceCardExpandableProps) => (
  <div
    ref={ref as Ref<HTMLDivElement>}
    data-slot="choice-card"
    data-state={state}
    data-disabled={disabled ? '' : undefined}
    className={className}
    style={style}
  >
    <ChoiceCardButton
      {...headProps}
      state={state}
      disabled={disabled || undefined}
      data-slot="choice-card-head"
      className={cn(choiceCardHeadVariants())}
    >
      {children}
    </ChoiceCardButton>

    {state === 'checked' && (
      <div
        data-slot="choice-card-content"
        className="flex flex-col gap-2 px-3 pb-3"
      >
        {panel}
      </div>
    )}
  </div>
);

export { ChoiceCardExpandable, choiceCardHeadVariants };
