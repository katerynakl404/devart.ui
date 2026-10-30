import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cable, Layers, MessageSquare, Settings } from 'lucide-react';
import { Button } from '../../src/components/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../src/components/Sheet';
import { cn } from '../../src/lib/utils';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Sheet',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NAV = [
  { label: 'Connections', icon: <Cable /> },
  { label: 'Workspaces', icon: <Layers /> },
  { label: 'Chats', icon: <MessageSquare /> },
  { label: 'Settings', icon: <Settings /> },
];

/**
 * The sidebar's phone drawer: a left `Sheet`. It carries `.dark` itself, so
 * the edge is seen against a dark sheet whichever theme the page is in.
 */
function Drawer({ className }: { className?: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="secondary">
          Open the drawer
        </Button>
      </SheetTrigger>
      <SheetContent className={cn('dark', className)} side="left">
        <SheetHeader>
          <SheetTitle>Data Analyze</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col gap-1">
          {NAV.map(({ label, icon }) => (
            <span
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-ink-body text-sm [&_svg]:size-4 [&_svg]:text-ink-icon"
              key={label}
            >
              {icon}
              {label}
            </span>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export const Page: Story = {
  name: 'Sheet',
  render: () => (
    <ChangePage group="Sheet" title="Sheet">
      <ChangeCase
        after={
          <TryIt action="Open the drawer, look down its right edge">
            <Drawer />
          </TryIt>
        }
        afterNote="border-stroke — the line every other edge uses"
        before={
          <TryIt action="Open the drawer, look down its right edge">
            <Drawer className="border-gray-200" />
          </TryIt>
        }
        beforeNote="an uncoloured border-r — Tailwind's grey-200, #E5E7EB"
        beforeSource={
          <>
            today's <Code>SheetContent</Code> with <Code>border-gray-200</Code>{' '}
            through <Code>className</Code>: the colour Tailwind's preflight
            gives a border nobody coloured, so the line is the old one exactly.
            Both drawers carry <Code>.dark</Code>, so the edge reads against a
            dark sheet in either page theme.
          </>
        }
        files={['src/components/Sheet/index.tsx']}
        footnote={
          <>
            The same holds for <Code>border-b</Code> on a top sheet and{' '}
            <Code>border-t</Code> on a bottom one; a right sheet draws no edge.
            The sidebar's phone drawer is a left <Code>Sheet</Code>, which is
            where it was first seen.
          </>
        }
        n={156}
        title="The edge in the system's line"
        why="The side's edge was drawn with no colour, so it took Tailwind's default grey-200 — on a dark sheet, a white stripe down its length."
      />
    </ChangePage>
  ),
};
