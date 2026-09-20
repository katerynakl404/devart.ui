import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { fn } from 'storybook/test';
import { Calendar } from './Calendar';
import { DateRangePicker } from './DateRangePicker';
import { SingleDatePicker } from './SingleDatePicker';

// SingleDatePicker is the primary story component: a full picker with calendar,
// month/year controls and a confirm button, driven by controlled `selected`.
const meta = {
  title: 'Components/Datepicker',
  component: SingleDatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    confirmLabel: 'Set date',
    onSelect: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    selected: { control: false },
    startMonth: { control: false },
    endMonth: { control: false },
    className: { control: false },
    onSelect: { control: false, table: { disable: true } },
    onConfirm: { control: false, table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SingleDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <SingleDatePicker
        {...args}
        selected={date}
        onSelect={(next) => {
          setDate(next);
          args.onSelect?.(next);
        }}
      />
    );
  },
};

// DateRangePicker renders side-by-side months and selects a { from, to } range.
export const Range: StoryObj<typeof DateRangePicker> = {
  render: () => {
    const today = new Date();
    const [range, setRange] = useState<DateRange | undefined>({
      from: today,
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    });
    return (
      <div className="w-[36rem] max-w-full">
        <DateRangePicker
          selected={range}
          confirmLabel="Set range"
          onSelect={setRange}
          onConfirm={fn()}
        />
      </div>
    );
  },
};

// The underlying Calendar (react-day-picker) in single mode with disabled dates.
// `mode` is fixed here because react-day-picker types `selected`/`onSelect`
// against the mode discriminant, so a single control cannot switch it safely;
// `captionLayout` and `showOutsideDays` are the live controls.
export const CalendarSingle: StoryObj<typeof Calendar> = {
  argTypes: {
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
    },
    showOutsideDays: { control: 'boolean' },
  },
  args: {
    captionLayout: 'dropdown',
    showOutsideDays: true,
  },
  render: (args) => {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border border-stroke bg-surface-card">
        <Calendar
          {...args}
          mode="single"
          selected={selected}
          onSelect={setSelected}
          // Disable weekends to demo the `disabled` matcher.
          disabled={(day: Date) => day.getDay() === 0 || day.getDay() === 6}
        />
      </div>
    );
  },
};

/**
 * The bare `Calendar` in range mode — the only place the component's own
 * `range_start` / `range_middle` / `range_end` recipes are exercised
 * (`DateRangePicker` replaces all three). Shows the endpoint caps rounding on
 * their outer side only, a flush in-range bar, `today`, and disabled days.
 */
export const CalendarRange: StoryObj<typeof Calendar> = {
  render: () => {
    const today = new Date();
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(today.getFullYear(), today.getMonth(), 8),
      to: new Date(today.getFullYear(), today.getMonth(), 17),
    });
    return (
      <div className="rounded-md border border-stroke bg-surface-card">
        <Calendar
          mode="range"
          selected={range}
          defaultMonth={new Date(today.getFullYear(), today.getMonth())}
          onSelect={setRange}
          // Disable weekends to demo the `disabled` matcher alongside the range.
          disabled={(day: Date) => day.getDay() === 0 || day.getDay() === 6}
        />
      </div>
    );
  },
};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [['Single', Single]];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render
              ? story.render({ ...args, ...story.args } as never, ctx)
              : null}
          </section>
        ))}
      </div>
    );
  },
} as Story;
