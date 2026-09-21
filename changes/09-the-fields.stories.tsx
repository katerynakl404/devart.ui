import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { Search, X } from 'lucide-react';
import {
  InputGroup,
  InputGroupAction,
  InputGroupAddon,
  InputGroupInput,
} from '../src/components/InputGroup';
import * as InputGroupStories from '../src/components/InputGroup/InputGroup.stories';
import { TextArea } from '../src/components/TextArea';
import { Typography } from '../src/components/Typography';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/9. The fields',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const { SearchWithClear } = composeStories(InputGroupStories);

/**
 * The published field shell carried no trailing rule at all: the size ladder's
 * `px-3` held both edges, so a docked control added its own inset on top of it.
 * Reapplied through `className`, where twMerge keeps the last padding class.
 */
const OLD_FIELD_EDGE = 'has-[[data-slot=input-group-action]]:pe-3';

/** The standing caveat F-25 wants next to the counter. */
const AI_WARNING =
  'Do not include passwords, API tokens, or personal data in these instructions.';

export const TheFields: Story = {
  name: 'The fields',
  render: () => (
    <ChangePage
      intro="Six entries about the field family. Two of them changed nothing — they are here because the change log has them, and a section with no panel is still a section somebody has to be able to find."
      title="The fields"
    >
      <ChangeCase
        after={
          <div className="flex w-72 flex-col gap-4">
            <InputGroup inputId="act-after">
              <InputGroupAddon align="inline-start">
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput defaultValue="Q3 KPI" type="search" />
              <InputGroupAddon align="inline-end">
                <InputGroupAction aria-label="Clear search">
                  <X aria-hidden />
                </InputGroupAction>
              </InputGroupAddon>
            </InputGroup>
            <SearchWithClear />
          </div>
        }
        afterNote="InputGroupAction — 24px box, 16px glyph, colour-only hover"
        files={['src/components/InputGroup/InputGroupAction.tsx']}
        footnote={
          <>
            New part, so there is nothing to compare it against. Every page had
            been building this slot out of the nearest control on the ladder —{' '}
            <Code>IconButton size="2xs" variant="tertiary"</Code> — which is the
            right 24px box and two wrong things: a 14px glyph where the field's
            own step is 16, and a hover pill. The kit is explicit that the slot
            has no surface, because the field already owns hover, focus and
            press, and a second filled box inside that one reads as a control
            sitting on top of a control. It answers the pointer the only way
            something without a box can — with colour, through{' '}
            <Code>--ink-icon</Code> / <Code>--ink-icon-hover</Code>. The lower
            panel is the catalog's own <Code>InputGroup → SearchWithClear</Code>
            , composed.
          </>
        }
        n={46}
        title="An icon docked in a field is not an icon button"
        why="There was no part for a field's trailing control, so every page reached for the icon button one step down the ladder and got a glyph one size small under a pill the field did not need."
      />

      <ChangeCase
        after={
          <div className="w-72">
            <InputGroup inputId="inset-after">
              <InputGroupAddon align="inline-start">
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput defaultValue="Q3 KPI" />
              <InputGroupAddon align="inline-end">
                <InputGroupAction aria-label="Clear">
                  <X aria-hidden />
                </InputGroupAction>
              </InputGroupAddon>
            </InputGroup>
          </div>
        }
        afterNote="both glyphs 13px from their own edge"
        before={
          <div className="w-72">
            <InputGroup className={OLD_FIELD_EDGE} inputId="inset-before">
              <InputGroupAddon align="inline-start">
                <Search aria-hidden />
              </InputGroupAddon>
              <InputGroupInput defaultValue="Q3 KPI" />
              <InputGroupAddon align="inline-end">
                <InputGroupAction aria-label="Clear">
                  <X aria-hidden />
                </InputGroupAction>
              </InputGroupAddon>
            </InputGroup>
          </div>
        }
        beforeNote="the ✕ glyph 17px in, against 13px opposite it"
        beforeSource={
          <>
            the size ladder's own <Code>px-3</Code> put back on the trailing
            edge through <Code>className</Code>, which is what the field carried
            before it learned to yield.
          </>
        }
        files={['src/components/InputGroup/index.tsx']}
        footnote={
          <>
            Two insets on one edge, and only one of them was anybody's
            intention. The kit puts the ✕ 8px from the border in a 24px box
            around a 16px glyph — 12px of optical air, the same as the leading
            glyph opposite it. Stacked with the shell's own 12px it did not:
            measured in these two panels, the ✕ sat 17px from the trailing edge
            while the search icon sat 13px from the leading one — a 4px lean
            nobody drew. The shell now swaps <Code>px-3</Code> for{' '}
            <Code>pe-2</Code> when a <Code>data-slot="input-group-action"</Code>{' '}
            is present — a <Code>has-</Code> selector rather than a prop,
            because whether the field has a trailing action is something the
            markup already says.
          </>
        }
        n={46}
        title="The field yields its trailing inset"
        why="The shell's padding and the docked control's own box both claimed the trailing edge, so the ✕ sat twice as far in as the glyph facing it."
      />

      <ChangeCase
        after={
          <TextArea
            defaultValue="Answer in the user's language."
            hintText={AI_WARNING}
            label="AI instructions"
            maxLength={4000}
            showCount
            wrapperClassName="w-[360px]"
          />
        }
        afterNote="hintText — the left half of the row the counter already owned"
        before={
          <div className="flex w-[360px] flex-col">
            <TextArea
              defaultValue="Answer in the user's language."
              label="AI instructions"
            />
            <div className="mt-1 flex items-start justify-between gap-4">
              <Typography
                className="min-w-0 flex-1"
                textColor="secondary"
                textStyle="body12"
                variant="span"
              >
                {AI_WARNING}
              </Typography>
              <Typography
                className="shrink-0 whitespace-nowrap tabular-nums"
                textColor="secondary"
                textStyle="body12"
                variant="span"
              >
                29/4000
              </Typography>
            </div>
          </div>
        }
        beforeNote="showCount off, and the whole row rebuilt by hand"
        beforeSource="the shape the connections page had to write: a plain TextArea with its own two-column row underneath, because the component's row had no slot for the caveat."
        files={['src/components/TextArea/index.tsx']}
        footnote={
          <>
            <Code>showCount</Code> already drew a two-column row, and its left
            half only ever held <Code>errorText</Code>. A page that needed a
            standing caveat beside the counter — F-25 asks for one — had to turn
            the counter off and rebuild both halves, which is how a{' '}
            <Code>-mt-2</Code> and a hand-set gap end up in a page. The slot is
            now a prop. An error still wins the left half while it is showing: a
            caveat is standing advice, an error is about what you just typed.
          </>
        }
        n={42}
        title="The counter row had a slot nothing could fill"
        why="The row existed, the space existed, and the only thing that could go in it was an error — so a page with a caveat to show threw the row away and built its own."
      />

      <ChangeCase
        after={
          <TryIt action="Compare the counter with the hint above it">
            <div className="flex w-[360px] flex-col gap-1">
              <TextArea
                defaultValue="Answer in the user's language."
                label="AI instructions"
                maxLength={4000}
                showCount
              />
              <span className="text-ink-inactive text-xs">
                ← the counter at <Code>--ink-inactive</Code>, the kit's value
              </span>
            </div>
          </TryIt>
        }
        afterNote="proposed: textColor='inactive'"
        before={
          <TryIt action="The counter sits at the hint's own step">
            <div className="flex w-[360px] flex-col gap-1">
              <TextArea
                defaultValue="Answer in the user's language."
                label="AI instructions"
                maxLength={4000}
                showCount
              />
              <span className="text-ink-secondary text-xs">
                ← the counter at <Code>--ink-secondary</Code>, as it ships
              </span>
            </div>
          </TryIt>
        }
        beforeNote="ink-secondary — the hint's own colour"
        beforeSource={
          <>
            both halves are the live component, because this one has not been
            made: the counter renders <Code>textColor="secondary"</Code> in{' '}
            <Code>TextArea/index.tsx</Code> today. The swatch under each panel
            is the ink step being argued about.
          </>
        }
        files={['src/components/TextArea/index.tsx']}
        footnote={
          <>
            The kit says <Code>.ta-count</Code> is Body 12 in{' '}
            <Code>--ink-inactive</Code>, right-aligned, 4px above. Everything
            else already matches — size, gap, <Code>ms-auto</Code>,{' '}
            <Code>aria-live="polite"</Code>, digits only. Only the ink step is
            off, and it is the step that decides whether the counter reads as
            information <em>about</em> the field or as part of the field's
            content. §9 moved the label up so the hint would be subordinate; the
            counter should sit below the hint, not beside it.
          </>
        }
        n={31}
        state="proposed"
        title="The counter is one ink step too loud"
        why="It shares --ink-secondary with the hint, so two things of different weight read as one line of the same voice."
      />

      <ChangeCase
        after={<SearchWithClear />}
        afterNote="the recipe, working — revealed by :placeholder-shown"
        files={[
          'src/components/InputGroup/InputGroup.stories.tsx',
          'src/components/InputGroup/InputGroup.md',
        ]}
        footnote={
          <>
            Filed as a gap and downgraded, which is why it has one panel and no
            comparison. The kit reveals the ✕ only when there is something to
            clear —{' '}
            <Code>
              .igrp:has(.igrp-input:not(:placeholder-shown)) .igrp-clear
            </Code>{' '}
            — and the package reproduces it exactly, as a story rather than a
            component feature:{' '}
            <Code>group-has-[input:placeholder-shown]/input-group:hidden</Code>{' '}
            on the trailing addon. A clear button on an empty field is a control
            that does nothing, and one keyed to focus flickers on every
            tab-through. Type into the field and the ✕ appears; empty it and it
            goes.
          </>
        }
        n={29}
        state="not-a-library-change"
        title="The search clear button is a recipe, not a part"
        why="The behaviour is fully specified and reachable — as a documented story, not as a prop. Recorded so the next page does not re-invent it."
      />

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
        n={30}
        state="proposed"
        title="One bespoke focus ring, not three missing states"
        why="Filed after reading one file, and three quarters of it was wrong. The quarter that is not: a calendar day focuses differently from every other control in the package."
      />
    </ChangePage>
  ),
};
