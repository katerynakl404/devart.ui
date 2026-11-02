import type { Meta, StoryObj } from '@storybook/react-vite';
import { Info } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { Badge } from '../src/components/Badge';
import { Button } from '../src/components/Button';
import { ProgressBar } from '../src/components/ProgressBar';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '../src/components/SegmentedControl';
import { Typography } from '../src/components/Typography';
import { ChangeCase, ChangePage, Code, NoPanel, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/Tokens and colour',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The absolute values the four state tokens carried before, re-declared as
 * finished colours. `hsl(...)` around each, because the old mapping supplied
 * the wrapper — passing the raw triplet here would emit an invalid declaration
 * and paint nothing, which would misrepresent the old state as a blank.
 */
const OLD_ABSOLUTE_STATES = {
  '--state-hover': 'hsl(var(--slate-100))',
  '--state-pressed': 'hsl(var(--brand-50))',
  '--tbl-row-hover': 'hsl(var(--slate-50))',
  '--tbl-row-pressed': 'hsl(var(--surface-card2))',
} as CSSProperties;

/** §2 — the dark values this branch replaced: Red-700 at rest, Red-800 on hover. */
const OLD_DARK_DESTRUCTIVE_BORDER = {
  '--btn-destructive-secondary-border': 'var(--red-700)',
  '--btn-destructive-secondary-border-hover': 'var(--red-800)',
} as CSSProperties;

/**
 * §167 — the developers' 1.4.0 green, `#009966` light and `#03AF76` dark, as
 * both tokens: before the split, fill and ink were one and the same.
 */
const DEVELOPERS_GREEN =
  '[--fb-green:160_100%_30%] [--fb-green-text:160_100%_30%] dark:[--fb-green:160.1_96.6%_34.9%] dark:[--fb-green-text:160.1_96.6%_34.9%]';

/** Everything that paints green: text, a Badge, a bar, a chosen and a tinted option. */
function GreenSpecimen() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Badge variant="success">Connected</Badge>
        <Typography textColor="success">Sync completed</Typography>
      </div>
      <ProgressBar className="w-48" value={64} variant="green" />
      <div className="flex flex-col gap-2">
        {[true, false].map((chosen) => (
          <SegmentedControl
            defaultValue={chosen ? 'allow' : ''}
            key={String(chosen)}
            semantics="radio"
            size="sm"
          >
            <SegmentedControlList aria-label="Access">
              <SegmentedControlTrigger
                tinted={!chosen}
                tone="positive"
                value="allow"
              >
                Allow
              </SegmentedControlTrigger>
              <SegmentedControlTrigger tone="negative" value="deny">
                Deny
              </SegmentedControlTrigger>
            </SegmentedControlList>
          </SegmentedControl>
        ))}
      </div>
    </div>
  );
}

/** The old brand step, before it was retuned into the interaction wash. */
const OLD_BRAND_300 = { '--brand-300': '186 30% 51%' } as CSSProperties;

/** The old destructive-tertiary strengths on light. */
const OLD_DESTRUCTIVE_STEPS = {
  '--btn-destructive-tertiary-bg-hover':
    'color-mix(in srgb, hsl(var(--fb-red)) var(--tint-6), transparent)',
  '--btn-destructive-tertiary-bg-press':
    'color-mix(in srgb, hsl(var(--fb-red)) var(--tint-8), transparent)',
} as CSSProperties;

/** A painted sample of one token over the card surface, with its name. */
function Swatch({
  fill,
  label,
  note,
}: {
  fill: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-10 w-full rounded-md border border-stroke bg-surface-card">
        <div
          className="h-full w-full rounded-md"
          style={{ background: fill }}
        />
      </div>
      <span className="font-mono text-ink-body text-xxs">{label}</span>
      {note ? (
        <span className="text-ink-secondary text-xxs">{note}</span>
      ) : null}
    </div>
  );
}

function SwatchRow({ children }: { children: ReactNode }) {
  return <div className="grid w-full grid-cols-2 gap-3">{children}</div>;
}

/**
 * The case the overlays exist for: a control hovering on a row that is already
 * selected. Painted, not hovered — the outer box is the selected row, the inner
 * one is the control's own hover fill on top of it.
 */
function StackDemo({ style }: { style?: CSSProperties }) {
  return (
    <div className="flex w-full flex-col gap-2" style={style}>
      <div className="rounded-md border border-stroke bg-surface-card p-2">
        <div className="rounded bg-tbl-row-pressed p-3">
          <div className="rounded bg-state-hover px-3 py-2 text-ink-body text-sm">
            Control hover, on a selected row
          </div>
        </div>
      </div>
    </div>
  );
}

export const Page: Story = {
  name: 'Tokens and colour',
  render: () => (
    <ChangePage group="Tokens and colour" title="Tokens and colour">
      <ChangeCase
        after={
          <TryIt action="Switch the toolbar to dark, then hover">
            <Button variant="destructiveSecondary">Delete connection</Button>
          </TryIt>
        }
        afterNote="Red-500 → Red-400 · CR 4.74 → 5.27"
        before={
          <div style={OLD_DARK_DESTRUCTIVE_BORDER}>
            <TryIt action="Switch the toolbar to dark, then hover">
              <Button variant="destructiveSecondary">Delete connection</Button>
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
        n={5}
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
        after={<StackDemo />}
        afterNote="two overlays composite — 8% over 8%"
        before={<StackDemo style={OLD_ABSOLUTE_STATES} />}
        beforeNote="both resolve to #F1F5F9 — the control vanishes"
        beforeSource="the same boxes with the four old values re-declared on the wrapper."
        files={['globals.css', 'src/lib/constants.ts']}
        footnote={
          <>
            An absolute colour cannot stack. Now each theme declares one base —{' '}
            <Code>--state-overlay</Code> — and four strengths.
          </>
        }
        n="6a"
        title="Interaction states became relative overlays"
        why="Hovering a control on a selected row painted the colour already under it: both tokens resolved to #F1F5F9 on light, #21212C on dark."
      />

      <ChangeCase
        after={
          <SwatchRow>
            <Swatch
              fill="var(--tbl-row-hover)"
              label="--tbl-row-hover · tint-4"
              note="#F8FBFC · Δ7"
            />
            <Swatch
              fill="var(--tbl-row-pressed)"
              label="--tbl-row-pressed · tint-8"
              note="#F0F8F9 · Δ15"
            />
            <Swatch
              fill="var(--state-hover)"
              label="--state-hover · tint-8"
              note="#F0F8F9 · Δ15"
            />
            <Swatch
              fill="var(--state-pressed)"
              label="--state-pressed · tint-12"
              note="#E9F4F7 · Δ22"
            />
          </SwatchRow>
        }
        afterNote="one wash, four strengths"
        before={
          <div style={OLD_ABSOLUTE_STATES}>
            <SwatchRow>
              <Swatch
                fill="var(--tbl-row-hover)"
                label="--tbl-row-hover"
                note="slate-50"
              />
              <Swatch
                fill="var(--tbl-row-pressed)"
                label="--tbl-row-pressed"
                note="surface-card2"
              />
              <Swatch
                fill="var(--state-hover)"
                label="--state-hover"
                note="slate-100"
              />
              <Swatch
                fill="var(--state-pressed)"
                label="--state-pressed"
                note="brand-50"
              />
            </SwatchRow>
          </div>
        }
        beforeNote="four unrelated absolutes"
        beforeSource="the four old values, painted over the same card."
        files={['globals.css']}
        footnote="Rows are lighter than controls, or a list turns into stripes. Row-pressed and control-hover share a strength: hovering a control on a selected row lands at 8% over 8%. Δ figures measured over the card."
        n="6a"
        title="The state ladder, painted"
        why="Four strengths — 4 / 8 / 8 / 12 — shared by both themes."
      />

      <ChangeCase
        after={
          <SwatchRow>
            <Swatch
              fill="hsl(var(--brand-300))"
              label="--brand-300"
              note="#46A6B9 · 190° 45%"
            />
            <Swatch
              fill="var(--state-hover)"
              label="washed at tint-8"
              note="what a control hover paints"
            />
          </SwatchRow>
        }
        afterNote="the interaction wash"
        before={
          <div style={OLD_BRAND_300}>
            <SwatchRow>
              <Swatch
                fill="hsl(var(--brand-300))"
                label="--brand-300"
                note="#5DA0A8 · 186° 30%"
              />
              <Swatch
                fill="color-mix(in srgb, hsl(var(--brand-300)) var(--tint-8), transparent)"
                label="washed at tint-8"
                note="desaturated — reads dirty"
              />
            </SwatchRow>
          </div>
        }
        beforeNote="the old ramp step"
        beforeSource="the old value re-declared on the wrapper, with the same 8% wash beside it."
        files={['globals.css']}
        footnote="It had no consumers, so it could be retuned rather than added to. At 29% saturation the wash read dirty; the brand role itself washes green."
        n="6a"
        title="--brand-300 retuned into the wash"
        why="The overlay needs a base whose hue survives dilution to 4–12%."
      />

      <ChangeCase
        after={
          <div className="flex items-center gap-3">
            <Button variant="destructiveTertiary">Delete</Button>
            <Button variant="tertiary">Cancel</Button>
          </div>
        }
        afterNote="hover tint-4 · press tint-6 — dL 2.67 / 4.01"
        before={
          <div
            className="flex items-center gap-3"
            style={OLD_DESTRUCTIVE_STEPS}
          >
            <Button variant="destructiveTertiary">Delete</Button>
            <Button variant="tertiary">Cancel</Button>
          </div>
        }
        beforeNote="hover tint-6 · press tint-8 — heavier than neutral"
        beforeSource="the live buttons with the two old strengths re-declared on the wrapper. Hover each pair."
        files={['globals.css']}
        footnote="Light only — dark was already in parity at 20 / 30. The outline sibling aliases these, so it moves with them."
        n="Tokens · 4"
        title="Destructive tertiary re-stepped to match the neutral ladder"
        why="When the neutral steps moved to overlays, destructive stayed put and started reading heavier than the neutral button beside it."
      />
      <NoPanel
        section={129}
        title="Syntax colours — --code-* and codeSyntaxVariants"
        why={
          <>
            <Code>CodeBlock</Code>, the <Code>--code-*</Code> tokens and their
            three primitives are not in the developers' library at 1.4.0 — there
            is nothing to set them against.
          </>
        }
      />

      <ChangeCase
        after={<GreenSpecimen />}
        afterNote="fill Green-700 both themes · ink Green-800 light, Green-500 dark"
        before={
          <div className={DEVELOPERS_GREEN}>
            <GreenSpecimen />
          </div>
        }
        beforeNote="one green for both jobs — white on it 3.65 light, 2.84 dark"
        beforeSource={
          <>
            the developers' 1.4.0 green — <Code>#009966</Code> on light,{' '}
            <Code>#03AF76</Code> on dark — re-declared on the wrapper as both{' '}
            <Code>--fb-green</Code> and <Code>--fb-green-text</Code>, which is
            what every one of these read then. Switch the toolbar to dark for
            the second half of the case.
          </>
        }
        files={[
          'globals.css',
          'src/lib/constants.ts',
          'src/__tests__/contrast.test.ts',
        ]}
        footnote={
          <>
            Red already worked this way: <Code>--fb-red</Code> is the fill, the
            same in both themes, and <Code>--fb-red-text</Code> the ink and the
            washes. The Alert and Toast success washes move with the ink too;
            they are mixed in <Code>globals.css</Code> at the root, so a wrapper
            cannot put their old value back, and they are left out of the
            panels. The SegmentedControl rows are this package's own draft (
            <Code>tone</Code>, <Code>tinted</Code>) — there for the colour, not
            as a Before of the control.
          </>
        }
        n={167}
        title="Green, split the way red is"
        why="One green did the fill's job and the ink's, and moved with the theme: lighter on dark, where white on it fell to 2.84:1, and too light on light for text — 3.65:1 on the card."
      />
    </ChangePage>
  ),
};
