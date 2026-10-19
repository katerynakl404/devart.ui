import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paperclip, Plug, Send, Sparkles, Workflow } from 'lucide-react';
import { IconButton } from '../IconButton';
import { Spotlight } from '../Spotlight';
import { Annotation, AnnotationGroup } from './index';

/** A composer row whose controls the labels point at. */
function Composer() {
  return (
    <div className="flex h-72 items-start justify-center pt-16">
      <div
        data-demo="composer"
        className="flex w-[34rem] items-center gap-1 rounded-xl border border-stroke bg-surface-card p-2"
      >
        <IconButton
          data-demo="attach"
          variant="tertiary"
          size="sm"
          aria-label="Attach"
        >
          <Paperclip />
        </IconButton>
        <IconButton
          data-demo="connect"
          variant="tertiary"
          size="sm"
          aria-label="Connections"
        >
          <Plug />
        </IconButton>
        <span className="flex-1 px-2 text-ink-inactive text-sm">
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

/* the composer sits at top 64 and is ~49px tall; the labels go under it */
const LINE = 64 + 49 + 8 + 34;

/**
 * Labels that point at specific controls inside a lit area. Every label sits
 * on one line (`top`) and fans out from its target; a curved brand arrow runs
 * to a dashed ring around the control, concentric with it. Rings side by side
 * keep 6px apart. Hidden at 640px and below — a `Tour` lists the same texts in
 * its coachmark there.
 *
 * `Annotation` renders nothing on its own; the group reads its children.
 */
const meta = {
  title: 'Components/Annotation',
  component: AnnotationGroup,
  tags: ['autodocs'],
  args: { top: LINE },
  argTypes: {
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 320 } },
  },
} satisfies Meta<typeof AnnotationGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two labels under a lit composer — the way a tour step draws them. */
export const Default: Story = {
  render: (args) => (
    <>
      <Composer />
      <Spotlight target='[data-demo="composer"]' />
      <AnnotationGroup {...args}>
        <Annotation target='[data-demo="attach"]' icon={<Workflow />}>
          Choose a connector or <b>attach a file</b>
        </Annotation>
        <Annotation target='[data-demo="model"]' icon={<Sparkles />}>
          Pick a model and how deeply it thinks
        </Annotation>
      </AnnotationGroup>
    </>
  ),
};

/**
 * One label for two neighbouring controls (one ring round both), and two
 * labels for two touching controls — their rings split the gap, 6px apart.
 */
export const NeighbouringTargets: Story = {
  render: (args) => (
    <>
      <Composer />
      <AnnotationGroup {...args}>
        <Annotation target='[data-demo="attach"]'>Attach a file</Annotation>
        <Annotation target='[data-demo="connect"]'>
          Choose a connector
        </Annotation>
        <Annotation target={['[data-demo="model"]', '[data-demo="send"]']}>
          Pick a model, then send
        </Annotation>
      </AnnotationGroup>
    </>
  ),
};

/** `leaving` — the group fades out. */
export const Leaving: Story = {
  args: { leaving: true },
  render: Default.render,
};

/** Rings, arrows and labels on the dark theme. */
export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  render: Default.render,
};
