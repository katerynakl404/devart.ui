import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Copy, Download, Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../src/components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../src/components/DropdownMenu';
import { IconButton } from '../src/components/IconButton';
import { PasswordInput } from '../src/components/PasswordInput';
import { ChangeCase, ChangePage, Code, TryIt } from './Harness';

const meta = {
  title: 'Proposed changes/Sizes and glyphs',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The ladder the published catalog ships, verbatim from
 * `git show upstream/master:src/components/Button/index.tsx` — base `gap-1.5`
 * over a size map whose only moving part is the height. Padding is `px-2.5` at
 * all five steps, the label steps once at `xs`, and the glyph steps once at
 * `xs` too — down to 12px, below the 14 the row-action rung is locked at.
 */
const BUTTON_LADDER = [
  { size: 'xs', was: 'gap-1.5 px-2.5 text-xs [&_svg]:size-3' },
  { size: 'sm', was: 'gap-1.5 px-2.5 text-sm [&_svg]:size-4' },
  { size: 'md', was: 'gap-1.5 px-2.5 text-sm [&_svg]:size-4' },
  { size: 'lg', was: 'gap-1.5 px-2.5 text-sm [&_svg]:size-4' },
  { size: 'xl', was: 'gap-1.5 px-2.5 text-sm [&_svg]:size-4' },
] as const;

/**
 * The same for the icon-only control, from the same commit. Its box ladder was
 * already right; the glyph inside it was on no ladder at all — 16 at `2xs`,
 * then 12 at the `xs` one step above it, then 16, then 20 three times.
 */
const ICON_LADDER = [
  { size: '2xs', was: '[&_svg]:size-4' },
  { size: 'xs', was: '[&_svg]:size-3' },
  { size: 'sm', was: '[&_svg]:size-4' },
  { size: 'md', was: '[&_svg]:size-5' },
  { size: 'lg', was: '[&_svg]:size-5' },
  { size: 'xl', was: '[&_svg]:size-5' },
] as const;

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
 * §40 across the whole ladder. `old` reapplies the class string each step used
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

const FIELD_STEPS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * §44 — what f69ebc9 sized a password field's two glyphs with, each a literal
 * from `git show f69ebc9:src/components/PasswordInput/index.tsx` and
 * `…/InputGroup/InputGroupAddon.tsx`. The lock took the addon's step, 16 at
 * `xs` and 20 above (written here as the child rule the live addon uses — the
 * lock is a direct child, so it renders the same). The eye sat in a toggle
 * hard-coded to `sm` and was pinned at 18px with `!important`.
 */
const OLD_LOCK = { xs: '[&>svg]:size-4', other: '[&>svg]:size-5' };
const OLD_TOGGLE = {
  size: 'sm',
  className: '[&_svg]:!size-[1.125rem]',
} as const;

function PasswordLadder({ old }: { old?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-3">
      {FIELD_STEPS.map((size) => (
        <div className="flex items-center gap-3" key={size}>
          <span className="w-6 shrink-0 font-mono text-ink-inactive text-xxs">
            {size}
          </span>
          <PasswordInput
            aria-label={`Password (${size})`}
            classNames={
              old
                ? {
                    startAddonClassName:
                      size === 'xs' ? OLD_LOCK.xs : OLD_LOCK.other,
                  }
                : undefined
            }
            className="flex-1"
            defaultValue="workspace-key"
            inputGroupProps={{ size }}
            toggleButtonProps={old ? OLD_TOGGLE : undefined}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * §92 — a glyph brought in at its own weight, as a set exported at 1.5 is,
 * beside two at Lucide's default. f69ebc9 set no stroke on these controls, so
 * the glyph's own attribute drew; `[&_svg]:stroke-[1.5]` puts that weight back
 * in place of `glyphStroke`, because a class cannot be taken off through
 * `className`, only out-ranked. The menu rows carry f69ebc9's own class.
 */
const OLD_PASSED_IN = '[&_svg]:stroke-[1.5]';
const OLD_MENU_ROW = '[&_svg]:stroke-[1.75]';

function StrokeDemo({ old }: { old?: boolean }) {
  const row = old ? OLD_MENU_ROW : undefined;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button className={old ? OLD_PASSED_IN : undefined} variant="secondary">
          <Download strokeWidth={1.5} />
          Export
        </Button>
        <IconButton aria-label="Rename" variant="secondary">
          <Pencil />
        </IconButton>
        <IconButton aria-label="Duplicate" variant="secondary">
          <Copy />
        </IconButton>
      </div>
      <TryIt action="Open the menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="self-start" variant="secondary">
              Actions
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem className={row}>
              <Pencil />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className={row}>
              <Copy />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className={row}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TryIt>
    </div>
  );
}

export const Page: Story = {
  name: 'Sizes and glyphs',
  render: () => (
    <ChangePage group="Sizes and glyphs" title="Sizes and glyphs">
      <ChangeCase
        after={<SizeLadder />}
        afterNote="padding 8/12/12/16/20 · gap 4/6/8/8/8 · label 12/14/14/16/16 · glyph 14/16/16/20/20"
        before={<SizeLadder old />}
        beforeNote="padding 10 flat · gap 6 flat · label 12/14/14/14/14 · glyph 12/16/16/16/16"
        beforeSource={
          <>
            the published catalog's own class strings, reapplied through{' '}
            <Code>className</Code> — <Code>gap-1.5 px-2.5</Code> at every step,
            read out of <Code>git show upstream/master:…/Button/index.tsx</Code>
            . twMerge keeps the last class in a group, so the Before half is
            what the developer storybook renders today, not an approximation of
            it.
          </>
        }
        files={[
          'src/components/Button/index.tsx',
          'src/components/IconButton/index.tsx',
        ]}
        footnote={
          <>
            Only the height was on a ladder. Padding was <Code>px-2.5</Code> —
            10px — at all five steps, so a 44px control was as tight as a 28px
            one and neither sat on the 4px grid, which is why this survived the
            first pass: the heights were right. The ladder is the UX audit's, 8
            / 12 / 12 / 16 / 20, with 12 repeating at <Code>sm</Code> and{' '}
            <Code>md</Code> because those are the two steps the product actually
            uses — the sizes people see stay on one rail and only the rare large
            ones open up. A field follows it to <Code>md</Code> and then holds
            at 12: a button and an input of the same size share an edge at the
            three steps that matter, and above them the button opens out while
            the field does not.
            <br />
            <br />
            The other two ladders both plateau, and both plateaus are the point.
            The <strong className="font-medium text-ink-body">gap</strong> is 4
            / 6 / 8 / 8 / 8: the published package shipped a flat 6px, which was
            right at <Code>sm</Code> — the step the product uses most, where 8px
            reads loose against a 14px label — and wrong everywhere else. The{' '}
            <strong className="font-medium text-ink-body">glyph</strong> is 14 /
            16 / 16 / 20 / 20, repeating at both ends: 16 across <Code>sm</Code>{' '}
            and <Code>md</Code>, 20 across <Code>lg</Code> and <Code>xl</Code>.
            Nothing takes the kit's 24px <Code>--icon-xl</Code>: on a 44px
            control a glyph that size outgrows its box. The icon-only control
            had no glyph ladder at all — 16 at <Code>2xs</Code>, 12 at the{' '}
            <Code>xs</Code> one step above it — and now carries the same one as
            the text button.
          </>
        }
        n={40}
        title="A bigger button grew its box, not its label"
        why="lg and xl widened the control while the label stayed 14px and the glyph 16px, so a 44px xl read as an oversized md — a small label in a lot of air."
      />

      <ChangeCase
        after={<PasswordLadder />}
        afterNote="lock and eye 14 / 16 / 16 / 20 / 20"
        before={<PasswordLadder old />}
        beforeNote="lock 16 / 20 / 20 / 20 / 20 · eye 18 at every step"
        beforeSource={
          <>
            the live field with f69ebc9's sizes passed back through its own
            props — <Code>startAddonClassName</Code> carries the addon's old
            step, <Code>toggleButtonProps</Code> the toggle's hard-coded{' '}
            <Code>size="sm"</Code> and the eye's <Code>!size-[1.125rem]</Code>.
            Each is a literal from the developers' files; twMerge keeps the last
            class in a group. The glyph is today's: at rest f69ebc9 showed{' '}
            <Code>EyeOff</Code>, not <Code>Eye</Code>.
          </>
        }
        files={[
          'src/components/PasswordInput/index.tsx',
          'src/components/InputGroup/InputGroupAddon.tsx',
          'src/components/IconButton/index.tsx',
        ]}
        footnote={
          <>
            The size now goes to the toggle, not onto the glyph: a class on the
            icon loses to the addon's child rule one way and to the button's
            descendant rule the other. The ladder stops at 20, not the kit's 24
            — on a 44px field a 24px glyph outgrows its control. The bundle half
            of §44 — no <Code>svg</Code>-scoped class in the enumerated
            vocabulary — has nothing to draw here: Storybook compiles every
            class it finds.
          </>
        }
        n={44}
        title="The icon surface — a field's two glyphs on one ladder"
        why="The lock took the addon's step and the eye was pinned at 18px with !important, so the two ends of one field disagreed at every size — and 18 is on no ladder at all."
      />

      <ChangeCase
        after={<StrokeDemo />}
        afterNote="every glyph at 2 — the passed-in one too, and the menu rows"
        before={<StrokeDemo old />}
        beforeNote="Export at its own 1.5 · menu rows at 1.75"
        beforeSource={
          <>
            the live controls. The menu rows carry f69ebc9's own{' '}
            <Code>[&_svg]:stroke-[1.75]</Code>. On Export,{' '}
            <Code>[&_svg]:stroke-[1.5]</Code> stands in for no rule at all —
            f69ebc9 set none, so the glyph drew at the 1.5 it was passed with,
            and a class can be out-ranked through <Code>className</Code> but not
            taken off.
          </>
        }
        files={[
          'src/lib/utils.ts',
          'src/components/Button/index.tsx',
          'src/components/IconButton/index.tsx',
          'src/components/InputGroup/InputGroupAddon.tsx',
          'src/components/DropdownMenu/DropdownMenuItem.tsx',
          'src/components/Alert/index.tsx',
        ]}
        footnote={
          <>
            2 is what prod draws — Lucide's default in a 24 viewBox, at 16px and
            14px alike; 1.75 made the same mark 12% lighter. A CSS{' '}
            <Code>stroke-width</Code> beats the attribute, so{' '}
            <Code>glyphStroke</Code> also evens out a glyph from a set that does
            not default to 2. <Code>Checkbox</Code> keeps its own weight (§57).
          </>
        }
        n={92}
        title="Glyph stroke — one weight, set in CSS"
        why="The weight was left to whatever glyph was passed in, and menu rows drew at 1.75: one icon in a row came out lighter than its neighbours, and a menu lighter than the button that opened it."
      />
    </ChangePage>
  ),
};
