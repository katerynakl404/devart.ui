import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputGroup, InputGroupInput } from '../InputGroup';
import { Input } from './index';

/**
 * Not a field: the bare `<input>` inside one, with no border, padding or
 * label of its own. A field is always `InputGroup` with `InputGroupInput`.
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type here…',
    disabled: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    ref: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A letter typed or pasted never reaches the value: "30s" pasted is 30. */
export const DigitsOnly: Story = {
  render: (args) => (
    <div className="w-72">
      <InputGroup label="Port" inputId="input-digits">
        <InputGroupInput {...args} digitsOnly defaultValue="5432" />
      </InputGroup>
    </div>
  ),
};
