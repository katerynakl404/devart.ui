import type { Meta, StoryObj } from '@storybook/react-vite';
import { TriangleAlert } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../../src/components/Button';
import { LinkButton } from '../../src/components/LinkButton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../src/components/Popover';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Popover',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A panel held open beside its twin must not take focus from it. */
const keepFocus = (event: Event) => event.preventDefault();

/** What the connections prototype's popover carries. */
function ConnectionNote() {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-ink-primary">Finance warehouse</span>
      <span className="text-ink-secondary text-xs">
        PostgreSQL 16 · eu-central-1
      </span>
      <span className="flex items-center gap-1.5 text-ink-body text-xs">
        <TriangleAlert className="size-3.5 shrink-0 text-fb-attention" />2
        tables have no primary key
      </span>
    </div>
  );
}

/**
 * The live popover, held mounted while it is closed. Radix keeps
 * `data-state="open"` on a panel it has not been told to close; the button
 * writes `closed` onto the node instead, so the exit animation runs and the
 * panel then stays in the window between that animation's end and the unmount
 * — which is the window the change is about.
 */
function HeldClosed({ className }: { className?: string }) {
  const [closed, setClosed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    contentRef.current?.setAttribute('data-state', closed ? 'closed' : 'open');
  }, [closed]);

  return (
    <div className="h-40">
      <Popover open>
        <PopoverTrigger asChild>
          <Button
            onClick={() => setClosed((value) => !value)}
            size="sm"
            variant="secondary"
          >
            {closed ? 'Open it' : 'Close it'}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          avoidCollisions={false}
          className={className}
          onOpenAutoFocus={keepFocus}
          ref={contentRef}
          side="bottom"
        >
          <ConnectionNote />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const CATALOG = [
  ['Finance warehouse', '128 tables'],
  ['Sales replica', '64 tables'],
  ['Marketing lake', '212 tables'],
  ['HR archive', '19 tables'],
  ['Support desk', '41 tables'],
];

/** The catalog table the popover opens over, on the card it sits on. */
function OverCatalog({ className }: { className?: string }) {
  return (
    <div className="flex w-full flex-col">
      {CATALOG.map(([name, count], index) => (
        <div
          className="flex items-center justify-between gap-3 border-stroke border-b py-2 text-sm last:border-b-0"
          key={name}
        >
          {index === 0 ? (
            <Popover open>
              <PopoverTrigger asChild>
                <LinkButton tone="body">{name}</LinkButton>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                avoidCollisions={false}
                className={className}
                onOpenAutoFocus={keepFocus}
                side="bottom"
              >
                <ConnectionNote />
              </PopoverContent>
            </Popover>
          ) : (
            <span className="text-ink-body">{name}</span>
          )}
          <span className="text-ink-secondary tabular-nums">{count}</span>
        </div>
      ))}
    </div>
  );
}

export const Page: Story = {
  name: 'Popover',
  render: () => (
    <ChangePage group="Popover" title="Popover">
      <ChangeCase
        after={
          <TryIt action="Close it: one fades and stays gone">
            <HeldClosed />
          </TryIt>
        }
        afterNote="fill-mode-forwards — the faded end frame holds"
        before={
          <TryIt action="Close it: one fades, then comes back">
            <HeldClosed className="data-[state=closed]:fill-mode-none" />
          </TryIt>
        }
        beforeNote="no fill mode — snaps back to opacity 1 when the fade ends"
        beforeSource={
          <>
            today's <Code>PopoverContent</Code> with{' '}
            <Code>data-[state=closed]:fill-mode-none</Code> through{' '}
            <Code>className</Code>. <Code>cn</Code> drops the newer{' '}
            <Code>fill-mode-forwards</Code> for it, which leaves the closed
            state at the initial <Code>none</Code> — the old computed style
            exactly.
          </>
        }
        files={['src/components/Popover/PopoverContent.tsx']}
        footnote={
          <>
            Both panels are held mounted after they close, so the window between
            the end of the fade and Radix's unmount stays open long enough to
            see. Radix sets <Code>forwards</Code> inline itself at{' '}
            <Code>animationend</Code> but resets it on the next task, so on a
            light page the unmount usually wins the race; on the connections
            page it took over 700ms. The same pattern is on{' '}
            <Code>DropdownMenuContent</Code>, <Code>TooltipContent</Code> and{' '}
            <Code>SheetContent</Code>, left alone because nothing was reported
            there.
          </>
        }
        n={34}
        title="A closed panel stayed painted"
        why={
          <>
            The <Code>exit</Code> keyframe has only a <Code>to</Code> frame and
            nothing set a fill mode, so when the 150ms fade ended the panel
            snapped back to full opacity and stayed painted until the unmount —
            two panels on screen at once, one of them for a row already left.
          </>
        }
      />

      <ChangeCase
        after={
          <div className="h-48 w-full">
            <OverCatalog />
          </div>
        }
        afterNote="bg-surface-card — a panel above the card"
        before={
          <div className="h-48 w-full">
            <OverCatalog className="bg-surface-page" />
          </div>
        }
        beforeNote="bg-surface-page — a hole cut in the card"
        beforeSource={
          <>
            today's <Code>PopoverContent</Code> with the old{' '}
            <Code>bg-surface-page</Code> through <Code>className</Code>. Exact
            for the fill; the border and the shadow are today's on both sides.
          </>
        }
        files={['src/components/Popover/PopoverContent.tsx']}
        footnote={
          <>
            <Code>DropdownMenuContent</Code> has always been{' '}
            <Code>bg-surface-card</Code>: the same family of floating panel with
            the same elevation. One of them wearing the page colour was the
            defect, not the shade.
          </>
        }
        n={88}
        title="Floated on the page colour"
        why="Surface/Page is the colour the page is painted. Over a card — where most popovers open — a panel wearing it read as a hole cut in the card, and over the page only its hairline said where it began."
      />
    </ChangePage>
  ),
};
