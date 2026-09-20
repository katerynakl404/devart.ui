/**
 * Builds `ds-bundle/` — the browser-ready copy of the library that the
 * prototypes consume (Insightis, AI Connectivity). One command instead of the
 * six-step chain it replaces.
 *
 *   pnpm bundle                 # the usual case
 *   pnpm bundle --storybook     # force the Storybook build
 *   pnpm bundle --no-storybook  # skip it even if the roster changed
 *
 * WHY THIS EXISTS, rather than everyone re-typing the chain:
 *
 * 1. A skipped step does not fail — it produces a wrong bundle that validates
 *    clean. Skipping the Storybook build once dropped `FilterChips` from a
 *    bundle that reported zero diagnostics, because the component roster is
 *    read from the Storybook index, not from `dist`.
 * 2. The order is load-bearing and silent when broken. `package-build` reads
 *    `dist`, so a source edit made after `pnpm build` has already run simply
 *    does not reach the bundle — no error, just a stale component.
 *
 * The roster check below is the speed win: the Storybook build is most of the
 * wall-clock, and it is only needed when the SET of components changed. Class
 * strings, tokens and props are picked up by `pnpm build` alone.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);

function run(label, cmd) {
  process.stderr.write(`\n── ${label}\n`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', env: process.env });
}

/**
 * What the roster WOULD contain, predicted from the source.
 *
 * Two things make this more than a directory listing, and getting either wrong
 * makes the comparison below fire on every run:
 *
 * - A directory with no story never reaches the roster at all, because the
 *   roster is the Storybook index. `PortalContainer` and `DialogTitleFallback`
 *   are shipped code with no story, so counting them means a permanent "NEW".
 * - The bundle renames some entries through `titleMap` — `Datepicker` ships as
 *   `SingleDatePicker`, `Resizable` as `ResizablePanelGroup`, `Toast` as
 *   `ToastMessage`. Comparing directory names against bundled names reports all
 *   three as new and all three as gone, simultaneously.
 */
function sourceComponents() {
  const cfg = JSON.parse(
    readFileSync(join(ROOT, '.design-sync/config.json'), 'utf8')
  );
  const titleMap = cfg.titleMap ?? {};
  const dir = join(ROOT, 'src/components');
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .filter((e) =>
      readdirSync(join(dir, e.name)).some((f) => f.includes('.stories.'))
    )
    .map((e) => titleMap[e.name] ?? e.name)
    .sort();
}

/**
 * Both halves of the bundle's roster. `Foundations` is one source directory but
 * four bundled entries (Colors, Radius, Shadows, Spacing) living under
 * `foundations/`, so reading only `components/` loses them — and `Foundations`
 * then reads as permanently new.
 */
function bundledComponents() {
  const base = join(ROOT, 'ds-bundle/components');
  if (!existsSync(join(base, 'components'))) return null; // no bundle yet
  const read = (sub) => {
    const d = join(base, sub);
    if (!existsSync(d)) return [];
    return readdirSync(d, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  };
  // A foundations page is not a component directory, so it is folded back to
  // the one source directory that produces all four.
  const foundations = read('foundations').length ? ['Foundations'] : [];
  return [...read('components'), ...foundations].sort();
}

const bundled = bundledComponents();
const source = sourceComponents();
const missing =
  bundled === null ? source : source.filter((c) => !bundled.includes(c));
const removed =
  bundled === null ? [] : bundled.filter((c) => !source.includes(c));

let storybook;
if (has('--no-storybook')) {
  storybook = false;
} else if (has('--storybook') || bundled === null) {
  storybook = true;
} else {
  storybook = missing.length > 0 || removed.length > 0;
}

process.stderr.write(
  `ds-bundle: ${source.length} component directories in src/\n` +
    (bundled === null
      ? '  no existing bundle — Storybook build required\n'
      : `  bundle holds ${bundled.length}` +
        (missing.length ? `; NEW: ${missing.join(', ')}` : '') +
        (removed.length ? `; GONE: ${removed.join(', ')}` : '') +
        (missing.length || removed.length ? '\n' : ' — roster unchanged\n')) +
    `  Storybook build: ${storybook ? 'yes' : 'skipped'}` +
    (storybook || has('--no-storybook')
      ? '\n'
      : ' (pass --storybook to force)\n')
);

if (has('--no-storybook') && (missing.length || removed.length)) {
  process.stderr.write(
    '\n  WARNING: the component set changed and you asked to skip Storybook.\n' +
      '  The roster comes from the Storybook index, so the bundle will be built\n' +
      '  against a stale one — and it will NOT report an error.\n'
  );
}

run(
  '1. tokens — ladders and contrast, both themes',
  'node .design-sync/theme-audit.mjs'
);
run('2. build — dist, gated by verify-dist', 'corepack pnpm run build');
run(
  '3. entry — re-exports every component',
  'node .design-sync/make-entry.mjs'
);
run(
  '4. classlist — every utility the components name',
  'node .design-sync/gen-classlist.mjs'
);
run(
  '5. css — compile those utilities',
  'corepack pnpm exec tailwindcss -c .design-sync/tailwind-export.config.ts ' +
    '-i .design-sync/tailwind-export.css -o .design-sync/.cache/ds-utilities.css --minify'
);
if (storybook) {
  run(
    '6. storybook — the component roster and previews',
    'corepack pnpm run build-storybook'
  );
}
run(
  `${storybook ? 7 : 6}. package — assemble ds-bundle/`,
  'node .ds-sync/package-build.mjs --config .design-sync/config.json ' +
    '--node-modules ./node_modules --entry ./dist/_ds-entry.js ' +
    '--storybook-static .design-sync/sb-reference --out ./ds-bundle'
);
run(
  `${storybook ? 8 : 7}. palette — resolved colours into the bundle`,
  'node .design-sync/gen-color-tokens.mjs'
);

// Last, because it compares the finished bundle against what the components
// ask for. This is the step that catches the failure mode nothing else does:
// a class the enumerated list missed renders in Storybook and does nothing on
// a page, with no error anywhere. Non-fatal — the bundle is usable, the report
// tells you which rules to add to gen-classlist.mjs.
process.stderr.write(
  `\n── ${storybook ? 9 : 8}. verify — every needed rule is shipped\n`
);
try {
  execSync('node scripts/check-bundle-css.mjs', {
    cwd: ROOT,
    stdio: 'inherit',
  });
} catch {
  process.exitCode = 1;
}

process.stderr.write('\nds-bundle: ready\n');
