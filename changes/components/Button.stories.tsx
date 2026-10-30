import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, ChevronRight, RefreshCw, Settings } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { Button } from '../../src/components/Button';
import { IconButton } from '../../src/components/IconButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../src/components/Tooltip';
import { cn } from '../../src/lib/utils';
import { ChangeCase, ChangePage, Code, NoPanel, TryIt } from '../Harness';
import { Button as UpstreamButton } from '../upstream/Button';
import { IconButton as UpstreamIconButton } from '../upstream/IconButton';

const meta = {
  title: 'Proposed changes/Components/Button',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The props both Buttons share — all the panels need. */
type AnyButton = ComponentType<{
  'aria-disabled'?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'sm';
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
}>;

/** The same for IconButton — the live one requires its `aria-label`. */
type AnyIconButton = ComponentType<{
  'aria-label': string;
  children?: ReactNode;
  disabled?: boolean;
  size?: 'sm';
  variant?: 'secondary';
}>;

/** A caption under or beside a control: a surface, a variant, a state. */
function Caption({ children }: { children: ReactNode }) {
  return <span className="text-ink-secondary text-xxs">{children}</span>;
}

const UPSTREAM_SOURCE = (
  <>
    the developers' own <Code>Button</Code> and <Code>IconButton</Code>,
    vendored unchanged from their 1.4.0 into{' '}
    <Code>changes/upstream/Button</Code> and{' '}
    <Code>changes/upstream/IconButton</Code> — the buttons their storybook
    ships, not a replica of them.
  </>
);

/** §80 — a switched-off secondary, on the card and on a tinted row. */
function SecondaryOff({ Btn, Icon }: { Btn: AnyButton; Icon: AnyIconButton }) {
  const row = (
    <div className="flex items-center gap-2">
      <Btn disabled size="sm" variant="secondary">
        Export
      </Btn>
      <Icon aria-label="Refresh" disabled size="sm" variant="secondary">
        <RefreshCw />
      </Icon>
    </div>
  );
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        {row}
        <Caption>on surface-card</Caption>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-md bg-surface-card2 px-3 py-2">
        {row}
        <Caption>on surface-card2 — a header row</Caption>
      </div>
    </div>
  );
}

/** §101 — one branch of a data tree, its toggles the only difference. */
const TREE = [
  { depth: 0, name: 'analytics-prod', open: true },
  { depth: 1, name: 'public', open: true },
  { depth: 2, name: 'orders', open: false },
  { depth: 2, name: 'customers', open: false },
  { depth: 1, name: 'staging', open: false },
];

const INDENT = ['', 'ps-5', 'ps-10'];

function TreeRows({ old }: { old?: boolean }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {TREE.map((row) => {
        const glyph = row.open ? <ChevronDown /> : <ChevronRight />;
        const label = `${row.open ? 'Collapse' : 'Expand'} ${row.name}`;
        return (
          <li
            className={cn(
              'flex h-7 items-center gap-1 text-ink-body text-sm',
              INDENT[row.depth]
            )}
            key={row.name}
          >
            {old ? (
              <UpstreamIconButton
                aria-label={label}
                size="2xs"
                variant="tertiary"
              >
                {glyph}
              </UpstreamIconButton>
            ) : (
              <IconButton aria-label={label} size="3xs" variant="tertiary">
                {glyph}
              </IconButton>
            )}
            {row.name}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * §147 — the three bordered buttons switched off, in the same columns on both
 * sides: which of the other two the red one turns into is the change.
 */
function BorderedOff({ old }: { old?: boolean }) {
  const B: AnyButton = old ? UpstreamButton : Button;
  return (
    <div className="grid grid-cols-3 items-start gap-3">
      <div className="flex flex-col items-start gap-1.5">
        <B disabled size="sm" variant="outline">
          Archive
        </B>
        <Code>outline</Code>
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <B disabled size="sm" variant="secondary">
          Cancel
        </B>
        <Code>secondary</Code>
      </div>
      <div className="flex flex-col items-start gap-1.5">
        {old ? (
          <UpstreamButton disabled size="sm" variant="destructiveOutline">
            Delete
          </UpstreamButton>
        ) : (
          <Button disabled size="sm" variant="destructiveSecondary">
            Delete
          </Button>
        )}
        <Code>{old ? 'destructiveOutline' : 'destructiveSecondary'}</Code>
      </div>
    </div>
  );
}

/** §151 — a switched-off control with a reason, and the aria-disabled form. */
function Reasons({ old }: { old?: boolean }) {
  const variants = ['primary', 'secondary', 'outline', 'destructive'] as const;
  const B: AnyButton = old ? UpstreamButton : Button;
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Caption>disabled, with the reason it is off</Caption>
          {old ? (
            <TryIt action="Tab across — both are skipped, and their reasons with them">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UpstreamButton disabled size="sm">
                      Add workspace
                    </UpstreamButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    Activate the connection to add it to a workspace
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UpstreamIconButton
                      aria-label="Set up Finance warehouse"
                      disabled
                      size="sm"
                      variant="secondary"
                    >
                      <Settings />
                    </UpstreamIconButton>
                  </TooltipTrigger>
                  <TooltipContent>Activate the connection first</TooltipContent>
                </Tooltip>
              </div>
            </TryIt>
          ) : (
            <TryIt action="Tab across, or hover — each names why it is off">
              <div className="flex items-center gap-2">
                <Button
                  disabled
                  size="sm"
                  tooltip="Activate the connection to add it to a workspace"
                >
                  Add workspace
                </Button>
                <IconButton
                  aria-label="Set up Finance warehouse"
                  disabled
                  size="sm"
                  tooltip="Activate the connection first"
                  variant="secondary"
                >
                  <Settings />
                </IconButton>
              </div>
            </TryIt>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Caption>
            <Code>aria-disabled</Code> on four variants
          </Caption>
          <div className="flex flex-wrap items-center gap-2">
            {variants.map((variant) => (
              <B aria-disabled key={variant} size="sm" variant={variant}>
                {variant}
              </B>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

/** §165 — the consent row: Deny switched off while Allow is working. */
function ConsentRow({ Btn }: { Btn: AnyButton }) {
  return (
    <div className="flex items-center gap-2">
      <Btn disabled size="sm" variant="secondary">
        Deny
      </Btn>
      <Btn isLoading size="sm">
        Allow
      </Btn>
    </div>
  );
}

export const Page: Story = {
  name: 'Button',
  render: () => (
    <ChangePage group="Button and IconButton" title="Button">
      <ChangeCase
        after={<SecondaryOff Btn={Button} Icon={IconButton} />}
        afterNote="no fill — the border and the label carry it"
        before={<SecondaryOff Btn={UpstreamButton} Icon={UpstreamIconButton} />}
        beforeNote="--state-disabled fill, whatever it sits on"
        beforeSource={UPSTREAM_SOURCE}
        files={[
          'src/components/Button/index.tsx',
          'src/components/IconButton/index.tsx',
        ]}
        footnote={
          <>
            Transparent is what <Code>outline</Code> already did, and it is the
            one answer that holds on every surface. <Code>primary</Code> keeps{' '}
            <Code>--state-disabled</Code>: a filled button switched off has
            nothing else to be. The label and the fade in the After half are
            §165; the destructive form is §147. Switch the toolbar to dark to
            see the fill turn into the brightest thing in the row.
          </>
        }
        n={80}
        title="A disabled secondary has no fill"
        why="An opaque fill depends on where it lands: on a tinted row — a chips row, a banner, a table header — a switched-off button became a block of its own, and on dark the brightest thing in the row."
      />

      <ChangeCase
        after={<TreeRows />}
        afterNote="3xs — a 20px box, a 12px glyph"
        before={<TreeRows old />}
        beforeNote="2xs — a 24px box, a 16px glyph"
        beforeSource={
          <>
            the developers' <Code>IconButton</Code>, vendored, at{' '}
            <Code>2xs</Code> — the smallest box it has. The rows around it are
            the same in both halves.
          </>
        }
        files={['src/components/IconButton/index.tsx']}
        footnote={
          <>
            The <Code>rounded</Code> radius as on <Code>2xs</Code> and{' '}
            <Code>xs</Code>, and the <Code>xs</Code> spinner. Row actions stay{' '}
            <Code>2xs</Code>: this step is for the one toggle at the start of a
            row, many to a screen.
          </>
        }
        n={101}
        state="draft"
        title="IconButton 3xs — the tree-row toggle"
        why="The expand / collapse at the start of every tree row was a 24px box beside a 14px name, and down a whole tree the toggles outweighed the names."
      />

      <ChangeCase
        after={<BorderedOff />}
        afterNote="switched off, the red one is the secondary"
        before={<BorderedOff old />}
        beforeNote="switched off, the red one is the outline"
        beforeSource={
          <>
            the developers' <Code>Button</Code>, vendored, switched off only: at
            rest their <Code>destructiveOutline</Code> no longer draws here,
            because its <Code>outlineDestructive-*</Code> utilities name the
            colour group that was renamed with it.
          </>
        }
        files={[
          'src/components/Button/index.tsx',
          'src/components/IconButton/index.tsx',
          'src/lib/constants.ts',
          'globals.css',
        ]}
        footnote={
          <>
            At rest nothing moved — the same red border, red label and no fill,
            the values carried over token for token. What moved is the name and
            the family: <Code>destructiveOutline</Code> →{' '}
            <Code>destructiveSecondary</Code>, named the way its sibling{' '}
            <Code>destructiveTertiary</Code> already was, and{' '}
            <Code>--btn-outline-destructive-*</Code> →{' '}
            <Code>--btn-destructive-secondary-*</Code>. Both buttons read one
            disabled fragment, <Code>secondaryDisabled</Code>. A breaking rename
            — <strong className="font-medium text-ink-body">major</strong>.
          </>
        }
        n={147}
        title="destructiveOutline → destructiveSecondary — the secondary's destructive form"
        why="A red border, a red label and no fill is the secondary's destructive form, but it was named and switched off as the outline's — a different, brand-bordered button."
      />

      <ChangeCase
        after={<Reasons />}
        afterNote="aria-disabled: focusable, painted off, the reason on hover and focus"
        before={<Reasons old />}
        beforeNote="disabled: out of the tab order; aria-disabled: painted on"
        beforeSource={
          <>
            the developers' <Code>Button</Code> and <Code>IconButton</Code>,
            vendored, each wrapped in a <Code>Tooltip</Code> the way a page
            wraps it. Their recipes paint nothing for <Code>aria-disabled</Code>
            , so the second row is four buttons that look as if they work.
          </>
        }
        files={[
          'src/components/Tooltip/ControlTooltip.tsx',
          'src/components/IconButton/index.tsx',
          'src/components/Button/index.tsx',
          'src/components/Switch/index.tsx',
          'src/lib/utils.ts',
        ]}
        footnote={
          <>
            With <Code>disabled</Code> and a <Code>tooltip</Code> the control
            renders <Code>aria-disabled</Code> instead — announced as
            unavailable, its click swallowed — and every variant paints that
            form as it paints <Code>disabled</Code>. On an enabled{' '}
            <Code>IconButton</Code>, <Code>tooltip</Code> draws what pages
            already built by hand, an <Code>IconButton</Code> inside a{' '}
            <Code>TooltipTrigger</Code> (19 times in the AI connectivity
            prototype): the pixels are the same, the prop is the change.{' '}
            <Code>Switch</Code> takes the same two props and keeps its reason
            the same way. Like every <Code>Tooltip</Code>, it needs a{' '}
            <Code>TooltipProvider</Code> above it.
          </>
        }
        n={151}
        state="draft"
        title="tooltip on IconButton, Button and Switch — a disabled control keeps it"
        why="A disabled button is out of the tab order and reports no hover, so the reason it was off reached nobody — pages put a focusable span between the button and its Tooltip to get it out."
      />

      <ChangeCase
        after={
          <TryIt action="Switch the toolbar to dark — the two fade alike">
            <ConsentRow Btn={Button} />
          </TryIt>
        }
        afterNote="--ink-body, the whole control at opacity-disabled"
        before={
          <TryIt action="Switch the toolbar to dark — Deny turns blue-grey">
            <ConsentRow Btn={UpstreamButton} />
          </TryIt>
        }
        beforeNote="--ink-inactive on --state-disabled"
        beforeSource={UPSTREAM_SOURCE}
        files={['src/lib/utils.ts']}
        footnote={
          <>
            The rule <Code>Checkbox</Code> already follows (§163): disabled is a
            fade, not a colour swap. No fill still holds (§80) — the fade is of
            the border and the label over whatever the button sits on — and
            hover stays off. <Code>destructiveSecondary</Code> reads the same
            fragment, so switched off it is this button, not a faded red one.
          </>
        }
        n={165}
        title="A disabled secondary fades, it is not repainted"
        why="Switched off, the label was repainted --ink-inactive, which read blue on dark — and beside a loading primary, faded with its own colours kept, the pair looked like two systems."
      />
      <NoPanel
        section={66}
        title="A switched-off control lit up under the pointer"
        why={
          <>
            Not at the developers' 1.4.0: each variant's <Code>disabled:</Code>{' '}
            recipe sets every property its <Code>hover:</Code> sets, and
            Tailwind emits <Code>disabled:</Code> after <Code>hover:</Code>, so
            a disabled button there never lit up. The defect was this package's
            own interim <Code>secondary</Code>, fixed in the same change.
          </>
        }
      />
    </ChangePage>
  ),
};
