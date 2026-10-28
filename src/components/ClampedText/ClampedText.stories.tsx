import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ClampedText } from './index';

const LONG =
  'The warehouse the finance team reports from: the general ledger, accounts payable and receivable, and the monthly close. Read nightly from the ERP; the reporting views are rebuilt at 02:00 UTC. Ask the data platform team before adding a schema — the AI client reads only what is included here, and every inclusion is reviewed against the data policy.';

const meta = {
  title: 'Components/ClampedText',
  component: ClampedText,
  tags: ['autodocs'],
  args: { text: LONG, lines: 3 },
  argTypes: {
    lines: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A text cut to a number of lines, with See more when there is more, and only then — measured on every resize, not guessed from the length. In place, See more opens the text and See less folds it; with `onMore` it hands the whole text to the caller to show elsewhere (a dialog from a hover panel). A press on See more stops there.',
      },
    },
  },
} satisfies Meta<typeof ClampedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <ClampedText {...args} />
    </div>
  ),
};

/** Short enough to fit: no See more. */
export const FitsWhole: Story = {
  args: { text: 'Ad-hoc analytics and reporting for the data team.' },
  render: (args) => (
    <div className="w-80">
      <ClampedText {...args} />
    </div>
  ),
};

/** Handed over: See more asks the caller to show the whole text elsewhere. */
export const HandedOver: Story = {
  render: (args) => {
    const [asked, setAsked] = useState(0);
    return (
      <div className="flex w-80 flex-col gap-2">
        <ClampedText
          {...args}
          lines={5}
          onMore={() => setAsked((n) => n + 1)}
        />
        <span className="text-ink-secondary text-xs">
          onMore called {asked}×
        </span>
      </div>
    );
  },
};
