'use client';

import { type ReactNode, useId } from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/utils';
import { SwitchControl, type SwitchControlProps } from './SwitchControl';
import type { SwitchDescriptionProps, SwitchTooltipProps } from './types';

// `group/switch` lets the label and description read the track's
// `data-disabled` from the DOM instead of a `disabled` prop.
const switchContainerVariants = cva('group/switch flex items-center', {
  variants: {
    labelPosition: {
      left: 'flex-row',
      right: 'flex-row-reverse',
      top: 'flex-col-reverse',
      bottom: 'flex-col',
    },
    gap: {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    },
    variant: {
      default: null,
      tertiary: cn(
        'cursor-pointer rounded',
        'transition-colors duration-fast',
        'hover:bg-state-hover',
        'pressed:bg-state-pressed',
        'has-[[data-disabled]]:cursor-not-allowed',
        'has-[[data-disabled]]:hover:bg-transparent',
        'has-[[data-disabled]]:pressed:bg-transparent'
      ),
    },
    withDescription: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    {
      withDescription: true,
      labelPosition: ['left', 'right'],
      class: 'items-start',
    },
  ],
  defaultVariants: {
    labelPosition: 'right',
    gap: 'md',
    variant: 'default',
    withDescription: false,
  },
});

const switchLabelClasses = cn(
  'cursor-pointer font-medium text-ink-body text-sm',
  'group-has-[[data-disabled]]/switch:cursor-not-allowed',
  'group-has-[[data-disabled]]/switch:opacity-disabled'
);

const switchDescriptionClasses = cn(
  'font-normal text-ink-secondary text-xs',
  'group-has-[[data-disabled]]/switch:opacity-disabled'
);

interface SwitchBaseProps
  extends Omit<SwitchControlProps, 'besideLabel' | 'descriptionId' | 'tooltip'>,
    Omit<
      VariantProps<typeof switchContainerVariants>,
      'variant' | 'withDescription'
    > {
  label?: ReactNode;
  containerVariant?: VariantProps<typeof switchContainerVariants>['variant'];
  labelClassName?: string;
}

export type SwitchProps = SwitchBaseProps &
  SwitchDescriptionProps &
  SwitchTooltipProps;

/** A switch with an optional label and description beside it. */
const Switch = ({
  className,
  label,
  description,
  labelPosition,
  gap,
  containerVariant,
  labelClassName,
  id: idProp,
  ...controlProps
}: SwitchProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = useId();
  const withDescription = Boolean(description);
  // The sm track lines up with the label's first line only beside it
  const besideLabel = labelPosition !== 'top' && labelPosition !== 'bottom';

  if (!label && !description) {
    return (
      <SwitchControl id={idProp} className={className} {...controlProps} />
    );
  }

  const labelElement = label ? (
    <label htmlFor={id} className={cn(switchLabelClasses, labelClassName)}>
      {label}
    </label>
  ) : null;

  return (
    <div
      className={cn(
        switchContainerVariants({
          labelPosition,
          gap,
          variant: containerVariant,
          withDescription,
        }),
        className
      )}
    >
      <SwitchControl
        id={id}
        descriptionId={withDescription ? descriptionId : undefined}
        besideLabel={besideLabel}
        {...controlProps}
      />
      {withDescription ? (
        <div data-slot="switch-text" className="flex min-w-0 flex-col gap-0.5">
          {labelElement}
          <span
            id={descriptionId}
            data-slot="switch-description"
            className={switchDescriptionClasses}
          >
            {description}
          </span>
        </div>
      ) : (
        labelElement
      )}
    </div>
  );
};

Switch.displayName = 'Switch';

export { Switch, switchContainerVariants };
