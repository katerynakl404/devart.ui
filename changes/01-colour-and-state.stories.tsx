import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { ChevronDown, ChevronsUpDown, Info, Trash2, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import * as AutocompleteStories from '../src/components/Autocomplete/Autocomplete.stories';
import { Button } from '../src/components/Button';
import { IconButton } from '../src/components/IconButton';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../src/components/InputGroup';
import * as TableStories from '../src/components/Table/Table.stories';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

/**
 * The catalog's own story, rendered rather than rebuilt — composing it here
 * means the two cannot drift: change `Components/Table` and this panel changes
 * with it.
 */
const { SortableHeader } = composeStories(TableStories);
const { WithSelection: AutocompleteWithSelection } =
  composeStories(AutocompleteStories);

const meta = {
  title: 'Proposed changes/1. Colour and state',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The old class string, reapplied through `className` so twMerge drops the new one. */
const OLD_DESTRUCTIVE_LABEL = 'text-ink-body';

/** The dark values this branch replaced — Red-700 at rest, Red-800 on hover. */
const OLD_DARK_DESTRUCTIVE_BORDER = {
  '--btn-outline-destructive-border': 'var(--red-700)',
  '--btn-outline-destructive-border-hover': 'var(--red-800)',
} as CSSProperties;

/** §4's two states, frozen as the class strings each side actually carried. */
function OptionRow({
  classes,
  label,
  state,
}: {
  classes: string;
  label: string;
  state: 'selected' | 'highlighted';
}) {
  return (
    <div
      aria-selected={state === 'selected'}
      className={`flex h-9 items-center rounded-md px-3 text-ink-body text-sm ${classes}`}
      data-highlighted={state === 'highlighted' ? 'true' : undefined}
      role="option"
      // A static panel, not a working listbox: the two states are frozen side
      // by side so both can be compared at once, which is the whole point of
      // the case. `-1` keeps it out of the tab order all the same.
      tabIndex={-1}
    >
      {label}
    </div>
  );
}

export const ColourAndState: Story = {
  name: 'Colour and state',
  render: () => (
    <ChangePage
      intro={
        <>
          Seven changes where the wrong colour — or no colour at all — was what
          a user saw. Each panel renders live: hover and press where the case is
          about a state, and the instruction says which.
        </>
      }
      title="Colour and state"
    >
      <ChangeCase
        after={
          <div className="flex items-center gap-3">
            <Button variant="destructiveOutline">Delete connection</Button>
            <IconButton aria-label="Delete" variant="destructiveOutline">
              <Trash2 />
            </IconButton>
          </div>
        }
        afterNote="text-fb-red-text"
        before={
          <div className="flex items-center gap-3">
            <Button
              className={OLD_DESTRUCTIVE_LABEL}
              variant="destructiveOutline"
            >
              Delete connection
            </Button>
            <IconButton
              aria-label="Delete"
              className={OLD_DESTRUCTIVE_LABEL}
              variant="destructiveOutline"
            >
              <Trash2 />
            </IconButton>
          </div>
        }
        beforeNote="text-ink-body"
        beforeSource={
          <>
            the real component with the old class reapplied through{' '}
            <Code>className</Code> — twMerge keeps the last text colour, so this
            is the old rendering, not a copy of it.
          </>
        }
        files={[
          'src/components/Button/index.tsx',
          'src/components/IconButton/index.tsx',
        ]}
        n={1}
        title="destructiveOutline — a neutral label under a red border"
        why={
          <>
            Next to an ordinary secondary button the whole difference came down
            to one thin line, and the control stopped reading as destructive.
            IconButton keeps its own variant definition, so it needed the same
            edit — it was missed the first time.
          </>
        }
      />

      <ChangeCase
        after={
          <TryIt action="Switch the toolbar to dark, then hover">
            <Button variant="destructiveOutline">Delete connection</Button>
          </TryIt>
        }
        afterNote="Red-500 → Red-400 · CR 4.74 → 5.27"
        before={
          <div style={OLD_DARK_DESTRUCTIVE_BORDER}>
            <TryIt action="Switch the toolbar to dark, then hover">
              <Button variant="destructiveOutline">Delete connection</Button>
            </TryIt>
          </div>
        }
        beforeNote="Red-700 → Red-800 · CR 2.76 → 2.15"
        beforeSource={
          <>
            the two old token values, re-declared on the wrapper — the component
            is untouched, so this is exactly what dark rendered.
          </>
        }
        files={['globals.css']}
        footnote={
          <>
            No panel here forces <Code>.dark</Code> — the toolbar owns the
            theme, the way the app does. The two values are dark-only, so on
            light both halves are identical and the case says nothing; flip the
            toolbar. Revised once: the first fix used Red-400 → Red-300, a ×1.79
            jump where light rises by ×1.22.
          </>
        }
        n={2}
        title="Dark destructive border — hover made the control less visible"
        why={
          <>
            Dark inherited light's values, where darker reads as more prominent.
            On the near-black card that inverts: hover dropped contrast from
            2.76 to 2.15 — the only place in the kit where pointing at a control
            made it fainter.
          </>
        }
      />

      <ChangeCase
        after={
          <div className="flex w-full max-w-[260px] flex-col gap-1">
            <OptionRow
              classes="aria-selected:bg-state-pressed aria-selected:font-medium aria-selected:text-ink-highlight"
              label="PostgreSQL — selected"
              state="selected"
            />
            <OptionRow
              classes="data-[highlighted=true]:bg-state-hover"
              label="MySQL — highlighted"
              state="highlighted"
            />
          </div>
        }
        afterNote="selected: state-pressed + ink-highlight"
        before={
          <div className="flex w-full max-w-[260px] flex-col gap-1">
            <OptionRow
              classes="aria-selected:bg-state-hover aria-selected:text-ink-primary"
              label="PostgreSQL — selected"
              state="selected"
            />
            <OptionRow
              classes="data-[highlighted=true]:bg-state-hover"
              label="MySQL — highlighted"
              state="highlighted"
            />
          </div>
        }
        beforeNote="both states: state-hover"
        beforeSource={
          <>
            a replica of <Code>OptionItem</Code> carrying the two class strings
            verbatim — the component is internal to Autocomplete and cannot be
            driven into both states from a story.
          </>
        }
        files={['src/components/Autocomplete/OptionItem.tsx']}
        footnote="Also recorded as #43 in the Insightis UX audit."
        n={4}
        title="Autocomplete — selected and highlighted painted the same"
        why={
          <>
            Both states resolved to <Code>--state-hover</Code>, so the moment
            the cursor entered the list the current value became invisible — two
            different states rendered as one.
          </>
        }
      />

      <ChangeCase
        after={
          <div className="flex flex-col gap-4">
            <TryIt action="Hover the ⓘ">
              <span className="flex items-center gap-2 text-ink-body text-sm">
                Connection name
                <Info className="size-4 text-ink-icon transition-colors hover:text-ink-icon-hover" />
              </span>
            </TryIt>
            <div className="flex gap-3">
              {[
                ['--ink-icon', 'bg-ink-icon'],
                ['--ink-icon-hover', 'bg-ink-icon-hover'],
              ].map(([token, swatch]) => (
                <div className="flex items-center gap-2" key={token}>
                  <span
                    className={`size-5 rounded border border-stroke ${swatch}`}
                  />
                  <Code>{token}</Code>
                </div>
              ))}
            </div>
          </div>
        }
        afterNote="text-ink-icon → text-ink-icon-hover"
        before={
          <TryIt action="Hover the ⓘ">
            <span className="flex items-center gap-2 text-ink-body text-sm">
              Connection name
              <Info className="size-4 text-ink-secondary transition-colors hover:text-ink-body" />
            </span>
          </TryIt>
        }
        beforeNote="whatever step the page picked"
        beforeSource="a page improvising the pair out of the ink ladder, which is what every page did — there was no token to reach for."
        files={['globals.css', 'src/lib/constants.ts']}
        footnote={
          <>
            Both alias Layer-2 roles, so neither needs a <Code>.dark</Code>{' '}
            twin. Rule: a standalone interactive icon changes colour only — if
            it also needs a fill, it is an IconButton and should be one.{' '}
            <strong className="font-medium text-ink-body">
              Check this one against the kit before keeping it:
            </strong>{' '}
            the reference kit's compiled CSS contains <Code>ink-icon</Code> zero
            times, so these two tokens are an addition, not a restoration. Both
            resolve to steps the ink ladder already has —{' '}
            <Code>--ink-secondary</Code> and <Code>--ink-primary</Code> — so the
            alternative is to spend no new tokens and let a page name those
            directly, the way the kit does.
          </>
        }
        n={6}
        title="No token for a standalone icon — new --ink-icon / --ink-icon-hover"
        why={
          <>
            An icon with no box has nothing to fill on hover, so colour is the
            only thing that can answer the pointer — and nothing in the system
            said which colour.
          </>
        }
      />

      <ChangeCase
        after={
          <TryIt action="Hover the Invoice header — label and glyph move together">
            <SortableHeader />
          </TryIt>
        }
        afterNote="hover: both, on ink-icon-hover"
        before={
          <TryIt action="Hover the header — only the words change colour">
            <div className="px-4 py-2.5">
              <button
                className="inline-flex items-center gap-1.5 rounded font-medium text-ink-secondary text-xs leading-4 transition-colors hover:text-ink-body"
                type="button"
              >
                Invoice
                <ChevronsUpDown className="size-3.5 text-ink-inactive" />
              </button>
            </div>
          </TryIt>
        }
        beforeNote="hover: label only, on ink-body"
        beforeSource={
          <>
            a replica of the sort control carrying HEAD's two class strings — on
            the button <Code>transition-colors hover:text-ink-body</Code>, on
            the glyph a bare <Code>text-ink-inactive</Code> with no hover rule
            at all. The button is rendered inside <Code>TableHead</Code> and its
            classes are not reachable from a prop; the After half is the
            catalog's own <Code>Components/Table → SortableHeader</Code>,
            composed rather than rebuilt.
          </>
        }
        files={['src/components/Table/TableHead.tsx']}
        footnote={
          <>
            The mechanism is a <Code>group</Code> on the button and{' '}
            <Code>group-hover:text-ink-icon-hover</Code> on the glyph, so the
            chevrons follow the label instead of sitting out the interaction.
            The glyph still rests a step quieter — an unsorted column should not
            shout — but the two now move together.{' '}
            <strong className="font-medium text-ink-body">
              No press state, deliberately:
            </strong>{' '}
            a sort header commits on click and the feedback is the table
            reordering, so a press colour on a control with no box reads as a
            flicker.{' '}
            <strong className="font-medium text-ink-body">
              Against the kit:
            </strong>{' '}
            its sort control is <Code>hover:text-ink-body</Code> on the label
            and nothing on the glyph, so this is an addition — the package is a
            step ahead of the kit here, not catching up to it.
          </>
        }
        n={7}
        title="The sort glyph did not hover with its label"
        why="Hover moved only the words to ink-body while the chevrons stayed inactive, so a header read as two controls — one that answers the pointer and one that ignores it."
      />

      <ChangeCase
        after={
          <TryIt action="Hover the ✕ and the chevron — both answer the pointer">
            <div className="w-72">
              <AutocompleteWithSelection />
            </div>
          </TryIt>
        }
        afterNote="ink-icon → ink-icon-hover, and a real <button> under each"
        before={
          <TryIt action="Hover the ✕ and the chevron — neither changes colour">
            <div className="w-72">
              <InputGroup inputId="ac-before" label="City">
                <InputGroupInput defaultValue="London" readOnly />
                <InputGroupAddon align="inline-end" className="gap-0.5">
                  <X />
                  <ChevronDown />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </TryIt>
        }
        beforeNote="both glyphs at ink-inactive, the placeholder step"
        beforeSource={
          <>
            a replica, and it has to be: the old markup was{' '}
            <Code>IconButton asChild</Code>, which is structure rather than a
            class, so no <Code>className</Code> brings it back. What the replica
            reproduces is the thing that mattered — a bare{' '}
            <Code>&lt;svg&gt;</Code> as the addon's direct child. The After half
            is the catalog's own{' '}
            <Code>Components/Autocomplete → WithSelection</Code>, composed
            rather than rebuilt.
          </>
        }
        files={['src/components/Autocomplete/index.tsx']}
        footnote={
          <>
            <Code>asChild</Code> makes <Code>IconButton</Code> render its child
            instead of a button, so what lands in the addon is a bare{' '}
            <Code>&lt;svg&gt;</Code>. The addon's own rules read that literally:{' '}
            <Code>[&amp;&gt;svg]:text-ink-inactive</Code> is the{' '}
            <em>decorative</em> glyph rule — placeholder ink — while{' '}
            <Code>[&amp;&gt;button]:text-ink-secondary</Code> and its hover step
            match nothing. Two clickable controls therefore painted one step
            below the text they sat next to and never answered the pointer.
            <br />
            <br />
            Both are now <Code>InputGroupAction</Code> — §47's part for exactly
            this. The second half of the fix is the one nothing on screen shows:
            an <Code>&lt;svg&gt;</Code> carrying an <Code>aria-label</Code> and
            a click handler is not a control to a screen reader, and now each is
            a real <Code>&lt;button&gt;</Code>. Measured after the swap: two
            buttons, 24px, <Code>rgb(90 106 128)</Code> —{' '}
            <Code>--ink-icon</Code> — and no bare <Code>svg</Code> left as a
            direct child of the addon. The chevron still opens the menu and the
            ✕ still clears without opening it.
          </>
        }
        n={68}
        title="Autocomplete — the clear and the chevron painted as placeholders"
        why="Both are clickable, and both rendered at ink-inactive with no hover: the addon's decorative-glyph rule matched them, because asChild left an svg where a button should be."
      />
    </ChangePage>
  ),
};
