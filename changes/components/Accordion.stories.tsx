import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../src/components/Accordion';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Accordion',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = [
  { value: 'connection', title: 'Connection', body: 'Host, port, database.' },
  {
    value: 'ssh',
    title: 'SSH tunnel',
    body: 'An empty group connects directly.',
  },
  { value: 'advanced', title: 'Advanced', body: 'Timeouts and pool size.' },
];

/** One surface per section — the card is the item itself. */
function Sections({ standalone }: { standalone?: boolean }) {
  return (
    <Accordion className="gap-3" defaultValue={['connection']} type="multiple">
      {SECTIONS.map((section) => (
        <AccordionItem
          className="rounded-lg border border-stroke bg-surface-card"
          key={section.value}
          value={section.value}
          variant={standalone ? 'standalone' : undefined}
        >
          <AccordionTrigger>{section.title}</AccordionTrigger>
          <AccordionContent className="px-3">
            <Typography textColor="secondary" textStyle="body12">
              {section.body}
            </Typography>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/**
 * A settings form as the connection page draws it: a section with a `title16`
 * heading, then a section whose heading is the accordion's trigger.
 */
function Form({ size }: { size?: 'md' }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Card className="gap-1 px-6 py-4" fullWidth>
        <Typography element="h3" textColor="primary" textStyle="title16">
          General
        </Typography>
        <Typography textColor="secondary" textStyle="body12">
          Name, host and database.
        </Typography>
      </Card>
      <Accordion type="multiple">
        <Card className="p-0" fullWidth>
          <AccordionItem value="advanced" variant="standalone">
            <AccordionTrigger className="px-6 py-4" size={size}>
              Advanced
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Typography textColor="secondary" textStyle="body12">
                Timeouts and pool size.
              </Typography>
            </AccordionContent>
          </AccordionItem>
        </Card>
      </Accordion>
    </div>
  );
}

export const Page: Story = {
  name: 'Accordion',
  render: () => (
    <ChangePage group="Accordion" title="Accordion">
      <ChangeCase
        after={<Sections standalone />}
        afterNote="variant='standalone' — no rule, every card whole"
        before={<Sections />}
        beforeNote="border-b last:border-b-0 under the card's border"
        beforeSource={
          <>
            the live item without the prop — <Code>variant</Code> defaults to{' '}
            <Code>divided</Code>, which is the published item exactly. The card
            classes on the item are the same in both halves.
          </>
        }
        files={['src/components/Accordion/AccordionItem.tsx']}
        footnote={
          <>
            Inside one shared surface the rule is right, and stays the default.
            Made into a card, the item's divider merges into the card's own
            border — and <Code>last:border-b-0</Code> then takes the bottom edge
            off the last card. Wrapped in a <Code>Card</Code> of its own
            instead, the item is its card's last child, so <Code>last:</Code>{' '}
            hid the rule there already; the variant says which shape the item is
            rather than leaning on that.
          </>
        }
        n={49}
        title="AccordionItem — an item that is its own surface"
        why="The item had one layout, a rule under every item but the last — right for items stacked in one surface, wrong for one card per section, where the page had to override the component to undo it."
      />

      <ChangeCase
        after={<Form size="md" />}
        afterNote="size='md' — text-base, the size of title16"
        before={<Form />}
        beforeNote="text-sm — a step under the section beside it"
        beforeSource={
          <>
            the live trigger without the prop — <Code>size</Code> defaults to{' '}
            <Code>sm</Code>, the published trigger's <Code>text-sm</Code>.
          </>
        }
        files={['src/components/Accordion/AccordionTrigger.tsx']}
        footnote={
          <>
            <Code>sm</Code> stays the default — a row in a list of foldables.{' '}
            <Code>md</Code> is for an accordion that IS the page's structure. It
            matches <Code>title16</Code>'s size, not its weight: the trigger
            stays <Code>font-medium</Code>.
          </>
        }
        n={69}
        state="draft"
        title="AccordionTrigger — size"
        why="One size, text-sm, so where each settings group is a card with the trigger as its heading, the section's name read a step smaller than the title16 headings of the sections around it."
      />
    </ChangePage>
  ),
};
