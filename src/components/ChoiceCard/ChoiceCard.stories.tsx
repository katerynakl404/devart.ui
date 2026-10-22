import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart3, Briefcase, Code2, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { expect } from 'storybook/test';
import { TextArea } from '../TextArea';
import { ChoiceCard, ChoiceGroup } from './index';

/**
 * A card-sized answer to a question: a title, an optional description, badge
 * and leading icon, and the chosen state — the brand border over a 5% brand
 * wash.
 *
 * `ChoiceGroup type="single"` is a radiogroup (the card itself shows the
 * choice; the arrow keys move and choose). `type="multiple"` is a group of
 * checkbox cards. A `ChoiceCard` on its own is a toggle button, and with
 * `children` it reveals them inside itself while chosen.
 */
const meta = {
  title: 'Compositions/ChoiceCard',
  component: ChoiceCard,
  tags: ['autodocs'],
  args: { title: 'Sales', description: 'Pipeline, deals and forecasts' },
  argTypes: {
    indicator: {
      control: 'inline-radio',
      options: ['auto', 'none', 'radio', 'checkbox'],
    },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChoiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROLES = [
  { value: 'sales', title: 'Sales', description: 'Pipeline, deals, forecasts' },
  {
    value: 'marketing',
    title: 'Marketing',
    description: 'Campaigns and leads',
  },
  { value: 'finance', title: 'Finance', description: 'Revenue and costs' },
  { value: 'eng', title: 'Engineering', description: 'Delivery and quality' },
];

/** One answer. Click, or Tab in and use the arrow keys. */
export const Single: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    return (
      <div className="w-96">
        <ChoiceGroup
          aria-label="Your role"
          value={value}
          onValueChange={setValue}
        >
          {ROLES.map((role) => (
            <ChoiceCard key={role.value} {...role} />
          ))}
        </ChoiceGroup>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const finance = canvas.getByRole('radio', { name: /Finance/ });
    await userEvent.click(finance);
    await expect(finance).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      canvas.getByRole('radio', { name: /Engineering/ })
    ).toHaveAttribute('aria-checked', 'true');
  },
};

/** Several answers: a checkbox on every card. */
export const Multiple: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(['revenue']);
    return (
      <div className="w-96">
        <ChoiceGroup
          type="multiple"
          aria-label="Your goals"
          value={value}
          onValueChange={setValue}
        >
          <ChoiceCard value="revenue" title="Track revenue" />
          <ChoiceCard value="forecast" title="Forecast the quarter" />
          <ChoiceCard value="churn" title="Find churn early" badge="Popular" />
        </ChoiceGroup>
      </div>
    );
  },
};

/**
 * `onPick` — a click, Enter or Space is a pick and the question moves on; an
 * arrow key only moves the choice (`onValueChange`).
 */
export const PickMovesOn: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    const [picked, setPicked] = useState<string | null>(null);
    return (
      <div className="flex w-96 flex-col gap-3">
        <ChoiceGroup
          aria-label="Your role"
          value={value}
          onValueChange={setValue}
          onPick={setPicked}
        >
          {ROLES.map((role) => (
            <ChoiceCard key={role.value} {...role} />
          ))}
        </ChoiceGroup>
        <p className="text-ink-secondary text-sm">
          {picked
            ? `Picked ${picked} — on to the next question`
            : 'Not picked yet'}
        </p>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /Sales/ }));
    await expect(canvas.getByText(/Picked sales/)).toBeVisible();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByText(/Picked sales/)).toBeVisible();
  },
};

/** `columns={2}` — side by side from 640px up. */
export const TwoColumns: Story = {
  render: function Render() {
    const [value, setValue] = useState('finance');
    return (
      <div className="max-w-2xl">
        <ChoiceGroup
          aria-label="Your role"
          columns={2}
          value={value}
          onValueChange={setValue}
        >
          {ROLES.map((role) => (
            <ChoiceCard key={role.value} {...role} />
          ))}
        </ChoiceGroup>
      </div>
    );
  },
};

/**
 * A leading icon leads the row, top-aligned: the padding stays and the
 * indicator stays on the title line.
 */
export const WithIcons: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(['sales']);
    const icons = [Briefcase, Megaphone, BarChart3, Code2];
    return (
      <div className="flex w-96 flex-col gap-6">
        <ChoiceGroup
          type="multiple"
          aria-label="Teams"
          value={value}
          onValueChange={setValue}
        >
          {ROLES.map((role, i) => {
            const Icon = icons[i] ?? Briefcase;
            return <ChoiceCard key={role.value} {...role} icon={<Icon />} />;
          })}
        </ChoiceGroup>
        <ChoiceGroup aria-label="Team" value="marketing">
          {ROLES.slice(0, 2).map((role, i) => {
            const Icon = icons[i] ?? Briefcase;
            return <ChoiceCard key={role.value} {...role} icon={<Icon />} />;
          })}
        </ChoiceGroup>
      </div>
    );
  },
};

/** `indicator="radio"` draws the RadioButton mark — an explicit opt-in. */
export const RadioIndicator: Story = {
  render: function Render() {
    const [value, setValue] = useState('monthly');
    return (
      <div className="w-96">
        <ChoiceGroup
          aria-label="Billing"
          value={value}
          onValueChange={setValue}
        >
          <ChoiceCard value="monthly" title="Monthly" indicator="radio" />
          <ChoiceCard
            value="yearly"
            title="Yearly"
            badge="Save 20%"
            description="Billed once a year"
            indicator="radio"
          />
        </ChoiceGroup>
      </div>
    );
  },
};

/** A disabled card, and a disabled group. */
export const Disabled: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <ChoiceGroup aria-label="Role" value="sales">
        <ChoiceCard value="sales" title="Sales" />
        <ChoiceCard value="ops" title="Operations" disabled />
      </ChoiceGroup>
      <ChoiceGroup type="multiple" aria-label="Goals" value={['a']} disabled>
        <ChoiceCard value="a" title="Track revenue" />
        <ChoiceCard value="b" title="Forecast" />
      </ChoiceGroup>
    </div>
  ),
};

/**
 * Standalone: a toggle button with `aria-pressed` — or, with
 * `indicator="checkbox"`, a label around a Checkbox.
 */
export const Standalone: Story = {
  render: function Render() {
    const [pick, setPick] = useState(false);
    const [tick, setTick] = useState(true);
    return (
      <div className="flex w-96 flex-col gap-2">
        <ChoiceCard
          title="Yes, connect my CRM"
          description="Pressing the card is the answer"
          selected={pick}
          onSelect={setPick}
        />
        <ChoiceCard
          title="Email me a summary"
          indicator="checkbox"
          selected={tick}
          onSelect={setTick}
        />
      </div>
    );
  },
};

/** `children` are revealed inside the card while it is chosen — "Other". */
export const Expandable: Story = {
  render: function Render() {
    const [value, setValue] = useState('other');
    return (
      <div className="w-96">
        <ChoiceGroup
          aria-label="Your role"
          value={value}
          onValueChange={setValue}
        >
          <ChoiceCard value="sales" title="Sales" />
          <ChoiceCard value="other" title="Other">
            <TextArea
              rows={2}
              placeholder="Write your answer…"
              aria-label="Your answer"
            />
          </ChoiceCard>
        </ChoiceGroup>
      </div>
    );
  },
};

/** Every state on the dark theme. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="flex w-96 flex-col gap-6 rounded-lg bg-surface-page p-4">
      <ChoiceGroup aria-label="Role" value="finance">
        {ROLES.slice(1, 3).map((role) => (
          <ChoiceCard key={role.value} {...role} icon={<BarChart3 />} />
        ))}
        <ChoiceCard value="ops" title="Operations" disabled />
      </ChoiceGroup>
      <ChoiceGroup type="multiple" aria-label="Goals" value={['a']}>
        <ChoiceCard value="a" title="Track revenue" badge="Popular" />
        <ChoiceCard value="b" title="Forecast" />
      </ChoiceGroup>
    </div>
  ),
};
