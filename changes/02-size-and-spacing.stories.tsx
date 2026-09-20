import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { Info, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../src/components/Button';
import { IconButton } from '../src/components/IconButton';
import * as InputGroupStories from '../src/components/InputGroup/InputGroup.stories';
import * as PasswordInputStories from '../src/components/PasswordInput/PasswordInput.stories';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../src/components/Tabs';
import * as TextAreaStories from '../src/components/TextArea/TextArea.stories';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../src/components/Tooltip';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/2. Size and spacing',
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

/** The panel classes `TabsContent` carries, minus the one line under review. */
const TABS_PANEL_CLASSES =
  'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card';

/**
 * §8 seen across the whole surface the rule touches: every size step, a field
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
 * §10's subject is the label's ink step, so the panel shows the two places a
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
 * The size ladder as it stood before §49 — `git show HEAD~:…/Button/index.tsx`.
 * Padding grew 12 → 16 → 20 above `md` while the label stayed `text-sm` and the
 * glyph `size-4`; the gap was 6px at every step, `xs` included.
 */
const BUTTON_LADDER = [
  { size: 'xs', was: 'gap-1.5 px-2 text-xs [&_svg]:size-3.5' },
  { size: 'sm', was: 'gap-1.5 px-3 text-sm [&_svg]:size-4' },
  { size: 'md', was: 'gap-1.5 px-3 text-sm [&_svg]:size-4' },
  { size: 'lg', was: 'gap-1.5 px-4 text-sm [&_svg]:size-4' },
  { size: 'xl', was: 'gap-1.5 px-5 text-sm [&_svg]:size-4' },
] as const;

/** The same, for the icon-only control: the box never moved, the glyph did. */
const ICON_LADDER = [
  { size: '2xs', was: '[&_svg]:size-3.5' },
  { size: 'xs', was: '[&_svg]:size-3.5' },
  { size: 'sm', was: '[&_svg]:size-4' },
  { size: 'md', was: '[&_svg]:size-4' },
  { size: 'lg', was: '[&_svg]:size-4' },
  { size: 'xl', was: '[&_svg]:size-4' },
] as const;

/** The bubble classes `TooltipContent` carries, minus the arrow under review. */
const TOOLTIP_BUBBLE_CLASSES =
  'z-50 w-max max-w-72 whitespace-normal rounded-md bg-ink-primary px-2 py-1 text-left text-surface-card text-xs';

/** An outlined box around the trigger, so the hit area itself is visible. */
function TriggerBox({
  children,
  inlineFlex,
}: {
  children: ReactNode;
  inlineFlex?: boolean;
}) {
  return (
    <span
      className={`${inlineFlex ? 'inline-flex' : 'inline'} outline outline-1 outline-fb-attention/60`}
    >
      {children}
    </span>
  );
}

function PanelBody({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-stroke bg-surface-card2 p-4 text-ink-body text-sm">
      {label}
    </div>
  );
}

/**
 * The second tab open, and a marker under the whole block. Both halves of §9
 * need the same frame: the defect is 16px of empty space, which is only legible
 * against something that moves.
 */
function TabsDemo({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-[320px] flex-col">
      <Tabs defaultValue="schema">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
      <div className="mt-2 border-fb-attention border-t border-dashed pt-1 text-fb-attention text-xxs">
        next section starts here
      </div>
    </div>
  );
}

/**
 * §49 across the whole ladder. `old` reapplies the class string each step used
 * to carry — the padding, the label step and the glyph — through `className`,
 * which twMerge resolves in favour of the last class in the group.
 */
function SizeLadder({ old }: { old?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <Labelled label="Button">
        <div className="flex flex-wrap items-end gap-3">
          {BUTTON_LADDER.map(({ size, was }) => (
            <Button className={old ? was : undefined} key={size} size={size}>
              <Trash2 />
              Delete
            </Button>
          ))}
        </div>
      </Labelled>
      <Labelled label="IconButton — the same box ladder, icon only">
        <div className="flex flex-wrap items-end gap-3">
          {ICON_LADDER.map(({ size, was }) => (
            <IconButton
              aria-label={`Delete (${size})`}
              className={old ? was : undefined}
              key={size}
              size={size}
              variant="secondary"
            >
              <Trash2 />
            </IconButton>
          ))}
        </div>
      </Labelled>
    </div>
  );
}

export const SizeAndSpacing: Story = {
  name: 'Size and spacing',
  render: () => (
    <ChangePage
      intro="Five cases where a rule reached further than it owned, a box came back that should have stayed away, or a control grew in the wrong direction."
      title="Size and spacing"
    >
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
            DESIGN-SYSTEM-CHANGES.md §8 still quotes <Code>sm</Code> at{' '}
            <Code>size-5</Code>, while the source has <Code>size-4</Code> — the
            glyph tracks the field (28/32 → 16px, 36/40/44 → 20px, 44 → 24px).
          </>
        }
        n={8}
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
        after={
          <TabsDemo>
            <TabsContent className="flex flex-col gap-2" value="overview">
              <PanelBody label="Overview panel" />
            </TabsContent>
            <TabsContent className="flex flex-col gap-2" value="schema">
              <PanelBody label="Schema panel — the open one" />
            </TabsContent>
          </TabsDemo>
        }
        afterNote="the open panel starts right under the tabs"
        before={
          <TabsDemo>
            <TabsPrimitive.Content
              className={`${TABS_PANEL_CLASSES} flex flex-col gap-2`}
              value="overview"
            >
              <PanelBody label="Overview panel" />
            </TabsPrimitive.Content>
            <TabsPrimitive.Content
              className={`${TABS_PANEL_CLASSES} flex flex-col gap-2`}
              value="schema"
            >
              <PanelBody label="Schema panel — the open one" />
            </TabsPrimitive.Content>
          </TabsDemo>
        }
        beforeNote="16px of nothing above it — and below the whole block"
        beforeSource={
          <>
            the package's own Tabs with the panels swapped for raw{' '}
            <Code>@radix-ui/react-tabs</Code>, which is what{' '}
            <Code>TabsContent</Code> was before the pin. The second tab is open
            on purpose: the closed panel sits <em>above</em> it in the DOM, so
            its dead space is what pushes the open panel down. Measured, the
            closed panel is <Code>display: flex</Code> with height 0 — Radix
            drops its children but the box stays in the flow, and its own{' '}
            <Code>mt-4</Code> is the 16px you see.
          </>
        }
        files={['src/components/Tabs/TabsContent.tsx']}
        n={9}
        title="TabsContent — the inactive panel came back as an empty box"
        why={
          <>
            Radix hides the inactive panel with the <Code>hidden</Code>{' '}
            attribute, which is only a UA-stylesheet <Code>display:none</Code> —
            any display class from the consumer beats it. That was the source of
            the "extra padding under the tabs".
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
        n={10}
        title="A field label as loud as the hint beneath it"
        why="Label and helper both resolved to --ink-secondary; only weight separated them. A hint as loud as the label it belongs to stops being subordinate to it."
      />

      <ChangeCase
        after={
          <TryIt action="Hover either trigger">
            <TooltipProvider>
              <div className="flex items-center gap-8">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TriggerBox inlineFlex>
                      <Info className="size-3.5 text-ink-icon" />
                    </TriggerBox>
                  </TooltipTrigger>
                  <TooltipContent side="top">Read replica</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-ink-body text-sm underline decoration-dotted">
                      A text trigger
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">Read replica</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </TryIt>
        }
        afterNote="arrow 8×4 · visible gap 4px · trigger hugs the icon"
        before={
          <TryIt action="Hover either trigger">
            <TooltipPrimitive.Provider>
              <div className="flex items-center gap-8">
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <TriggerBox>
                      <Info className="size-3.5 text-ink-icon" />
                    </TriggerBox>
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      className={TOOLTIP_BUBBLE_CLASSES}
                      side="top"
                      sideOffset={8}
                    >
                      Read replica
                      <TooltipPrimitive.Arrow className="fill-ink-primary" />
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <span className="text-ink-body text-sm underline decoration-dotted">
                      A text trigger
                    </span>
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      className={TOOLTIP_BUBBLE_CLASSES}
                      side="top"
                      sideOffset={8}
                    >
                      Read replica
                      <TooltipPrimitive.Arrow className="fill-ink-primary" />
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
              </div>
            </TooltipPrimitive.Provider>
          </TryIt>
        }
        beforeNote="Radix default 10×5 · visible gap 3px · trigger 20px tall"
        beforeSource={
          <>
            raw Radix with the package's own bubble classes and the stock arrow.
            The amber outline is the trigger's box: left, a plain inline{' '}
            <Code>&lt;span&gt;</Code> grows to the line box — 20px around a 14px
            icon — so the tip drifts a further 6px from the glyph it points at.
          </>
        }
        files={['src/components/Tooltip/TooltipContent.tsx']}
        footnote={
          <>
            Radix draws the arrow into the <Code>sideOffset</Code> gap rather
            than beside it, so the distance a reader sees is{' '}
            <Code>sideOffset − arrowHeight</Code> = 8 − 5 = 3px; neither 5 nor 3
            is on the 4px scale. The trigger half is not fixed in the package —
            the trigger belongs to the consumer — but <Code>inline-flex</Code>{' '}
            is what makes the box hug the icon.
          </>
        }
        n={15}
        title="Tooltip — the arrow put the gap off the 4px scale"
        why="The arrow is now 8×4, putting the tip exactly 4px from the trigger, so all three numbers sit on the grid."
      />

      <ChangeCase
        after={<SizeLadder />}
        afterNote="padding 8/12/12/12/12 · label 12/14/14/16/16 · glyph 14/16/16/20/20"
        before={<SizeLadder old />}
        beforeNote="padding 8/12/12/16/20 · label 12/14/14/14/14 · glyph 14/16/16/16/16"
        beforeSource={
          <>
            the old class strings, reapplied through <Code>className</Code> —{' '}
            <Code>gap-1.5</Code> at every step, <Code>px-4 text-sm</Code> at{' '}
            <Code>lg</Code>, <Code>px-5 text-sm</Code> at <Code>xl</Code>, and
            the 16px glyph above <Code>md</Code>. twMerge keeps the last class
            in a group, so this is the old rendering and not an approximation.
          </>
        }
        files={[
          'src/components/Button/index.tsx',
          'src/components/IconButton/index.tsx',
        ]}
        footnote={
          <>
            The two systems disagreed about what a bigger control is. The kit
            holds the inset at 12px from <Code>sm</Code> upward and grows the{' '}
            <em>label</em> — 14 → 16; the package held the label at 14 and grew
            the <em>padding</em> — 12 → 16 → 20. Both make a wider control; only
            one makes a more prominent one. Heights matched at all five steps,
            which is why this survived the first pass. The gap moved with it:
            6px everywhere, now 8 with 4 at <Code>xs</Code>, the kit's numbers.
            The ladder stops at 20px rather than following the kit's 24px{' '}
            <Code>--icon-xl</Code> — on a 44px control a 24px glyph outgrows its
            box. <strong className="font-medium text-ink-body">To fix:</strong>{' '}
            the comment over the size map in <Code>Button/index.tsx</Code> still
            describes the ladder it replaced — "8/12/12/16/20" and a glyph "16px
            everywhere" — and the Summary row in DESIGN-SYSTEM-CHANGES.md still
            ends the glyph ladder at 24.
          </>
        }
        n={49}
        title="A bigger button grew its box, not its label"
        why="lg and xl widened the control while the label stayed 14px and the glyph 16px, so a 44px xl read as an oversized md — a small label in a lot of air."
      />
    </ChangePage>
  ),
};
