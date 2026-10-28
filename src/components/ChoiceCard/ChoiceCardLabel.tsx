import type { CSSProperties, ReactNode, Ref } from 'react';
import { Checkbox, type CheckboxProps } from '../Checkbox';

interface ChoiceCardLabelProps {
  ref?: Ref<HTMLElement>;
  className: string;
  style?: CSSProperties;
  state: 'checked' | 'unchecked';
  disabled: boolean;
  checkbox: CheckboxProps;
  children: ReactNode;
}

const ChoiceCardLabel = ({
  ref,
  className,
  style,
  state,
  disabled,
  checkbox,
  children,
}: ChoiceCardLabelProps) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: the Checkbox inside is the control — a `<button role="checkbox">`, which a label wraps and activates
  <label
    ref={ref as Ref<HTMLLabelElement>}
    data-slot="choice-card"
    data-state={state}
    data-disabled={disabled ? '' : undefined}
    className={className}
    style={style}
  >
    {children}
    <Checkbox {...checkbox} />
  </label>
);

export { ChoiceCardLabel };
