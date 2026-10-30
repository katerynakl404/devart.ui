/// <reference types="vite/client" />
/**
 * What the review section knows about itself, read at render time from the
 * files that own it — so no count on these pages is ever typed by hand.
 *
 * - the index table of `DESIGN-SYSTEM-CHANGES.md` (`## What changed`): every
 *   change, grouped the way the change log groups it;
 * - the `## Packages` table of `HANDOFF.md`: which § went to the developers;
 * - the source of every page in this folder: which § has a Before | After.
 */
import journalSource from '../DESIGN-SYSTEM-CHANGES.md?raw';
import handoffSource from '../HANDOFF.md?raw';

export interface JournalEntry {
  /** `57`, `6a` — the section number, without the §. */
  n: string;
  /** The index line, with `**new**` and the trailing marker taken off. */
  text: string;
  isNew: boolean;
  /**
   * A change to a component this package introduced — its row opens with a
   * `New —` section. There is no developers' version to set it against, so,
   * like a new component, it is reviewed in the catalog and not drawn here.
   */
  ofNewComponent: boolean;
  isDraft: boolean;
  isOpen: boolean;
}

export interface JournalGroup {
  /** The first column of the index — a component, or a heading such as `Tokens and colour`. */
  name: string;
  entries: JournalEntry[];
}

/**
 * Groups whose changes have nothing to render — build scripts, sync records.
 * They are counted in the change log and left out of "drawn".
 */
export const NOTHING_TO_RENDER = new Set([
  'Build and tooling',
  'Synced from upstream',
]);

function parseEntry(raw: string): JournalEntry | null {
  const match = /^§(\d+[a-z]?)\s+(.*)$/.exec(raw.trim());
  if (!match) return null;
  const [, n = '', rest = ''] = match;
  const isNew = /\*\*new\*\*/.test(rest);
  const isDraft = /·\s*draft\s*$/.test(rest);
  const isOpen = /·\s*open\s*$/.test(rest);
  const text = rest
    .replace(/\*\*new\*\*\s*—\s*/, '')
    .replace(/\s*·\s*(draft|open)\s*$/, '')
    .replace(/\*\*/g, '');
  return { n, text, isNew, ofNewComponent: false, isDraft, isOpen };
}

function parseJournal(source: string): JournalGroup[] {
  // The index marks some new components `**new**` and not others; the section
  // heading (`## 48. New — …`) is the one place every one of them is marked.
  const newSections = new Set(
    [...source.matchAll(/^## (\d+[a-z]?)\. New — /gm)].map((m) => m[1])
  );
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith('## What changed'));
  if (start < 0) return [];
  const groups: JournalGroup[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ') || line.startsWith('---')) break;
    const row = /^\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/.exec(line);
    if (!row) continue;
    const [, name = '', changes = ''] = row;
    if (name === 'Component' || /^-+$/.test(name)) continue;
    const entries = changes
      .split('<br>')
      .map(parseEntry)
      .filter((entry): entry is JournalEntry => entry !== null);
    for (const entry of entries) {
      if (newSections.has(entry.n)) entry.isNew = true;
    }
    const first = entries.reduce<JournalEntry | undefined>(
      (low, e) =>
        low && Number.parseInt(low.n, 10) < Number.parseInt(e.n, 10) ? low : e,
      undefined
    );
    if (first?.isNew) {
      for (const entry of entries) entry.ofNewComponent = !entry.isNew;
    }
    groups.push({ name: name.replace(/`/g, ''), entries });
  }
  return groups;
}

export interface HandoffPackage {
  id: string;
  status: string;
}

function parseHandoff(source: string): Map<string, HandoffPackage> {
  const byNumber = new Map<string, HandoffPackage>();
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith('## Packages'));
  if (start < 0) return byNumber;
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ')) break;
    const cells = line.split('|').map((cell) => cell.trim());
    const [, id = '', numbers = ''] = cells;
    if (!/^H-\d+$/.test(id)) continue;
    const pkg = { id, status: cells.at(-2) ?? '' };
    for (const [, n = ''] of numbers.matchAll(/§(\d+[a-z]?)/g)) {
      byNumber.set(n, pkg);
    }
  }
  return byNumber;
}

export interface ReviewPage {
  /** The Storybook title, `Proposed changes/Components/Checkbox`. */
  title: string;
  /** The index group the page answers for, from `<ChangePage group="…">`. */
  group?: string;
  /** Every § the page draws. */
  numbers: string[];
  /** Every § the page answers for with `<NoPanel>` — no Before exists to draw. */
  noPanel: string[];
  /** The Storybook story id of the page's one story, `Page`. */
  storyId: string;
}

/** Storybook's own id rule: lower-case, every run of punctuation one hyphen. */
function sanitize(part: string): string {
  return part
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePages(sources: Record<string, string>): ReviewPage[] {
  const pages: ReviewPage[] = [];
  for (const source of Object.values(sources)) {
    const title = /title: '([^']+)'/.exec(source)?.[1];
    if (!title) continue;
    const numbers = [
      ...source.matchAll(/\bn=\{(\d+)\}/g),
      ...source.matchAll(/\bn="(\d+[a-z]?)\b/g),
    ].map((m) => m[1] ?? '');
    const noPanel = [
      ...source.matchAll(
        /<NoPanel\b[\s\S]*?section=(?:\{(\d+)\}|"(\d+[a-z]?)")/g
      ),
    ].map((m) => m[1] ?? m[2] ?? '');
    pages.push({
      title,
      group: /group="([^"]+)"/.exec(source)?.[1],
      numbers,
      noPanel,
      storyId: `${sanitize(title)}--page`,
    });
  }
  return pages;
}

export const JOURNAL = parseJournal(journalSource);
export const HANDOFF = parseHandoff(handoffSource);
export const PAGES = parsePages(
  import.meta.glob<string>('./**/*.stories.tsx', {
    query: '?raw',
    import: 'default',
    eager: true,
  })
);

/** § → the page that draws it. */
export const DRAWN = new Map<string, ReviewPage>(
  PAGES.flatMap((page) => page.numbers.map((n) => [n, page] as const))
);

/** § → the page that says why it has no panel. */
export const NO_PANEL = new Map<string, ReviewPage>(
  PAGES.flatMap((page) => page.noPanel.map((n) => [n, page] as const))
);

/** The page that answers for an index group, if there is one yet. */
export function pageForGroup(group: string): ReviewPage | undefined {
  return PAGES.find((page) => page.group === group);
}

/**
 * A link that opens another story in the manager. The preview runs in an
 * iframe, so the link targets the top window and is built from the iframe's
 * own path — the same link works on localhost and on a deployed Storybook.
 */
export function storyHref(storyId: string): string {
  const base = window.location.pathname.replace(/iframe\.html$/, '');
  return `${base}?path=/story/${storyId}`;
}
