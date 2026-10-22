import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FileText,
  Pencil,
  Pin,
  PinOff,
  Square,
  SquareCheck,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { expect, fn, screen, waitFor } from 'storybook/test';
import { Button } from '../Button';
import { DropdownMenuItem, DropdownMenuSeparator } from '../DropdownMenu';
import { InlineRename } from '../InlineRename';
import { MetaRow } from '../MetaRow';
import { PinToggle } from '../PinToggle';
import { TooltipProvider } from '../Tooltip';
import { Typography } from '../Typography';
import { SelectableListCard } from './index';

/**
 * `SelectableListCard` is a list item that reveals a checkbox once the list
 * enters selection mode.
 *
 * Visibility is a CSS contract, not a prop: an ancestor carrying `group/list`
 * stamps `data-has-selection` while anything is selected, and every card
 * answers it. `AsyncList` supplies that ancestor. Toggle the **Has selection**
 * control below to see the difference — with it off, the `card` layout reveals
 * its checkbox on hover from `md` up and not at all below it.
 *
 * The item is a tab stop that Enter and Space open, and it carries its
 * selection as `aria-selected`. The `row` layout takes a `menu`: a ⋮
 * (`RowMenuButton`) at its right edge.
 */
const meta = {
  title: 'Compositions/SelectableListCard',
  component: SelectableListCard,
  tags: ['autodocs'],
  args: {
    isSelected: false,
    checkboxAriaLabel: 'Select report.pdf',
    onCheckboxToggle: fn(),
    onCardClick: fn(),
    cardContent: (
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="size-4 shrink-0 text-brand-tertiary" />
          <Typography variant="span" textColor="body" className="truncate">
            report.pdf
          </Typography>
        </div>
        <Typography
          variant="span"
          textColor="secondary"
          className="shrink-0 text-xs"
        >
          2 days ago
        </Typography>
      </div>
    ),
  },
  argTypes: {
    layout: { control: 'select', options: ['card', 'row'] },
    cardContent: { control: false },
    rightSlot: { control: false },
    onCheckboxToggle: { control: false },
    onCardClick: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SelectableListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Renders the card inside a list group, so the contract is observable. */
const InList = ({
  hasSelection,
  children,
}: {
  hasSelection: boolean;
  children: React.ReactNode;
}) => (
  <div
    className="group/list flex flex-1 flex-col gap-2 ps-8"
    data-has-selection={hasSelection ? 'true' : undefined}
  >
    {children}
  </div>
);

export const Row: Story = {
  args: {
    layout: 'row',
    cardClassName: 'justify-between',
  },
  /**
   * Until the list has a selection the row's checkbox is not merely faded but
   * out of the layout entirely, so a click anywhere on the row is a row click.
   */
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('report.pdf'));
    await expect(args.onCardClick).toHaveBeenCalledOnce();
    await expect(args.onCheckboxToggle).not.toHaveBeenCalled();

    await expect(
      canvas.getByRole('checkbox', { name: 'Select report.pdf', hidden: true })
    ).not.toBeVisible();
  },
  render: (args) => (
    <InList hasSelection={false}>
      <SelectableListCard {...args} />
    </InList>
  ),
};

export const RowSelected: Story = {
  args: {
    layout: 'row',
    isSelected: true,
    cardClassName: 'justify-between',
  },
  /** The checkbox swallows its click, so toggling it never counts as a row click. */
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('report.pdf'));
    await expect(args.onCardClick).toHaveBeenCalledOnce();

    const checkbox = canvas.getByRole('checkbox', {
      name: 'Select report.pdf',
    });
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    await expect(args.onCheckboxToggle).toHaveBeenCalledOnce();
    await expect(args.onCardClick).toHaveBeenCalledOnce();
  },
  render: (args) => (
    <InList hasSelection>
      <SelectableListCard {...args} />
    </InList>
  ),
};

export const Card: Story = {
  args: {
    layout: 'card',
    contentClassName: 'w-full items-center',
  },
  render: (args) => (
    <InList hasSelection={false}>
      <SelectableListCard {...args} />
    </InList>
  ),
};

/**
 * Without a selection the `card` layout's checkbox is faded *and* inert — it
 * takes neither clicks nor focus, so it cannot be tabbed into while invisible.
 */
export const CardIdle: Story = {
  args: {
    layout: 'card',
    contentClassName: 'w-full items-center',
  },
  play: async ({ canvas }) => {
    const checkboxes = canvas.getAllByRole('checkbox', {
      name: 'Select report.pdf',
      hidden: true,
    });
    await expect(checkboxes).toHaveLength(2);
    for (const checkbox of checkboxes) {
      await expect(checkbox).not.toBeVisible();
    }
  },
  render: (args) => (
    <InList hasSelection={false}>
      <SelectableListCard {...args} />
      <SelectableListCard {...args} checkboxAriaLabel="Select notes.md" />
    </InList>
  ),
};

/** With the group marked, every card shows its checkbox at once. */
export const CardWithSelection: Story = {
  args: {
    layout: 'card',
    isSelected: true,
    contentClassName: 'w-full items-center',
  },
  /**
   * Two checkboxes answer to this name — the floating one from `md` up and the
   * inline one below it — and exactly one of them may be showing at a time.
   */
  play: async ({ args, canvas, userEvent }) => {
    const visible = canvas
      .getAllByRole('checkbox', { name: 'Select report.pdf', hidden: true })
      .filter((checkbox) =>
        checkbox.checkVisibility({ opacityProperty: true })
      );
    await expect(visible).toHaveLength(1);

    const checkbox = visible[0] as HTMLElement;
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    await expect(args.onCheckboxToggle).toHaveBeenCalledOnce();
    await expect(args.onCardClick).not.toHaveBeenCalled();
  },
  render: (args) => (
    <InList hasSelection>
      <SelectableListCard {...args} />
      <SelectableListCard
        {...args}
        isSelected={false}
        checkboxAriaLabel="Select notes.md"
      />
    </InList>
  ),
};

/**
 * The item is a tab stop: Enter and Space do what a click does, and it carries
 * its selection as `aria-selected`. Keys typed into the controls inside it are
 * theirs, not the row's.
 */
export const RowKeyboard: Story = {
  args: {
    layout: 'row',
    isSelected: true,
    cardClassName: 'justify-between',
  },
  play: async ({ args, canvas, userEvent }) => {
    const item = canvas
      .getByText('report.pdf')
      .closest('[tabindex="0"]') as HTMLElement;
    await expect(item).toHaveAttribute('aria-selected', 'true');

    item.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onCardClick).toHaveBeenCalledTimes(2);

    await userEvent.tab();
    await expect(
      canvas.getByRole('checkbox', { name: 'Select report.pdf' })
    ).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onCheckboxToggle).toHaveBeenCalledOnce();
    await expect(args.onCardClick).toHaveBeenCalledTimes(2);
  },
  render: (args) => (
    <InList hasSelection>
      <SelectableListCard {...args} />
    </InList>
  ),
};

const ROW_MENU = (
  <>
    <DropdownMenuItem>
      <Pin />
      Pin
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Pencil />
      Rename
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="danger">
      <Trash2 />
      Delete
    </DropdownMenuItem>
  </>
);

/**
 * `menu`: a ⋮ at the right edge, revealed on hover, on keyboard focus and
 * while open — and always below `md` and on touch. A row with a menu stays the
 * 44px a one-line row is. Its clicks never open the row.
 */
export const RowWithMenu: Story = {
  args: {
    layout: 'row',
    menu: ROW_MENU,
    menuLabel: 'More actions for report.pdf',
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'More actions for report.pdf' })
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Rename' })
    );
    await expect(args.onCardClick).not.toHaveBeenCalled();
  },
  render: (args) => (
    <TooltipProvider>
      <InList hasSelection={false}>
        <SelectableListCard {...args} />
      </InList>
    </TooltipProvider>
  ),
};

/** Selected, with its menu: the selection border holds while it is open. */
export const RowSelectedWithMenu: Story = {
  args: {
    layout: 'row',
    isSelected: true,
    menu: ROW_MENU,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'More actions' }));
    await expect(
      await screen.findByRole('menuitem', { name: 'Delete' })
    ).toBeVisible();
  },
  render: (args) => (
    <TooltipProvider>
      <InList hasSelection>
        <SelectableListCard {...args} />
      </InList>
    </TooltipProvider>
  ),
};

interface Chat {
  id: string;
  title: string;
  time: string;
  pinned: boolean;
}

const CHATS: Chat[] = [
  { id: '1', title: 'Q1 revenue commentary', time: '2h ago', pinned: true },
  {
    id: '2',
    title: 'Churn by plan, last 90 days',
    time: 'Yesterday',
    pinned: false,
  },
  { id: '3', title: 'Top accounts by expansion', time: 'Mon', pinned: false },
  { id: '4', title: 'Pipeline coverage for Q3', time: 'Sep 12', pinned: false },
];

/**
 * The whole conversation list, out of system parts only: a sticky `MetaRow`
 * while anything is selected, and rows with a `menu` (Pin / Select / Rename /
 * Delete), a `PinToggle` on pinned rows and an `InlineRename` in place of the
 * title. Once something is selected a row click toggles it instead of
 * opening it.
 */
export const Interactive: Story = {
  args: { layout: 'row' },
  render: function Render(args) {
    const [chats, setChats] = useState(CHATS);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [renaming, setRenaming] = useState<string | null>(null);
    const [opened, setOpened] = useState<string | null>(null);
    const hasSelection = selected.size > 0;

    const toggle = (id: string) =>
      setSelected((previous) => {
        const next = new Set(previous);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    const update = (id: string, patch: Partial<Chat>) =>
      setChats((previous) =>
        previous.map((chat) => (chat.id === id ? { ...chat, ...patch } : chat))
      );

    // `PinToggle` and `MetaRow`'s ✕ are raw Radix tooltips.
    return (
      <TooltipProvider>
        <div className="flex h-96 w-full max-w-2xl flex-col overflow-y-auto bg-surface-page px-4">
          <div className="flex flex-col gap-1">
            <MetaRow
              sticky={hasSelection}
              onClear={hasSelection ? () => setSelected(new Set()) : undefined}
            >
              <MetaRow.Count>
                {hasSelection
                  ? `${selected.size} selected`
                  : `${chats.length} conversations`}
              </MetaRow.Count>
              {hasSelection ? (
                <MetaRow.End>
                  <Button
                    size="sm"
                    variant="destructiveTertiary"
                    leftSlot={<Trash2 />}
                    onClick={() => {
                      setChats((previous) =>
                        previous.filter((chat) => !selected.has(chat.id))
                      );
                      setSelected(new Set());
                    }}
                  >
                    Delete
                  </Button>
                </MetaRow.End>
              ) : null}
            </MetaRow>

            <InList hasSelection={hasSelection}>
              {chats.map((chat) => {
                const isSelected = selected.has(chat.id);

                return (
                  <SelectableListCard
                    {...args}
                    key={chat.id}
                    layout="row"
                    isSelected={isSelected}
                    checkboxAriaLabel={`Select ${chat.title}`}
                    cardContent={
                      <div className="flex min-w-0 flex-1 items-center gap-1">
                        {renaming === chat.id ? (
                          <InlineRename
                            aria-label="Chat name"
                            defaultValue={chat.title}
                            onCommit={(title) => {
                              update(chat.id, { title });
                              setRenaming(null);
                            }}
                            onCancel={() => setRenaming(null)}
                          />
                        ) : (
                          <>
                            <Typography
                              element="span"
                              textStyle="body14"
                              textColor={opened === chat.id ? 'accent' : 'body'}
                              className="min-w-0 truncate"
                            >
                              {chat.title}
                            </Typography>
                            {chat.pinned ? (
                              <PinToggle
                                className="-my-0.5"
                                pressed
                                onPressedChange={(pinned) =>
                                  update(chat.id, { pinned })
                                }
                              />
                            ) : null}
                          </>
                        )}
                      </div>
                    }
                    rightSlot={
                      <Typography
                        element="span"
                        textStyle="body12"
                        textColor="secondary"
                        className="shrink-0 tabular-nums"
                      >
                        {chat.time}
                      </Typography>
                    }
                    menuLabel={`More actions for ${chat.title}`}
                    menu={
                      <>
                        <DropdownMenuItem
                          onSelect={() =>
                            update(chat.id, { pinned: !chat.pinned })
                          }
                        >
                          {chat.pinned ? <PinOff /> : <Pin />}
                          {chat.pinned ? 'Unpin' : 'Pin'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => toggle(chat.id)}>
                          {isSelected ? <Square /> : <SquareCheck />}
                          {isSelected ? 'Deselect' : 'Select'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setRenaming(chat.id)}>
                          <Pencil />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="danger"
                          onSelect={() =>
                            setChats((previous) =>
                              previous.filter((item) => item.id !== chat.id)
                            )
                          }
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </>
                    }
                    onCheckboxToggle={() => toggle(chat.id)}
                    onCardClick={() => {
                      if (renaming === chat.id) return;
                      if (hasSelection) {
                        toggle(chat.id);
                      } else {
                        setOpened(chat.id);
                      }
                    }}
                  />
                );
              })}
            </InList>
          </div>
        </div>
      </TooltipProvider>
    );
  },
  /**
   * Rename from the menu: the field opens focused and survives the menu
   * closing, rather than being blurred — and committed — by it.
   */
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'More actions for Top accounts by expansion',
      })
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Rename' })
    );
    const field = await canvas.findByRole('textbox', { name: 'Chat name' });
    await waitFor(() => expect(field).toHaveFocus());
    await userEvent.keyboard('Top accounts by NRR{Enter}');
    await expect(canvas.getByText('Top accounts by NRR')).toBeVisible();
  },
};
