import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Autocomplete } from '../Autocomplete';
import { Button } from '../Button';
import { PasswordInput } from '../PasswordInput';
import { SearchInput } from '../SearchInput';
import { Select } from '../Select';
import { TextArea } from '../TextArea';
import { TooltipProvider } from '../Tooltip';
import { InputGroup, InputGroupAddon, InputGroupInput } from './index';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Option {
  id: string;
  label: string;
}

const NEW_YORK: Option = { id: 'ny', label: 'New York' };
const LONDON: Option = { id: 'ldn', label: 'London' };

const CITIES: Option[] = [
  NEW_YORK,
  LONDON,
  { id: 'tky', label: 'Tokyo' },
  { id: 'par', label: 'Paris' },
  { id: 'ber', label: 'Berlin' },
];

const label = (o: Option) => o.label;

const AUTH: Option[] = [
  { id: 'password', label: 'Password' },
  { id: 'key', label: 'Public key' },
  { id: 'agent', label: 'SSH agent' },
];

/** Every field a form uses, one under another, empty or filled. */
function Fields({
  size,
  filled,
  width = 'w-80',
}: {
  size: Size;
  filled: boolean;
  width?: string;
}) {
  const [search, setSearch] = useState(filled ? 'Q3 KPI' : '');
  const [city, setCity] = useState<Option | null>(filled ? LONDON : null);
  const [cities, setCities] = useState<Option[]>(
    filled ? [NEW_YORK, LONDON] : []
  );
  const [auth, setAuth] = useState<string | null>(filled ? 'key' : null);
  const id = (name: string) => `${name}-${size}-${filled ? 'f' : 'e'}`;

  return (
    <div className={cn('flex flex-col gap-4', width)}>
      <InputGroup size={size} label="Name" inputId={id('name')}>
        <InputGroupInput
          placeholder="Your name"
          defaultValue={filled ? 'Anna Novak' : undefined}
        />
      </InputGroup>

      <InputGroup size={size} label="Email" inputId={id('email')}>
        <InputGroupAddon align="inline-start">
          <Mail aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          type="email"
          placeholder="you@example.com"
          defaultValue={filled ? 'anna@example.com' : undefined}
        />
      </InputGroup>

      <PasswordInput
        placeholder="Password"
        defaultValue={filled ? 'secret-pass' : undefined}
        inputGroupProps={{ size, label: 'Password', inputId: id('pass') }}
      />

      <InputGroup size={size} label="Port" inputId={id('port')}>
        <InputGroupInput
          digitsOnly
          placeholder="5432"
          defaultValue={filled ? '5432' : undefined}
        />
      </InputGroup>

      <InputGroup size={size} label="Timeout" inputId={id('timeout')}>
        <InputGroupInput
          digitsOnly
          placeholder="30"
          defaultValue={filled ? '30' : undefined}
        />
        <InputGroupAddon align="inline-end">seconds</InputGroupAddon>
      </InputGroup>

      <SearchInput
        size={size}
        placeholder="Search connections…"
        value={search}
        onValueChange={setSearch}
        onClear={() => setSearch('')}
      />

      <Select
        size={size}
        label="Authentication"
        placeholder="Choose a method"
        options={AUTH}
        value={auth}
        onValueChange={setAuth}
      />

      <Autocomplete<Option>
        size={size}
        label="City"
        placeholder="Pick a city"
        options={CITIES}
        getOptionLabel={label}
        value={city}
        onChange={(_e, next) => setCity(next as Option | null)}
      />

      <Autocomplete<Option, true>
        size={size}
        label="Cities"
        placeholder="Pick cities"
        isMultipleSelect
        options={CITIES}
        getOptionLabel={label}
        value={cities}
        onChange={(_e, next) => setCities((next as Option[]) ?? [])}
      />

      <TextArea
        size={size}
        label="Notes"
        placeholder="Anything else"
        defaultValue={
          filled ? 'Read-only replica.\nNightly backups at 02:00.' : undefined
        }
      />

      <div className="flex items-end gap-2">
        <InputGroup size={size} label="Invite" inputId={id('invite')}>
          <InputGroupInput
            type="email"
            placeholder="colleague@example.com"
            defaultValue={filled ? 'ivan@example.com' : undefined}
          />
        </InputGroup>
        <Button size={size} variant="secondary">
          Send
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size={size} variant="secondary">
          Cancel
        </Button>
        <Button size={size} variant="primary">
          Save
        </Button>
      </div>
    </div>
  );
}

function Pair({ size }: { size: Size }) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-12">
        <div className="flex flex-col gap-3">
          <span className="text-ink-secondary text-xs">{size} · empty</span>
          <Fields size={size} filled={false} />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-ink-secondary text-xs">{size} · filled</span>
          <Fields size={size} filled />
        </div>
      </div>
    </TooltipProvider>
  );
}

type Args = { size: Size };

const meta: Meta<Args> = {
  title: 'Review/Form fields',
  parameters: { layout: 'padded' },
  args: { size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
};

export default meta;
type Story = StoryObj<Args>;

/** Empty and filled side by side; the size is a control. */
export const Form: Story = {
  render: ({ size }) => <Pair size={size} />,
};
