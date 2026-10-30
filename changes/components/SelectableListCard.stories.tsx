import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenuItem } from '../../src/components/DropdownMenu';
import { SelectableListCard } from '../../src/components/SelectableListCard';
import { TooltipProvider } from '../../src/components/Tooltip';
import { Typography } from '../../src/components/Typography';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { SelectableListCard as UpstreamSelectableListCard } from '../upstream/SelectableListCard';

const meta = {
  title: 'Proposed changes/Components/SelectableListCard',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CHATS = ['Revenue by region', 'Churn last quarter'];

function Name({ children }: { children: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <FileText className="size-4 shrink-0 text-brand-tertiary" />
      <span className="truncate">{children}</span>
    </span>
  );
}

/**
 * Two rows and a card, and a line saying what the last Enter or click opened —
 * so a key that does nothing shows as nothing.
 */
function List({ old }: { old?: boolean }) {
  const [opened, setOpened] = useState<string | null>(null);
  const Item = old ? UpstreamSelectableListCard : SelectableListCard;
  return (
    <TooltipProvider>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="group/list flex flex-col gap-2">
          {CHATS.map((chat) =>
            old ? (
              <UpstreamSelectableListCard
                cardContent={<Name>{chat}</Name>}
                checkboxAriaLabel={`Select ${chat}`}
                isSelected={false}
                key={chat}
                layout="row"
                onCardClick={() => setOpened(chat)}
                onCheckboxToggle={() => undefined}
              />
            ) : (
              <SelectableListCard
                cardContent={<Name>{chat}</Name>}
                checkboxAriaLabel={`Select ${chat}`}
                isSelected={false}
                key={chat}
                layout="row"
                menu={
                  <>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </>
                }
                menuLabel={`More actions for ${chat}`}
                onCardClick={() => setOpened(chat)}
                onCheckboxToggle={() => undefined}
              />
            )
          )}
        </div>
        <div className="group/list ps-6">
          <Item
            cardContent={
              <Typography textStyle="body14">Weekly summary</Typography>
            }
            checkboxAriaLabel="Select Weekly summary"
            isSelected={false}
            onCardClick={() => setOpened('Weekly summary')}
            onCheckboxToggle={() => undefined}
          />
        </div>
        <span className="text-ink-secondary text-xs">
          Opened: {opened ?? 'nothing yet'}
        </span>
      </div>
    </TooltipProvider>
  );
}

export const Page: Story = {
  name: 'SelectableListCard',
  render: () => (
    <ChangePage group="SelectableListCard" title="SelectableListCard">
      <ChangeCase
        after={
          <TryIt action="Press Tab into the list, then Enter; hover a row for its ⋮">
            <List />
          </TryIt>
        }
        afterNote="a tab stop with the system ring · Enter and Space open it · menu"
        before={
          <TryIt action="Press Tab — the items are skipped; only a click opens one">
            <List old />
          </TryIt>
        }
        beforeNote="a click and nothing else"
        beforeSource={
          <>
            the developers' own component, vendored unchanged from their 1.4.0
            into <Code>changes/upstream/SelectableListCard.tsx</Code>. The{' '}
            <Code>Card</Code> and <Code>Checkbox</Code> under it are the live
            ones in both halves, so only the item's own markup differs.
          </>
        }
        files={['src/components/SelectableListCard/index.tsx']}
        footnote={
          <>
            Enter and Space open the item only while the item itself has focus —
            a key from a control inside it is that control's. The item also
            carries <Code>aria-selected</Code>, which nothing here can show: it
            means something to assistive tech only under a list or grid role,
            which the caller gives. The ⋮ is <Code>RowMenuButton</Code> (§137),
            held to <Code>-my-0.5</Code> so a row with a menu stays 44px.
          </>
        }
        n={138}
        title="Keyboard, aria-selected, menu"
        why="The item opened on a click and nothing else — not a tab stop, no key, no focus ring on the card layout — and a row that needed a menu had to build its own ⋮."
      />
    </ChangePage>
  ),
};
