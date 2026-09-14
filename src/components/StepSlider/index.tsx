'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';

export interface StepSliderStep {
  value: string;
  label: string;
}

const stepSliderVariants = cva(
  [
    'relative box-border flex touch-none select-none items-center',
    'rounded-full border-2 border-transparent bg-surface-chips',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled',
    // Radix offsets the thumb by setting `left` on a wrapper span it owns — the
    // last child here, since the thumb is rendered last. Animating that wrapper
    // is what turns each snap between stops into a glide; the same transition on
    // the thumb itself would never fire. Nothing may be rendered after the thumb
    // or this selector picks up the wrong element and the glide silently stops.
    '[&>span:last-child]:transition-[left] [&>span:last-child]:duration-fast [&>span:last-child]:ease-out',
    'motion-reduce:[&>span:last-child]:transition-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-16',
        default: 'h-5 w-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const stepSliderStopsVariants = cva(
  'pointer-events-none absolute inset-0 flex items-center justify-between',
  {
    variants: {
      size: {
        sm: 'px-1',
        default: 'px-1.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const STEP_SLIDER_DOT_CLASSES = 'size-1 rounded-full bg-ink-secondary';

const STEP_SLIDER_HIT_CLASSES = cn(
  'relative size-1 rounded-full',
  'before:absolute before:-inset-2 before:rounded-full before:content-[""]'
);

const stepSliderThumbVariants = cva(
  [
    'block shrink-0 rounded-full bg-content-on-solid',
    'shadow-thumb',
    'transition-[box-shadow]',
    'hover:shadow-thumb-hover',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-state-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface-card',
    'data-[disabled]:pointer-events-none',
  ],
  {
    variants: {
      size: {
        sm: 'size-3',
        default: 'size-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface StepSliderProps
  extends Omit<
      React.ComponentPropsWithRef<typeof SliderPrimitive.Root>,
      | 'value'
      | 'defaultValue'
      | 'onValueChange'
      | 'onValueCommit'
      | 'min'
      | 'max'
      | 'step'
      | 'children'
      | 'asChild'
    >,
    VariantProps<typeof stepSliderVariants> {
  steps: StepSliderStep[];
  value: string;
  'aria-label': string;
  showStepTooltips?: boolean;
  onValueChange?: (value: string) => void;
}

/**
 * Slider constrained to a short list of named stops, drawn as dots on the
 * track: drag the thumb, click a dot or anywhere on the track to snap to the
 * nearest stop, or use the arrow keys.
 */
const StepSlider = ({
  className,
  steps,
  value,
  size,
  disabled,
  showStepTooltips = false,
  'aria-label': ariaLabel,
  onValueChange,
  ref,
  ...props
}: StepSliderProps) => {
  const maxIndex = Math.max(steps.length - 1, 0);
  const selectedIndex = Math.max(
    steps.findIndex((step) => step.value === value),
    0
  );

  const handleValueChange = ([nextIndex]: number[]) => {
    const nextStep = steps[nextIndex ?? 0];

    if (nextStep && nextStep.value !== value) onValueChange?.(nextStep.value);
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      min={0}
      max={maxIndex}
      step={1}
      value={[selectedIndex]}
      orientation="horizontal"
      disabled={disabled}
      className={cn(stepSliderVariants({ size }), className)}
      onValueChange={handleValueChange}
      {...props}
    >
      <div className={stepSliderStopsVariants({ size })}>
        {steps.map((step) => (
          <span
            key={step.value}
            aria-hidden
            className={STEP_SLIDER_DOT_CLASSES}
          />
        ))}
      </div>

      {showStepTooltips && !disabled && (
        <div
          aria-hidden
          className={cn(
            stepSliderStopsVariants({ size }),
            'pointer-events-auto z-10'
          )}
        >
          {steps.map((step) => (
            <Tooltip key={step.value}>
              <TooltipTrigger asChild>
                <span
                  data-slot="step-slider-stop"
                  className={STEP_SLIDER_HIT_CLASSES}
                />
              </TooltipTrigger>

              <TooltipContent>{step.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        aria-valuetext={steps[selectedIndex]?.label}
        className={stepSliderThumbVariants({ size })}
      />
    </SliderPrimitive.Root>
  );
};

StepSlider.displayName = 'StepSlider';

export { StepSlider };
