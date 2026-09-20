/**
 * Fails when a component exports something no story renders.
 *
 * Storybook is this package's only verification surface (SPEC.md, decision 10),
 * and a story is a hand-written file: nothing links it to the component it
 * documents. So a part can be added, exported and shipped while the catalog
 * still shows the recipe it replaced — which is exactly how `InputGroupAction`
 * lived in the package while `InputGroup.stories.tsx` kept demonstrating an
 * `IconButton`, and how a whole component (`DataSourceCard`) arrived with no
 * story at all. Neither produced an error anywhere.
 *
 * The check is deliberately shallow — it asks only whether the exported name
 * appears in the component's own stories. That is enough to catch "nobody
 * opened the story file", which is the failure this exists for.
 *
 * Run: `pnpm check-stories`
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(packageRoot, 'src/components');

/**
 * Parts that render nothing on their own, so a story cannot show them: Radix
 * portals and overlays, context objects, and the internal fallbacks. They are
 * still exported, and still covered indirectly by the stories of the part that
 * mounts them.
 */
const NOT_RENDERABLE = new Set([
  'DialogTitleFallback',
  'DropdownMenuPortal',
  'DropdownMenuSub',
  'DropdownMenuSubContent',
  'ModalOverlay',
  'ModalPortal',
  'PopoverAnchor',
  'PortalContainerContext',
  'PortalContainerProvider',
  'SheetOverlay',
  'SheetPortal',
  'TooltipProvider',
]);

const failures = [];

for (const dir of readdirSync(componentsDir).sort()) {
  const entry = join(componentsDir, dir, 'index.tsx');
  if (!existsSync(entry)) continue;

  const source = readFileSync(entry, 'utf8');
  const exported = new Set();
  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of match[1].split(',')) {
      const raw = part.trim();
      if (!raw || raw.startsWith('type ')) continue;
      const name = raw
        .split(/\s+as\s+/)
        .pop()
        .trim();
      if (/^[A-Z][A-Za-z0-9]*$/.test(name)) exported.add(name);
    }
  }
  for (const match of source.matchAll(
    /export\s+(?:function|const)\s+([A-Z][A-Za-z0-9]*)/g
  )) {
    exported.add(match[1]);
  }

  const stories = readdirSync(join(componentsDir, dir))
    .filter((file) => file.endsWith('.stories.tsx'))
    .map((file) => readFileSync(join(componentsDir, dir, file), 'utf8'))
    .join('\n');

  // A compound component is reachable both ways — `MetaRowCount` and
  // `MetaRow.Count` — and stories usually write the second. Accept either, or
  // every dot-notation catalog page reads as uncovered.
  const isRendered = (name) => {
    if (stories.includes(name)) return true;
    if (name.startsWith(dir) && name.length > dir.length) {
      return stories.includes(`${dir}.${name.slice(dir.length)}`);
    }
    return false;
  };

  const missing = [...exported]
    .filter((name) => !NOT_RENDERABLE.has(name))
    .filter((name) => !isRendered(name));

  if (missing.length) {
    failures.push({ dir, missing, noStories: stories === '' });
  }
}

if (failures.length === 0) {
  console.log('Story coverage: every exported part is rendered by a story.');
  process.exit(0);
}

console.error('Exported parts that no story renders:\n');
for (const { dir, missing, noStories } of failures) {
  const note = noStories ? '  (the component has no stories at all)' : '';
  console.error(`  ${dir}${note}`);
  for (const name of missing) console.error(`    - ${name}`);
}
console.error(
  `\n${failures.length} component(s). Add a story, or add the name to ` +
    'NOT_RENDERABLE in scripts/check-story-coverage.mjs with the reason.'
);
process.exit(1);
