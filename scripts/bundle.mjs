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
 *
 * 3. ONE AT A TIME. The chain is not re-entrant: every step writes the same
 *    `dist/`, the same `ds-bundle/` and the same `.design-sync/.cache/`, so two
 *    runs in one checkout interleave their output and neither reports anything
 *    wrong. It has happened with three at once — two plain, one `--storybook` —
 *    and what reached the prototype was a part of each. The lock below makes
 *    the second run refuse instead of joining in.
 */
import { execSync } from 'node:child_process';
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);

/* ── One run per checkout ───────────────────────────────────────────────
 *
 * `wx` is the whole mechanism: creating the file IS the test, in a single
 * syscall, so two runs starting in the same second cannot both pass it. What
 * the file HOLDS is only for the message — never for the decision.
 *
 * A lock left behind by a killed run must not block the checkout for ever, so a
 * lock whose process is gone is taken over rather than obeyed. `kill(pid, 0)`
 * sends no signal, it asks whether the pid exists; EPERM means it exists and
 * belongs to someone else, which still counts as running.
 */
const LOCK = join(ROOT, '.design-sync/.cache/bundle.lock');

const isRunning = (pid) => {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
};

function takeLock() {
  mkdirSync(dirname(LOCK), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const fd = openSync(LOCK, 'wx');
      writeFileSync(
        fd,
        JSON.stringify({
          pid: process.pid,
          started: new Date().toISOString(),
          argv,
        })
      );
      return fd;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;

      let held = {};
      try {
        held = JSON.parse(readFileSync(LOCK, 'utf8'));
      } catch {
        /* A lock written by a run that died mid-write says nothing about who
           holds it, and the pid check below then reads it as stale — the safe
           way round, because a live run is still protected by its own pid. */
      }

      if (isRunning(held.pid)) {
        process.stderr.write(
          [
            '',
            'ds-bundle: another bundle is already running in this checkout.',
            `  pid ${held.pid}, started ${held.started ?? 'unknown'}${
              held.argv?.length ? ` (${held.argv.join(' ')})` : ''
            }`,
            '  Every step writes the same dist/ and ds-bundle/, so a second run',
            '  interleaves with it and neither reports an error.',
            '  Wait for it to finish, or stop it and delete',
            `  ${LOCK}`,
            '',
          ].join('\n')
        );
        process.exit(1);
      }

      /* Stale, so the run that held it was killed — and step 3 leaves
         `dist/_ds-entry.*` behind. That file is not a source file, so the next
         `pnpm build` type-checks it against dist's own module resolution and
         fails with a page of TS2835 naming neither this script nor the kill.
         Clearing it here is the difference between "the last run was stopped"
         and "the checkout is broken". */
      process.stderr.write(
        `\nds-bundle: clearing a stale lock (pid ${held.pid ?? '?'} is gone)\n`
      );
      for (const leftover of [
        'dist/_ds-entry.js',
        'dist/_ds-entry.d.ts',
        'dist/_ds-entry.d.ts.map',
      ]) {
        rmSync(join(ROOT, leftover), { force: true });
      }
      unlinkSync(LOCK);
    }
  }
  throw new Error('ds-bundle: could not take the lock');
}

const lockFd = takeLock();

/* Released on every exit, including the ones that are not a return: `exit`
   covers a thrown error and `process.exit`, and the signals cover Ctrl-C and a
   harness stopping the run. Without them a cancelled build leaves a lock behind
   that only the pid check saves the next run from. */
let lockReleased = false;
const releaseLock = () => {
  if (lockReleased) return;
  lockReleased = true;
  try {
    closeSync(lockFd);
  } catch {
    /* already closed */
  }
  rmSync(LOCK, { force: true });
};
process.on('exit', releaseLock);
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
  process.on(signal, () => {
    releaseLock();
    process.exit(1);
  });
}

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

/**
 * Is the reference Storybook older than the source it is supposed to show?
 *
 * The roster check answers only "did the SET of components change". It cannot
 * see a story rewritten in place — and that is the bundle that validates clean
 * while showing last week's component. Everything downstream is derived from
 * this one index: the roster, the docs, the previews, the story sources. So
 * anything newer than it is a bundle that disagrees with the library.
 *
 * mtime, not a content hash: the question is only "was this built after that
 * was written", and a false positive costs one Storybook build.
 */
function referenceStale() {
  const idx = join(ROOT, '.design-sync/sb-reference/index.json');
  if (!existsSync(idx)) return 'nothing — there is no reference yet';
  const built = statSync(idx).mtimeMs;
  let newest = 0;
  let newestPath = null;
  const see = (full) => {
    const m = statSync(full).mtimeMs;
    if (m > newest) {
      newest = m;
      newestPath = full;
    }
  };
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'node_modules') walk(full);
      } else see(full);
    }
  };
  for (const entry of [
    'src',
    '.storybook',
    'changes',
    'globals.css',
    'fonts.css',
  ]) {
    const full = join(ROOT, entry);
    if (!existsSync(full)) continue;
    if (statSync(full).isDirectory()) walk(full);
    else see(full);
  }
  return newest > built ? relative(ROOT, newestPath) : false;
}

const bundled = bundledComponents();
const source = sourceComponents();
const missing =
  bundled === null ? source : source.filter((c) => !bundled.includes(c));
const removed =
  bundled === null ? [] : bundled.filter((c) => !source.includes(c));

const stale = referenceStale();

let storybook;
if (has('--no-storybook')) {
  storybook = false;
} else if (has('--storybook') || bundled === null) {
  storybook = true;
} else {
  storybook = missing.length > 0 || removed.length > 0 || stale !== false;
}

process.stderr.write(
  `ds-bundle: ${source.length} component directories in src/\n` +
    (bundled === null
      ? '  no existing bundle — Storybook build required\n'
      : `  bundle holds ${bundled.length}` +
        (missing.length ? `; NEW: ${missing.join(', ')}` : '') +
        (removed.length ? `; GONE: ${removed.join(', ')}` : '') +
        (missing.length || removed.length ? '\n' : ' — roster unchanged\n')) +
    (stale === false
      ? ''
      : `  reference is older than ${stale} — rebuild required\n`) +
    `  Storybook build: ${storybook ? 'yes' : 'skipped'}` +
    (storybook || has('--no-storybook')
      ? '\n'
      : ' (pass --storybook to force)\n')
);

if (
  has('--no-storybook') &&
  (missing.length || removed.length || stale !== false)
) {
  process.stderr.write(
    '\n  WARNING: the reference is out of date and you asked to skip Storybook.\n' +
      '  The roster, the docs and the previews all come from that index, so the\n' +
      '  bundle will be built against it — and it will NOT report an error.\n'
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
    // `-o` is why this is not `pnpm run build-storybook`: that script writes
    // to `storybook-static/`, while step 7 reads `.design-sync/sb-reference`.
    // Run one and the other keeps whatever roster it was last built with — a
    // bundle missing every component added since, reported as a clean build.
    'corepack pnpm exec storybook build -o .design-sync/sb-reference'
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
