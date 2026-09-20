import type { Meta, StoryObj } from '@storybook/react-vite';
import { Database, FileText, Search, Wrench } from 'lucide-react';
import { useState } from 'react';
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineStep,
} from './index';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  args: {
    defaultOpen: true,
  },
  argTypes: {
    open: { control: false },
    defaultOpen: { control: 'boolean' },
    onOpenChange: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mirrors the chat tool-execution timeline: a collapsible group of steps,
// each independently expandable to reveal its output.
export const Default: Story = {
  render: (args) => (
    <Timeline {...args} className="w-96">
      <TimelineHeader icon={<Wrench />}>Tool calls</TimelineHeader>
      <TimelineContent>
        <TimelineStep status="success" title="postgres-mcp · list_tables">
          Found 12 tables in schema public.
        </TimelineStep>
        <TimelineStep status="success" title="postgres-mcp · run_query">
          Returned 248 rows in 312ms.
        </TimelineStep>
        <TimelineStep status="error" title="files-mcp · read_file">
          File not found: q3-report.xlsx.
        </TimelineStep>
        <TimelineStep status="pending" title="semantics-mcp · define_metric" />
      </TimelineContent>
    </Timeline>
  ),
};

export const StepStatuses: Story = {
  render: (args) => (
    <Timeline {...args} className="w-96">
      <TimelineHeader icon={<Wrench />}>Step statuses</TimelineHeader>
      <TimelineContent>
        <TimelineStep status="pending" title="Waiting for connection" />
        <TimelineStep status="active" title="Fetching metric definitions" />
        <TimelineStep status="success" title="Validated 34 metrics" defaultOpen>
          All metrics passed schema validation.
        </TimelineStep>
        <TimelineStep status="error" title="Failed to publish catalog">
          Connection to the semantics service timed out.
        </TimelineStep>
      </TimelineContent>
    </Timeline>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Timeline {...args} open={open} onOpenChange={setOpen} className="w-96">
        <TimelineHeader icon={<Wrench />}>
          {open ? 'Hide tool calls' : 'Show tool calls'}
        </TimelineHeader>
        <TimelineContent>
          <TimelineStep status="success" title="chat-mcp · search_docs">
            Matched 6 relevant documents.
          </TimelineStep>
          <TimelineStep status="success" title="chat-mcp · summarize">
            Summary generated from 6 documents.
          </TimelineStep>
        </TimelineContent>
      </Timeline>
    );
  },
};

export const WithStepIcons: Story = {
  render: (args) => (
    <Timeline {...args} className="w-96">
      <TimelineHeader icon={<Wrench />}>Data lookup</TimelineHeader>
      <TimelineContent>
        <TimelineStep
          status="success"
          title="Query warehouse"
          icon={<Database />}
        >
          Pulled revenue by region for Q3.
        </TimelineStep>
        <TimelineStep status="success" title="Read file" icon={<FileText />}>
          Parsed budget-2026.csv, 1,204 rows.
        </TimelineStep>
        <TimelineStep
          status="active"
          title="Search knowledge base"
          icon={<Search />}
        />
      </TimelineContent>
    </Timeline>
  ),
};

// A single step used outside the Timeline/TimelineContent group wrapper.
export const StandaloneStep: Story = {
  render: () => (
    <TimelineStep
      status="success"
      title="mcp-server · get_schema"
      toggleLabel="Toggle step details"
      defaultOpen
      className="w-96"
    >
      Retrieved schema for 5 tables.
    </TimelineStep>
  ),
};

/**
 * Dark theme — every state the component ships, on one dark surface. Tokens
 * are pure CSS cascade, so a scoped `.dark` re-themes the whole subtree with
 * no provider and no props.
 */
export const DarkTheme = {
  render: (args, ctx) => {
    const cells: [string, Story][] = [
      ['Default', Default],
      ['Step Statuses', StepStatuses],
      ['Controlled', Controlled],
      ['With Step Icons', WithStepIcons],
      ['Standalone Step', StandaloneStep],
    ];
    return (
      <div className="dark grid gap-6 rounded-lg bg-surface-page p-6">
        {cells.map(([name, story]) => (
          <section className="flex flex-col gap-2" key={name}>
            <span className="font-medium text-ink-secondary text-xxs uppercase leading-4 tracking-caps">
              {name}
            </span>
            {story.render
              ? story.render({ ...args, ...story.args } as never, ctx)
              : null}
          </section>
        ))}
      </div>
    );
  },
} as Story;
