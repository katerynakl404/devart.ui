import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType, ReactNode } from 'react';
import { Checkbox, type CheckedState } from '../../src/components/Checkbox';
import { ChangeCase, ChangePage, Code } from '../Harness';
import { Checkbox as UpstreamCheckbox } from '../upstream/Checkbox';

const meta = {
  title: 'Proposed changes/Components/Checkbox',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The props both Checkboxes share — all the panels need. */
type AnyCheckbox = ComponentType<{
  'aria-label'?: string;
  checked?: CheckedState;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: ReactNode;
}>;

/**
 * Checked and indeterminate, at 1× and again at 4×. The magnified row is the
 * same component under CSS `zoom`, so it is redrawn at that size rather than
 * scaled up from pixels — what it shows is the geometry, not blur.
 */
function Marks({ Component }: { Component: AnyCheckbox }) {
  const row = (
    <div className="flex items-center gap-3">
      <Component aria-label="Checked" checked />
      <Component aria-label="Indeterminate" checked="indeterminate" />
    </div>
  );
  return (
    <div className="flex flex-col gap-4">
      {row}
      <div style={{ zoom: 4 }}>{row}</div>
    </div>
  );
}

function DisabledMarks({ Component }: { Component: AnyCheckbox }) {
  return (
    <div className="flex flex-col gap-3">
      <Component checked disabled label="Checked, disabled" />
      <Component
        checked="indeterminate"
        disabled
        label="Indeterminate, disabled"
      />
    </div>
  );
}

/**
 * The label twice: on the panel as it is, and inside a block that sets its own
 * grey — a hint area, a muted card. A label that inherits turns grey with it.
 */
function Labels({ Component }: { Component: AnyCheckbox }) {
  return (
    <div className="flex flex-col gap-3">
      <Component defaultChecked label="Remember this device" />
      <div className="text-ink-secondary">
        <Component defaultChecked label="Inside a block set in ink-secondary" />
      </div>
    </div>
  );
}

const UPSTREAM_SOURCE = (
  <>
    the developers' own component, vendored unchanged from their 1.4.0 into{' '}
    <Code>changes/upstream/Checkbox.tsx</Code> — the Checkbox their storybook
    ships, not a replica of it.
  </>
);

export const Page: Story = {
  name: 'Checkbox',
  render: () => (
    <ChangePage group="Checkbox" title="Checkbox">
      <ChangeCase
        after={<Marks Component={Checkbox} />}
        afterNote="one 10px grid · stroke 1.5 · 4px a side · bar 8px"
        before={<Marks Component={UpstreamCheckbox} />}
        beforeNote="lucide Check / Minus at 14px, the default stroke"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/components/Checkbox/Checkbox.tsx']}
        footnote={
          <>
            10px in an 18px box leaves 4px a side, a whole device pixel at 100,
            125, 150 and 200%; the 14px glyph sat at 2px, and the halved lucide
            tick sat 0.25px high. The bar is <Code>M1.75 5h6.5</Code> — 8px with
            its round caps, 5px clear of the box each side.
          </>
        }
        n={57}
        title="The tick and the bar at one weight, centred"
        why="The tick read high and to the right, and the bar long and heavier than the tick: two lucide glyphs drawn on a 24-unit grid, shrunk into a box they were not drawn for."
      />

      <ChangeCase
        after={<DisabledMarks Component={Checkbox} />}
        afterNote="the mark keeps content-on-solid, fades with the box"
        before={<DisabledMarks Component={UpstreamCheckbox} />}
        beforeNote="the mark repainted in ink-inactive, then faded again"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/components/Checkbox/Checkbox.tsx']}
        footnote="Disabled is an opacity fade, not a colour swap — the same rule every other control follows."
        n={163}
        title="The disabled mark fades with its box"
        why="A grey mark on a faded brand fill, faded a second time: the tick and the bar all but disappeared, so a disabled checked box read as a disabled empty one."
      />

      <ChangeCase
        after={<Labels Component={Checkbox} />}
        afterNote="text-ink-body, wherever it is placed"
        before={<Labels Component={UpstreamCheckbox} />}
        beforeNote="no colour of its own — it takes the block's"
        beforeSource={UPSTREAM_SOURCE}
        files={[
          'src/components/Checkbox/Checkbox.tsx',
          'src/components/Checkbox/CheckboxGroup.tsx',
        ]}
        footnote={
          <>
            <Code>CheckboxGroup</Code>'s option labels carried no type at all
            and now take a standalone checkbox's{' '}
            <Code>font-medium text-sm</Code>.
          </>
        }
        n={164}
        title="The label in --ink-body"
        why="The label took its colour from wherever the checkbox was placed, so the same control read as body text on one page and as a hint on another."
      />
    </ChangePage>
  ),
};
