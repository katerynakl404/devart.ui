import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paperclip, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { IconButton } from '../IconButton';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '../SegmentedControl';
import { Spotlight, useTargetRect } from './index';

/** A small screen to light: a stats card and a composer row. */
function DemoScreen() {
  return (
    <div data-demo="screen" className="flex flex-col gap-6 p-8">
      <Card data-demo="stats" className="w-[28rem]">
        <CardHeader>
          <CardTitle>Revenue this quarter</CardTitle>
        </CardHeader>
        <CardContent>$1.2M · up 12% on the last one</CardContent>
      </Card>
      <div
        data-demo="composer"
        className="flex w-[28rem] items-center gap-2 rounded-xl border border-stroke bg-surface-card p-2"
      >
        <IconButton
          data-demo="attach"
          variant="tertiary"
          size="sm"
          aria-label="Attach"
        >
          <Paperclip />
        </IconButton>
        <span className="flex-1 text-ink-inactive text-sm">
          Ask a question…
        </span>
        <IconButton
          data-demo="model"
          variant="tertiary"
          size="sm"
          aria-label="Model"
        >
          <Sparkles />
        </IconButton>
        <IconButton data-demo="send" size="sm" aria-label="Send">
          <Send />
        </IconButton>
      </div>
    </div>
  );
}

/**
 * Dims and blurs everything around one or more targets. The scrim is one
 * layer with a rounded hole, so the dim follows the ring's corners; the
 * cutout stays live. The ring is concentric with what it lights — the
 * target's own radius + `padding` — and glides to the next target.
 *
 * Fixed and portalled: each story renders in its own frame.
 */
const meta = {
  title: 'Compositions/Spotlight',
  component: Spotlight,
  tags: ['autodocs'],
  args: { target: '[data-demo="composer"]' },
  argTypes: {
    target: { control: false },
    rect: { control: false },
    bounds: { control: false },
    boundary: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 420 } },
  },
  render: (args) => (
    <>
      <DemoScreen />
      <Spotlight {...args} />
    </>
  ),
} satisfies Meta<typeof Spotlight>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One target: the composer, with its 12px corner + 8px padding = a 20px ring. */
export const Default: Story = {};

/** An array of targets is lit as one union. */
export const SeveralTargets: Story = {
  args: { target: ['[data-demo="attach"]', '[data-demo="model"]'] },
};

/** Nothing to light — the whole area dims, no ring. */
export const NothingLit: Story = {
  args: { target: null, rect: null },
};

/** `pulse={false}` — the ring holds still. */
export const NoPulse: Story = {
  args: { pulse: false },
};

/** `padding` and an explicit `radius`. */
export const PaddingAndRadius: Story = {
  args: { target: '[data-demo="stats"]', padding: 16, radius: 24 },
};

/**
 * `boundary` keeps the scrim inside one area, so the switcher above it stays
 * live. Switch targets to see the hole and the ring glide.
 */
export const Boundary: Story = {
  render: function Render(args) {
    const [target, setTarget] = useState('composer');
    return (
      <div className="flex flex-col">
        <div className="border-stroke border-b bg-surface-card p-3">
          <SegmentedControl value={target} onValueChange={setTarget}>
            <SegmentedControlList>
              <SegmentedControlTrigger value="stats">
                Stats
              </SegmentedControlTrigger>
              <SegmentedControlTrigger value="composer">
                Composer
              </SegmentedControlTrigger>
              <SegmentedControlTrigger value="send">
                Send
              </SegmentedControlTrigger>
            </SegmentedControlList>
          </SegmentedControl>
        </div>
        <DemoScreen />
        <Spotlight
          {...args}
          boundary='[data-demo="screen"]'
          target={`[data-demo="${target}"]`}
        />
      </div>
    );
  },
};

/** `useTargetRect` — measure once, light with `rect`; a click on the scrim is reported. */
export const MeasuredRect: Story = {
  render: function Render(args) {
    const { rect, bounds, radius } = useTargetRect('[data-demo="send"]', {
      padding: 6,
    });
    const [clicks, setClicks] = useState(0);
    return (
      <>
        <DemoScreen />
        <p className="px-8 text-ink-secondary text-sm">
          Scrim clicks: {clicks}
        </p>
        <Spotlight
          {...args}
          rect={rect}
          bounds={bounds}
          radius={radius}
          onScrimClick={() => setClicks((n) => n + 1)}
        />
      </>
    );
  },
};

/** `leaving` — the layer fades out and takes no clicks. */
export const Leaving: Story = {
  render: function Render(args) {
    const [leaving, setLeaving] = useState(false);
    return (
      <div className="flex flex-col">
        <div className="border-stroke border-b bg-surface-card p-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setLeaving((v) => !v)}
          >
            {leaving ? 'Show again' : 'Close'}
          </Button>
        </div>
        <DemoScreen />
        {/* re-mounted on reopen, so it fades in again */}
        <Spotlight
          key={String(leaving)}
          {...args}
          boundary='[data-demo="screen"]'
          leaving={leaving}
        />
      </div>
    );
  },
};

/** The ring, its halo and glow on the dark theme. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
};
