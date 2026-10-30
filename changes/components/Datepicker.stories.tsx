import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChangeCase, ChangePage, Code } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Datepicker',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = {
  name: 'Datepicker',
  render: () => (
    <ChangePage
      intro="Open, and the same in upstream — the change log keeps it under Open against the kit rather than in its index."
      title="Datepicker"
    >
      <ChangeCase
        after={
          <p className="max-w-[60ch] text-ink-body text-sm leading-5">
            Nothing to render: the three states this was filed against —{' '}
            <em>hover</em>, <em>today</em>, <em>disabled</em> — all exist, in{' '}
            <Code>Calendar.tsx</Code>'s <Code>classNames</Code> map rather than
            in <Code>CalendarDayButton.tsx</Code> where the report looked. What
            survives is one detail: the focus ring is the only one in the
            package that is not the shared recipe.
          </p>
        }
        afterNote="mostly retracted — see the catalog's own Datepicker stories"
        files={['src/components/Datepicker/Calendar.tsx']}
        footnote={
          <>
            Kept as a section because a retraction is worth as much as the
            finding was: the next person reading{' '}
            <Code>CalendarDayButton.tsx</Code> alone will reach the same wrong
            conclusion. The surviving item is real — <Code>--shadow-focus</Code>
            , 2px plus a 2px gap, is what <Code>Button</Code>,{' '}
            <Code>IconButton</Code>, <Code>Switch</Code>,{' '}
            <Code>SegmentedControl</Code> and <Code>StepSlider</Code> all use,
            and the calendar day is the one control that does not.
          </>
        }
        n={29}
        state="proposed"
        title="One bespoke focus ring, not three missing states"
        why="Filed after reading one file, and three quarters of it was wrong. The quarter that is not: a calendar day focuses differently from every other control in the package."
      />
    </ChangePage>
  ),
};
