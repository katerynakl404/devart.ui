import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconButton } from '../../src/components/IconButton';
import {
  InputGroup,
  InputGroupAction,
  InputGroupAddon,
  InputGroupInput,
} from '../../src/components/InputGroup';
import * as InputGroupStories from '../../src/components/InputGroup/InputGroup.stories';
import * as PasswordInputStories from '../../src/components/PasswordInput/PasswordInput.stories';
import * as TextAreaStories from '../../src/components/TextArea/TextArea.stories';
import { ChangeCase, ChangePage, Code, NoPanel } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/InputGroup',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The descendant rule the addon used to carry, reproduced step for step from
 * `git show HEAD:…/InputGroupAddon.tsx` — `xs` was 16px and every larger step
 * 20px, so a blanket 20 would overstate the defect at `xs`.
 *
 * Scoped through the shell's own height class to the addon's descendants, and
 * nowhere else: the old rule lived on the addon, so a glyph outside one was
 * never touched by it. `!` because `[&_svg]` and `[&>svg]` have identical
 * specificity and the winner would otherwise come down to stylesheet order.
 */
const OLD_ADDON_DESCENDANT_RULE = [
  '[&_.h-7_[data-slot=input-group-addon]_svg]:!size-4',
  '[&_.h-8_[data-slot=input-group-addon]_svg]:!size-5',
  '[&_.h-9_[data-slot=input-group-addon]_svg]:!size-5',
  '[&_.h-10_[data-slot=input-group-addon]_svg]:!size-5',
  '[&_.h-11_[data-slot=input-group-addon]_svg]:!size-5',
].join(' ');

const {
  Disabled: InputGroupDisabled,
  ErrorState: InputGroupError,
  SearchWithClear,
  Default: InputGroupDefault,
  Sizes: InputGroupSizes,
} = composeStories(InputGroupStories);

const { Sizes: PasswordSizes } = composeStories(PasswordInputStories);

const { WithValue: TextAreaWithValue } = composeStories(TextAreaStories);

function Labelled({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium text-ink-inactive text-xxs uppercase leading-4 tracking-caps">
        {label}
      </span>
      {children}
    </div>
  );
}

/**
 * §7 seen across the whole surface the rule touches: every size step, a field
 * with a nested control, and the two states that change the glyph's colour.
 * All of it is the catalog's own stories, composed — the rule is about what a
 * nested control is allowed to keep, so a hand-built field would prove nothing.
 */
function AddonMatrix() {
  return (
    <div className="flex flex-col gap-5">
      <Labelled label="Sizes — xs · sm · md · lg · xl">
        <InputGroupSizes />
      </Labelled>
      <Labelled label="A nested control: the clear button">
        <SearchWithClear />
      </Labelled>
      <Labelled label="States — error and disabled">
        <div className="flex flex-col gap-3">
          <InputGroupError />
          <InputGroupDisabled />
        </div>
      </Labelled>
      <Labelled label="PasswordInput — two nested controls per field">
        <PasswordSizes />
      </Labelled>
    </div>
  );
}

/**
 * §9's subject is the label's ink step, so the panel shows the two places a
 * label appears next to a hint: a field and a TextArea with its counter. Both
 * are the catalog's own stories.
 */
function LabelLadder() {
  return (
    <div className="flex w-[280px] flex-col gap-5">
      <InputGroupDefault />
      <TextAreaWithValue />
    </div>
  );
}

/**
 * §102 — the geometry the action carried at every size, `xs` included: a 24px
 * box around a 16px glyph. Put back through `className`, where twMerge keeps it
 * over the live `size-3.5 [&>svg]:size-3.5`.
 */
const OLD_ACTION_BOX = 'size-6 [&>svg]:size-4';

/**
 * §106 — the glyph back on the addon's own ink. The live addon paints its svg
 * `--ink-inactive`; this restores what the svg inherited before, the
 * `text-ink-secondary` both addon variants carry.
 */
const OLD_ADDON_GLYPH_INK = '[&>svg]:text-ink-secondary';

/**
 * An `xs` search with something typed: the search icon on the left, the clear
 * ✕ on the right — the pair §102 is about. Built from the parts so the action
 * can take a class; `SearchInput size="xs"` renders the same tree.
 */
function XsClearField({ actionClassName }: { actionClassName?: string }) {
  return (
    <InputGroup className="w-[200px]" size="xs">
      <InputGroupAddon align="inline-start">
        <Search aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search" defaultValue="orders" />
      <InputGroupAction aria-label="Clear search" className={actionClassName}>
        <X aria-hidden />
      </InputGroupAction>
    </InputGroup>
  );
}

/**
 * The field at 1× and again at 2×. The magnified one is the same field under
 * CSS `zoom`, redrawn at that size, so the insets read as geometry.
 */
function XsClear({ actionClassName }: { actionClassName?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <XsClearField actionClassName={actionClassName} />
      <div style={{ zoom: 2 }}>
        <XsClearField actionClassName={actionClassName} />
      </div>
    </div>
  );
}

/**
 * §106 — an empty search, where the glyph and the placeholder sit side by side
 * and are read as one hint, and a field with a text addon, which keeps its ink.
 */
function AddonInk({ glyphClassName }: { glyphClassName?: string }) {
  return (
    <div className="flex w-[280px] flex-col gap-4">
      <InputGroup>
        <InputGroupAddon align="inline-start" className={glyphClassName}>
          <Search aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Search"
          placeholder="Search connections…"
        />
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Timeout" defaultValue="30" />
        <InputGroupAddon align="inline-end" className={glyphClassName}>
          seconds
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export const Page: Story = {
  name: 'InputGroup',
  render: () => (
    <ChangePage group="InputGroup" title="InputGroup">
      <ChangeCase
        after={<AddonMatrix />}
        afterNote="[&>svg] — the addon sizes only its own glyph"
        before={
          <div className={OLD_ADDON_DESCENDANT_RULE}>
            <AddonMatrix />
          </div>
        }
        beforeNote="[&_svg] — xs 16px, every larger step 20px"
        beforeSource={
          <>
            the same panels with the old descendant rule put back over them.
            Both halves render the catalog's own stories —{' '}
            <Code>InputGroup → Sizes / SearchWithClear / ErrorState</Code> and{' '}
            <Code>PasswordInput → Sizes</Code> — composed rather than rebuilt,
            so the fields here are the ones the catalog ships and not a
            hand-made lookalike.
          </>
        }
        files={[
          'src/components/InputGroup/InputGroupAddon.tsx',
          'src/components/PasswordInput/index.tsx',
        ]}
        footnote={
          <>
            PasswordInput carried three <Code>!size-4</Code> and a comment
            explaining why; all three are gone, because the workaround existed
            only because of this rule. The addon now sizes its own decorative
            glyph, and a nested control sizes its own.{' '}
            <strong className="font-medium text-ink-body">To fix:</strong>{' '}
            DESIGN-SYSTEM-CHANGES.md §7 still quotes <Code>sm</Code> at{' '}
            <Code>size-5</Code>, while the source has <Code>size-4</Code> — the
            glyph tracks the field (28/32 → 16px, 36/40/44 → 20px, 44 → 24px).
          </>
        }
        n={7}
        title="InputGroupAddon resized glyphs it did not own"
        why={
          <>
            A descendant selector reaches into every control nested in the addon
            and out-specifies its own size step — a <Code>2xs</Code> IconButton
            asking for 14px rendered 20px.
          </>
        }
      />

      <ChangeCase
        after={<LabelLadder />}
        afterNote="label: ink-body · hint: ink-secondary"
        before={
          <div className="[&_label]:text-ink-secondary">
            <LabelLadder />
          </div>
        }
        beforeNote="both on ink-secondary"
        beforeSource={
          <>
            the live fields under a wrapper re-declaring the label colour —{' '}
            <Code>[&_label]:text-ink-secondary</Code> — which resolves to the
            exact value the components used to pass.
          </>
        }
        files={[
          'src/components/InputGroup/index.tsx',
          'src/components/TextArea/index.tsx',
        ]}
        footnote={
          <>
            The hint was deliberately not moved down instead:{' '}
            <Code>--ink-secondary</Code> is its role, and the step below it is
            the placeholder/disabled role — a hint rendered in it says "this
            field is switched off".
          </>
        }
        n={9}
        title="A field label as loud as the hint beneath it"
        why="Label and helper both resolved to --ink-secondary; only weight separated them. A hint as loud as the label it belongs to stops being subordinate to it."
      />

      <ChangeCase
        after={<XsClear />}
        afterNote="the box is the 14px glyph — 8px in, as the icon opposite"
        before={<XsClear actionClassName={OLD_ACTION_BOX} />}
        beforeNote="24px box, 16px ✕ — 12px in, a size up on the icon"
        beforeSource={
          <>
            the live field with the action's old box put back through{' '}
            <Code>className</Code> — <Code>{OLD_ACTION_BOX}</Code>, the geometry
            it carried at every size.
          </>
        }
        files={['src/components/InputGroup/InputGroupAction.tsx']}
        footnote={
          <>
            The action reads the size from the group. From <Code>sm</Code> up
            both glyphs already sat 12px in — 8px of field inset plus 4px inside
            the 24px box against 12px of inset on the left — so only{' '}
            <Code>xs</Code>, where the leading glyph is 14px and 8px in, showed
            it. The box is 14px there, and so is the hit area.
          </>
        }
        n={102}
        title="InputGroup xs — the clear ✕ where the search icon is"
        why="At xs the ✕ kept the larger steps' 24px box: it sat 4px further from its edge than the search icon from the other, and drew 2px larger."
      />

      <ChangeCase
        after={<AddonInk />}
        afterNote="glyph in --ink-inactive · text addon in --ink-secondary"
        before={<AddonInk glyphClassName={OLD_ADDON_GLYPH_INK} />}
        beforeNote="glyph in the addon's --ink-secondary"
        beforeSource={
          <>
            the live fields with the glyph's old ink put back through the
            addon's <Code>className</Code> — <Code>{OLD_ADDON_GLYPH_INK}</Code>,
            the colour the glyph inherited from the addon.
          </>
        }
        files={['src/components/InputGroup/InputGroupAddon.tsx']}
        footnote={
          <>
            Only the svg moves: the unit beside the second field stays on{' '}
            <Code>--ink-secondary</Code> in both halves, and a docked button
            keeps <Code>--ink-icon</Code> / <Code>--ink-icon-hover</Code>. In
            dark the old glyph is a step lighter than the placeholder instead of
            a step darker — flip the toolbar.
          </>
        }
        n={106}
        title="InputGroupAddon — the glyph in the placeholder's grey"
        why="The search icon took the addon's --ink-secondary while the placeholder beside it is --ink-inactive: two greys for one hint."
      />

      <ChangeCase
        after={
          <InputGroup className="w-[280px]" label="Search connections">
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput defaultValue="prod" />
            <InputGroupAddon align="inline-end">
              <IconButton aria-label="Clear" size="2xs" variant="tertiary">
                <X />
              </IconButton>
            </InputGroupAddon>
          </InputGroup>
        }
        afterNote='align="inline-end" · IconButton size="2xs"'
        before={
          <InputGroup className="w-[280px]" label="Search connections">
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput defaultValue="prod" />
            <InputGroupAddon>
              <IconButton aria-label="Clear" size="2xs" variant="tertiary">
                <X />
              </IconButton>
            </InputGroupAddon>
          </InputGroup>
        }
        beforeNote="no align — the clear button lands before the input"
        beforeSource={
          <>
            an addon written without an explicit <Code>align</Code>, which
            defaults to <Code>inline-start</Code>. Every search field in the
            prototype had its × sitting next to the magnifier.
          </>
        }
        files={['src/components/InputGroup/InputGroup.md']}
        footnote={
          <>
            The documented recipe is <Code>align="inline-end"</Code> with{' '}
            <Code>IconButton size="2xs"</Code> — a 24px box around a 14px glyph,
            the row-action step. InputGroup's existing{' '}
            <Code>has-[&gt;[data-align=inline-end]]:[&amp;&gt;input]:pr-2</Code>{' '}
            supplies the gap, so nothing else is needed.
          </>
        }
        n="Docs · InputGroup.md"
        state="docs-only"
        title="Where the clear button goes"
        why="The default alignment puts an addon before the input, and nothing in the doc said so."
      />
      <NoPanel
        section={45}
        title="InputGroupAction — the docked-icon inks"
        why={
          <>
            <Code>--ink-icon</Code> and <Code>--ink-icon-hover</Code> resolve to{' '}
            <Code>--ink-secondary</Code> and <Code>--ink-primary</Code> — the
            pair the old classes named — in both themes and every pack. The
            section renames the tokens; no pixel moves.
          </>
        }
      />
    </ChangePage>
  ),
};
