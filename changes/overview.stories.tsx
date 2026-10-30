import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChangePage, Code, JournalText } from './Harness';
import {
  DRAWN,
  HANDOFF,
  JOURNAL,
  type JournalEntry,
  type JournalGroup,
  NO_PANEL,
  NOTHING_TO_RENDER,
  pageForGroup,
  storyHref,
} from './journal';

const meta = {
  title: 'Proposed changes/Overview',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Status = 'drawn' | 'missing' | 'no-before' | 'new' | 'not-visual';

function statusOf(group: JournalGroup, entry: JournalEntry): Status {
  if (entry.isNew || entry.ofNewComponent) return 'new';
  if (DRAWN.has(entry.n)) return 'drawn';
  if (NO_PANEL.has(entry.n)) return 'no-before';
  if (NOTHING_TO_RENDER.has(group.name)) return 'not-visual';
  return 'missing';
}

const STATUS_MARK: Record<Status, { className: string; label: string }> = {
  drawn: { className: 'bg-fb-green', label: 'drawn' },
  missing: {
    className: 'border-[1.5px] border-fb-attention',
    label: 'no panel yet',
  },
  'no-before': {
    className: 'border-[1.5px] border-stroke-field-hover',
    label: 'no Before to draw — the page says why',
  },
  new: {
    className: 'bg-brand-primary/40',
    label: 'new here — its own story, no Before',
  },
  'not-visual': { className: 'bg-stroke', label: 'nothing to render' },
};

/** `inline` drops the nudge that lines the dot up with a 20px text line. */
function Mark({ status, inline }: { status: Status; inline?: boolean }) {
  return (
    <span
      className={`${inline ? '' : 'mt-1.5'} inline-block size-2 shrink-0 rounded-full ${STATUS_MARK[status].className}`}
      title={STATUS_MARK[status].label}
    />
  );
}

function Link({ href, children }: { href: string; children: string }) {
  return (
    <a
      className="text-ink-highlight underline-offset-2 hover:underline"
      href={href}
      target="_top"
    >
      {children}
    </a>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-surface-card2 px-4 py-3">
      <span className="text-ink-secondary text-xs">{label}</span>
      <span className="font-semibold text-ink-primary text-xl tabular-nums">
        {value}
      </span>
    </div>
  );
}

function Group({ group }: { group: JournalGroup }) {
  const page = pageForGroup(group.name);
  const changes = group.entries.filter(
    (e) => !(e.isNew || e.ofNewComponent || NO_PANEL.has(e.n))
  );
  const drawn = changes.filter((e) => DRAWN.has(e.n));
  const visual = !NOTHING_TO_RENDER.has(group.name);
  const noBefore = group.entries.filter((e) => NO_PANEL.has(e.n)).length;
  const summary = [
    changes.length ? `${drawn.length} of ${changes.length} drawn` : '',
    noBefore ? `${noBefore} with no Before` : '',
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <section className="grid grid-cols-[200px_minmax(0,1fr)] gap-4 border-stroke border-t py-3">
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-ink-primary text-sm">
          {page ? (
            <Link href={storyHref(page.storyId)}>{group.name}</Link>
          ) : (
            group.name
          )}
        </span>
        <span className="text-ink-secondary text-xs tabular-nums">
          {visual ? summary || 'new only' : 'nothing to render'}
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {group.entries.map((entry) => {
          const pkg = HANDOFF.get(entry.n);
          return (
            <li className="flex gap-2 text-sm leading-5" key={entry.n}>
              <Mark status={statusOf(group, entry)} />
              <span className="w-10 shrink-0 text-ink-inactive tabular-nums">
                §{entry.n}
              </span>
              <span className="min-w-0 text-ink-body">
                {entry.isNew ? (
                  <span className="text-ink-secondary">new — </span>
                ) : null}
                <JournalText text={entry.text} />
                {entry.isDraft ? (
                  <span className="text-ink-secondary"> · draft</span>
                ) : null}
                {entry.isOpen ? (
                  <span className="text-ink-secondary"> · open</span>
                ) : null}
                {pkg ? (
                  <span className="text-ink-secondary"> · {pkg.id}</span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export const Page: Story = {
  name: 'Overview',
  render: () => {
    const entries = JOURNAL.flatMap((group) =>
      group.entries.map((entry) => ({ entry, status: statusOf(group, entry) }))
    );
    const count = (status: Status) =>
      entries.filter((e) => e.status === status).length;
    return (
      <ChangePage
        intro={
          <>
            Every change in <Code>DESIGN-SYSTEM-CHANGES.md</Code>, grouped the
            way its index groups them, and whether this section draws it as
            Before | After. Read from the change log, <Code>HANDOFF.md</Code>{' '}
            and the pages themselves each time the story renders — nothing on
            this page is typed by hand, so it cannot fall behind. How a Before
            half is made: <Code>changes/README.md</Code>.
          </>
        }
        title="Overview"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
          <Stat label="In the change log" value={entries.length} />
          <Stat label="Drawn" value={count('drawn')} />
          <Stat label="No panel yet" value={count('missing')} />
          <Stat label="No Before to draw" value={count('no-before')} />
          <Stat label="New here" value={count('new')} />
          <Stat label="Handed over" value={HANDOFF.size} />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-ink-secondary text-xs">
          {(Object.keys(STATUS_MARK) as Status[]).map((status) => (
            <span className="flex items-center gap-1.5" key={status}>
              <Mark inline status={status} />
              {STATUS_MARK[status].label}
            </span>
          ))}
        </div>

        <div className="flex flex-col">
          {JOURNAL.map((group) => (
            <Group group={group} key={group.name} />
          ))}
        </div>
      </ChangePage>
    );
  },
};
