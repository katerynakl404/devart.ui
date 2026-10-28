import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart3, Briefcase, Code2, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { expect } from 'storybook/test';
import { TextArea } from '../TextArea';
import {
  ChoiceCard,
  type ChoiceCardProps,
  ChoiceGroup,
  type ChoiceGroupProps,
} from './index';

/**
 * A card-sized answer to a question: a title, an optional description, badge
 * and leading icon, and the chosen state — the brand border over a 5% brand
 * wash.
 *
 * `ChoiceGroup type="single"` is a radiogroup (the card itself shows the
 * choice; the arrow keys move and choose). `type="multiple"` is a group of
 * checkbox cards. A `ChoiceCard` on its own is a toggle button, and with
 * `children` it reveals them inside itself while chosen.
 *
 * `ChoiceGroup` has no column prop. The layout comes from `className`, merged
 * with `cn()` over the base `grid grid-cols-1 gap-2`, so a consumer class
 * replaces it: `sm:grid-cols-3 sm:gap-3` for three columns from 640px up,
 * `grid-cols-2` for two at every width.
 *
 * `ChoiceCard` props (the sub-component tab below lists their types only):
 * - `value` — the answer's value; required inside a group.
 * - `title`, `description` — the heading and a quieter line under it.
 * - `badge` — a short tag after the title, drawn as a small primary Badge.
 * - `icon` — a glyph on a 36px disc that leads the row.
 * - `indicator` — the mark on the right. `auto` is a checkbox in a multiple
 *   group and nothing elsewhere; `radio` and `checkbox` are explicit opt-ins.
 * - `disabled` — the card alone; `ChoiceGroup disabled` takes every card.
 * - `selected`, `onSelect`, `name` — standalone only: the chosen state, its
 *   change and the checkbox's form name.
 * - `children` — content revealed inside the card while it is chosen; the head
 *   becomes the button, with `aria-expanded`.
 */
const meta = {
  title: 'Components/ChoiceCard',
  component: ChoiceGroup,
  subcomponents: { ChoiceCard },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: false,
      description:
        'One answer (`single`, a radiogroup) or several (`multiple`, a group of checkbox cards).',
      table: {
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: 'single' },
      },
    },
    value: {
      control: false,
      description:
        'The chosen value: a `string` in a single group, a `string[]` in a multiple one. Controlled.',
      table: { type: { summary: 'string | string[]' } },
    },
    onValueChange: {
      control: false,
      description:
        'Every change of the choice, including an arrow key walking a single group. A multiple group receives the next `string[]`.',
      table: {
        type: {
          summary: '(value: string) => void | (value: string[]) => void',
        },
      },
    },
    onPick: {
      control: false,
      description:
        'Single only. A deliberate pick — a click, Enter or Space — and never an arrow key: the moment a one-answer question is answered and the flow can move on.',
      table: { type: { summary: '(value: string) => void' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every card in the group.',
      table: { defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'Form name. It reaches the checkboxes of a multiple group.',
    },
    'aria-label': {
      control: 'text',
      description:
        'The accessible name of the group. Give this or `aria-labelledby`.',
    },
    'aria-labelledby': {
      control: 'text',
      description: 'The id of the element that names the group.',
    },
    className: {
      control: 'text',
      description:
        'Merged after the base `grid grid-cols-1 gap-2` with `cn()`, so a consumer class replaces it: `sm:grid-cols-3 sm:gap-3` for columns from 640px up, `grid-cols-2` for always two.',
      table: { defaultValue: { summary: 'grid grid-cols-1 gap-2' } },
    },
    children: {
      control: false,
      description: 'The `ChoiceCard`s of the group.',
    },
    ref: { control: false, table: { disable: true } },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChoiceGroup>;

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

const ICONS = [Briefcase, Megaphone, BarChart3, Code2];

const groupProps = ({
  disabled,
  name,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ChoiceGroupProps) => ({
  disabled,
  name,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
});

const firstCard = (root: HTMLElement) => {
  const card = root.querySelector<HTMLElement>('[data-slot="choice-card"]');
  if (!card) throw new Error('ChoiceCard did not render');
  return card;
};

/** One answer. Click, or Tab in and use the arrow keys. */
export const Single: Story = {
  args: { 'aria-label': 'Your role' },
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div className="w-96">
        <ChoiceGroup
          {...groupProps(args)}
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
  args: { 'aria-label': 'Your goals' },
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['revenue']);
    return (
      <div className="w-96">
        <ChoiceGroup
          {...groupProps(args)}
          type="multiple"
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
  args: { 'aria-label': 'Your role' },
  render: function Render(args) {
    const [value, setValue] = useState('');
    const [picked, setPicked] = useState<string | null>(null);
    return (
      <div className="flex w-96 flex-col gap-3">
        <ChoiceGroup
          {...groupProps(args)}
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

/**
 * `ChoiceGroup` has no column prop: the layout comes from `className`, merged
 * over the base `grid grid-cols-1 gap-2`. `sm:grid-cols-2 sm:gap-3` puts the
 * cards side by side from 640px up; `grid-cols-2` would hold two columns at
 * every width.
 */
export const Columns: Story = {
  args: {
    'aria-label': 'Your role',
    className: 'sm:grid-cols-2 sm:gap-3',
  },
  render: function Render(args) {
    const [value, setValue] = useState('finance');
    return (
      <div className="max-w-2xl">
        <ChoiceGroup
          {...groupProps(args)}
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
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = useState<string[]>(['sales']);
    return (
      <div className="flex w-96 flex-col gap-6">
        <ChoiceGroup
          type="multiple"
          aria-label="Teams"
          value={value}
          onValueChange={setValue}
        >
          {ROLES.map((role, i) => {
            const Icon = ICONS[i] ?? Briefcase;
            return <ChoiceCard key={role.value} {...role} icon={<Icon />} />;
          })}
        </ChoiceGroup>
        <ChoiceGroup aria-label="Team" value="marketing">
          {ROLES.slice(0, 2).map((role, i) => {
            const Icon = ICONS[i] ?? Briefcase;
            return <ChoiceCard key={role.value} {...role} icon={<Icon />} />;
          })}
        </ChoiceGroup>
      </div>
    );
  },
};

/** `indicator="radio"` draws the RadioButton mark — an explicit opt-in. */
export const RadioIndicator: Story = {
  args: { 'aria-label': 'Billing' },
  render: function Render(args) {
    const [value, setValue] = useState('monthly');
    return (
      <div className="w-96">
        <ChoiceGroup
          {...groupProps(args)}
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
  parameters: { controls: { disable: true } },
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

function StandaloneCard({
  onSelectedChange,
  ...args
}: ChoiceCardProps & { onSelectedChange: (selected: boolean) => void }) {
  const [selected, setSelected] = useState(args.selected ?? false);
  useEffect(() => setSelected(args.selected ?? false), [args.selected]);

  return (
    <div className="w-96">
      <ChoiceCard
        {...args}
        selected={selected}
        onSelect={(next) => {
          setSelected(next);
          onSelectedChange(next);
        }}
      />
    </div>
  );
}

/**
 * Standalone: a toggle button with `aria-pressed` — or, with
 * `indicator="checkbox"`, a label around a Checkbox. The `selected` control and
 * a click stay in step: a click writes the new state back to the arg.
 */
export const Standalone: StoryObj<ChoiceCardProps> = {
  args: {
    title: 'Yes, connect my CRM',
    description: 'Pressing the card is the answer',
    badge: '',
    indicator: 'none',
    disabled: false,
    selected: false,
  },
  argTypes: {
    value: {
      control: false,
      description:
        "The answer's value. Required inside a `ChoiceGroup`; a standalone card has none.",
      table: { type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'The heading of the card.',
      table: { type: { summary: 'ReactNode' } },
    },
    description: {
      control: 'text',
      description: 'A quieter line under the title.',
      table: { type: { summary: 'ReactNode' } },
    },
    badge: {
      control: 'text',
      description:
        'A short tag after the title ("Recommended"), drawn as a small primary Badge.',
      table: { type: { summary: 'ReactNode' } },
    },
    icon: {
      control: false,
      description:
        'A leading glyph on a 36px disc. It leads the row, top-aligned; the indicator stays on the title line.',
      table: { type: { summary: 'ReactNode' } },
    },
    indicator: {
      control: 'inline-radio',
      options: ['none', 'radio', 'checkbox'],
      description:
        'The mark on the right. `auto` is a checkbox in a multiple group and nothing elsewhere; `radio` and `checkbox` are explicit opt-ins. `checkbox` makes the card a label around a Checkbox.',
      table: {
        type: { summary: "'auto' | 'none' | 'radio' | 'checkbox'" },
        defaultValue: { summary: 'auto' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the card.',
      table: { defaultValue: { summary: 'false' } },
    },
    selected: {
      control: 'boolean',
      description: 'Standalone only: the chosen state.',
      table: { defaultValue: { summary: 'false' } },
    },
    onSelect: {
      control: false,
      description: 'Standalone only: called with the next chosen state.',
      table: { type: { summary: '(selected: boolean) => void' } },
    },
    name: {
      control: 'text',
      description: "Standalone checkbox card: the checkbox's form name.",
    },
    children: {
      control: false,
      description:
        'Content revealed inside the card while it is chosen (an "Other" answer\'s field). The card\'s head becomes the button, with `aria-expanded`.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Merged after the card classes with `cn()`.',
    },
  },
  parameters: {
    controls: {
      include: [
        'value',
        'title',
        'description',
        'badge',
        'icon',
        'indicator',
        'disabled',
        'selected',
        'onSelect',
        'name',
        'children',
        'className',
      ],
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ChoiceCardProps>();
    return (
      <StandaloneCard
        {...args}
        onSelectedChange={(selected) => updateArgs({ selected })}
      />
    );
  },
  play: async ({ args, canvasElement, userEvent }) => {
    const card = firstCard(canvasElement);
    await expect(card).toHaveAttribute(
      'data-state',
      args.selected ? 'checked' : 'unchecked'
    );
    await userEvent.click(card);
    await expect(card).toHaveAttribute(
      'data-state',
      args.selected ? 'unchecked' : 'checked'
    );
  },
};

/** `children` are revealed inside the card while it is chosen — "Other". */
export const Expandable: Story = {
  args: { 'aria-label': 'Your role' },
  render: function Render(args) {
    const [value, setValue] = useState('other');
    return (
      <div className="w-96">
        <ChoiceGroup
          {...groupProps(args)}
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
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByLabelText('Your answer')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: /Sales/ }));
    await expect(canvas.queryByLabelText('Your answer')).toBeNull();
    await userEvent.click(canvas.getByRole('radio', { name: /Other/ }));
    await expect(canvas.getByLabelText('Your answer')).toBeVisible();
  },
};

/** Every state on the dark theme. */
export const DarkTheme: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="dark flex w-96 flex-col gap-6 rounded-lg bg-surface-page p-4">
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
      <ChoiceCard
        title="Yes, connect my CRM"
        description="Pressing the card is the answer"
        selected
      />
      <ChoiceGroup aria-label="Reason" value="other">
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
  ),
};
