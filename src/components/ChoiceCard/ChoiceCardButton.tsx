import type { ComponentProps, Ref } from 'react';

interface ChoiceCardButtonProps
  extends Omit<ComponentProps<'button'>, 'ref' | 'type'> {
  ref?: Ref<HTMLElement>;
  state: 'checked' | 'unchecked';
}

const ChoiceCardButton = ({
  ref,
  state,
  disabled,
  ...props
}: ChoiceCardButtonProps) => (
  <button
    type="button"
    ref={ref as Ref<HTMLButtonElement>}
    data-slot="choice-card"
    data-state={state}
    data-disabled={disabled ? '' : undefined}
    disabled={disabled}
    {...props}
  />
);

export { ChoiceCardButton };
