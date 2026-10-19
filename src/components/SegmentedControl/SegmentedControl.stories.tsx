import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGrid, List, Rows3 } from 'lucide-react';
import { useState } from 'react';
import { Typography } from '../Typography';
import {
  SegmentedControl,
  SegmentedControlContent,
  SegmentedControlList,
  SegmentedControlTrigger,
} from './index';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'default',
    rounded: 'md',
    defaultValue: 'list',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    variant: {
      control: 'select',
      options: ['default'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'list', label: 'List', icon: List },
  { value: 'grid', label: 'Grid', icon: LayoutGrid },
  { value: 'rows', label: 'Rows', icon: Rows3 },
] as const;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl {...args} value={value} onValueChange={setValue}>
        <SegmentedControlList>
          {options.map((option) => (
            <SegmentedControlTrigger key={option.value} value={option.value}>
              <option.icon />
              {option.label}
            </SegmentedControlTrigger>
          ))}
        </SegmentedControlList>
        {options.map((option) => (
          <SegmentedControlContent key={option.value} value={option.value}>
            <Typography>{option.label} view content</Typography>
          </SegmentedControlContent>
        ))}
      </SegmentedControl>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl {...args} size="sm" defaultValue="list">
        <SegmentedControlList>
          {options.map((option) => (
            <SegmentedControlTrigger key={option.value} value={option.value}>
              {option.label}
            </SegmentedControlTrigger>
          ))}
        </SegmentedControlList>
      </SegmentedControl>
      <SegmentedControl {...args} size="md" defaultValue="list">
        <SegmentedControlList>
          {options.map((option) => (
            <SegmentedControlTrigger key={option.value} value={option.value}>
              {option.label}
            </SegmentedControlTrigger>
          ))}
        </SegmentedControlList>
      </SegmentedControl>
    </div>
  ),
};

/** `tone`: what the selected half MEANS, for two options that are not
 *  equivalent — `positive` fills green, `negative` red. Unselected, both
 *  are neutral and hover as any trigger does. */
export const Tones: Story = {
  render: (args) => (
    <SegmentedControl {...args} size="sm" defaultValue="allow">
      <SegmentedControlList>
        <SegmentedControlTrigger value="allow" tone="positive">
          Allow
        </SegmentedControlTrigger>
        <SegmentedControlTrigger value="deny" tone="negative">
          Deny
        </SegmentedControlTrigger>
      </SegmentedControlList>
    </SegmentedControl>
  ),
};

/** `deselectable`: nothing selected is a state. Press the selected option
 *  again — or Enter / Space on it — and the value goes back to `''`. */
export const Deselectable: Story = {
  render: (args) => {
    const [value, setValue] = useState('allow');
    return (
      <div className="grid gap-2">
        <SegmentedControl
          {...args}
          size="sm"
          deselectable
          value={value}
          onValueChange={setValue}
          activationMode="manual"
        >
          <SegmentedControlList>
            <SegmentedControlTrigger value="allow" tone="positive">
              Allow
            </SegmentedControlTrigger>
            <SegmentedControlTrigger value="deny" tone="negative">
              Deny
            </SegmentedControlTrigger>
          </SegmentedControlList>
        </SegmentedControl>
        <Typography element="span" textStyle="body12" textColor="secondary">
          value: {value === '' ? '— (none)' : value}
        </Typography>
      </div>
    );
  },
};

/** Disabled keeps what it shows: the selected tone and a tinted option stay,
 *  dimmed, with the not-allowed cursor. */
export const Disabled: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <SegmentedControl {...args} size="sm" value="allow">
        <SegmentedControlList>
          <SegmentedControlTrigger value="allow" tone="positive" disabled>
            Allow
          </SegmentedControlTrigger>
          <SegmentedControlTrigger value="deny" tone="negative" disabled>
            Deny
          </SegmentedControlTrigger>
        </SegmentedControlList>
      </SegmentedControl>
      <SegmentedControl {...args} size="sm" value="">
        <SegmentedControlList>
          <SegmentedControlTrigger value="allow" tone="positive" disabled>
            Allow
          </SegmentedControlTrigger>
          <SegmentedControlTrigger value="deny" tone="negative" tinted disabled>
            Deny
          </SegmentedControlTrigger>
        </SegmentedControlList>
      </SegmentedControl>
    </div>
  ),
};

/** `tinted`: the value in effect without being chosen here — the tone's fill
 *  at 15%. Nothing is selected and "Allow" reaches the row from above;
 *  choosing either option draws it solid, and pressing it again clears it. */
export const Tinted: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <SegmentedControl
        {...args}
        size="sm"
        deselectable
        value={value}
        onValueChange={setValue}
        activationMode="manual"
      >
        <SegmentedControlList>
          <SegmentedControlTrigger
            value="allow"
            tone="positive"
            tinted={!value}
          >
            Allow
          </SegmentedControlTrigger>
          <SegmentedControlTrigger value="deny" tone="negative">
            Deny
          </SegmentedControlTrigger>
        </SegmentedControlList>
      </SegmentedControl>
    );
  },
};

export const Rounded: Story = {
  render: (args) => (
    <SegmentedControl {...args} rounded="full" defaultValue="list">
      <SegmentedControlList>
        {options.map((option) => (
          <SegmentedControlTrigger key={option.value} value={option.value}>
            {option.label}
          </SegmentedControlTrigger>
        ))}
      </SegmentedControlList>
    </SegmentedControl>
  ),
};
