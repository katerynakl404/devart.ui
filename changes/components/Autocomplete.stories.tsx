import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { ChevronDown, X } from 'lucide-react';
import * as AutocompleteStories from '../../src/components/Autocomplete/Autocomplete.stories';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../../src/components/InputGroup';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const { WithSelection: AutocompleteWithSelection } =
  composeStories(AutocompleteStories);

const meta = {
  title: 'Proposed changes/Components/Autocomplete',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** §3's two states, frozen as the class strings each side actually carried. */
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

export const Page: Story = {
  name: 'Autocomplete',
  render: () => (
    <ChangePage group="Autocomplete" title="Autocomplete">
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
        n={3}
        title="Selected and highlighted painted the same"
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
            <Code>&lt;svg&gt;</Code>, and the addon's rules read that literally:
            the rule for a <em>decorative</em> glyph matched them while the rule
            for a docked <em>control</em> matched nothing. Two clickable
            controls therefore painted one step below the text they sat next to
            and never answered the pointer.
            <br />
            <br />
            <strong className="font-medium text-ink-body">
              The two rules have both moved since:
            </strong>{' '}
            the decorative-glyph rule was retracted as invented (§44, archived)
            and the glyph now inherits the addon's own{' '}
            <Code>--ink-secondary</Code>, which is what the kit states; the
            docked-control pair was renamed to the tokens the kit names,{' '}
            <Code>--ink-icon</Code> to <Code>--ink-icon-hover</Code>. Neither
            move changes this case — the defect was that a bare <Code>svg</Code>{' '}
            is not a button — but the mechanism is no longer spelled the way it
            was when this was found.
            <br />
            <br />
            Both are now <Code>InputGroupAction</Code> — §45's part for exactly
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
        n={62}
        title="The clear and the chevron painted as placeholders"
        why="Both are clickable, and both rendered at ink-inactive with no hover: the addon's decorative-glyph rule matched them, because asChild left an svg where a button should be."
      />
    </ChangePage>
  ),
};
