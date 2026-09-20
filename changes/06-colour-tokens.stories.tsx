import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../src/components/Button';
import { ChangeCase, ChangePage, Code } from './Harness';

const meta = {
  title: 'Proposed changes/6. Colour tokens',
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

export const ColourTokens: Story = {
  name: 'Colour tokens',
  render: () => (
    <ChangePage
      intro={
        <>
          The largest change in the tree, and the one with its own changeset:
          interaction states stopped being absolute colours and became
          translucent washes. Every panel here is painted at rest — no hovering
          needed to read the difference.
        </>
      }
      title="Colour tokens"
    >
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
        n="Tokens · 1"
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
        n="Tokens · 2"
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
        n="Tokens · 3"
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
    </ChangePage>
  ),
};
