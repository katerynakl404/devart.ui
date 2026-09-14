#!/usr/bin/env node
// Merge-request gate: every change to the published surface must carry a
// changeset, and the declared bump must be at least what the diff implies.
//
// Runs in CI on merge_request_event (see `version_check` in .gitlab-ci.yml) and
// locally via `pnpm check-changeset` (base branch = `.changeset/config.json`).
//
// Exit codes: 0 = pass, 1 = missing/insufficient changeset (blocks the merge),
// 2 = the check itself could not run (no diff base, bad changeset frontmatter).

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const PACKAGE_NAME = '@devart/ui-react';
const RANK = { none: 0, patch: 1, minor: 2, major: 3 };

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const repoRoot = git('rev-parse', '--show-toplevel').trim();
const changesetConfig = JSON.parse(
  readFileSync(path.join(repoRoot, '.changeset', 'config.json'), 'utf8')
);

/** Paths that never reach a consumer — a change here needs no changeset. */
const IGNORED = [
  /^\.changeset\//,
  /^\.gitlab-ci\.yml$/,
  /^\.storybook\//,
  /^\.vscode\//,
  /^dist\//,
  /^scripts\//,
  /^storybook-static\//,
  /\.md$/,
  /\.stories\.tsx?$/,
  /\.test\.tsx?$/,
  /^biome\.json$/,
  /^vitest\.config\.ts$/,
  /^tailwind\.config\.ts$/,
  /^tsconfig(\..+)?\.json$/,
  /^\.gitignore$/,
  /^\.npmignore$/,
  /^css-modules\.d\.ts$/,
];

/** Public entry points: a removed `export` here is a breaking change. */
const PUBLIC_SURFACE = [
  /^src\/components\/[^/]+\/index\.tsx$/,
  /^src\/hooks\/use-mobile\.tsx$/,
  /^src\/lib\/utils\.ts$/,
  /^src\/tailwind-preset\.ts$/,
];

/** Token surface: consumers keep local copies, so drift is at least a minor. */
const TOKEN_SURFACE = [
  /^globals\.css$/,
  /^fonts\.css$/,
  /^src\/lib\/constants\.ts$/,
  /^src\/lib\/breakpoints\.ts$/,
];

const matches = (file, patterns) => patterns.some((p) => p.test(file));

function resolveBaseSha() {
  const fromMr = process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA;
  if (fromMr) return fromMr;

  const target =
    process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME ??
    changesetConfig.baseBranch;
  for (const ref of [`origin/${target}`, target]) {
    try {
      return git('merge-base', 'HEAD', ref).trim();
    } catch {}
  }
  return null;
}

/** Whether `file` was tracked at `sha` — `git cat-file -e` is the cheap probe. */
function fileExistsAt(sha, file) {
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}:${file}`], {
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

function changedFiles(baseSha) {
  return git('diff', '--name-status', '-M', `${baseSha}...HEAD`)
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, ...paths] = line.split('\t');
      // Rename/copy statuses carry both the old and the new path.
      return { status: status[0], file: paths.at(-1), from: paths[0] };
    });
}

/** Bump implied by the diff, plus the reasons, so the failure is actionable. */
function requiredBump(baseSha, entries) {
  let bump = 'none';
  const reasons = [];
  const raise = (level, reason) => {
    if (RANK[level] > RANK[bump]) bump = level;
    reasons.push(`${level}: ${reason}`);
  };

  const relevant = entries.filter(({ file }) => !matches(file, IGNORED));

  for (const { status, file, from } of relevant) {
    const isPublic =
      matches(file, PUBLIC_SURFACE) || matches(from, PUBLIC_SURFACE);

    if (status === 'D' && isPublic) {
      raise('major', `public entry point removed (${from})`);
      continue;
    }
    if (status === 'R' && matches(from, PUBLIC_SURFACE)) {
      raise('major', `public entry point renamed (${from} → ${file})`);
      continue;
    }
    if (status === 'A' && matches(file, PUBLIC_SURFACE)) {
      raise('minor', `new public entry point (${file})`);
      continue;
    }

    if (isPublic) {
      const diff = git('diff', '-U0', `${baseSha}...HEAD`, '--', file);
      const removedExports = diff
        .split('\n')
        .filter(
          (l) =>
            l.startsWith('-') && !l.startsWith('---') && /\bexport\b/.test(l)
        );
      if (removedExports.length > 0) {
        raise('major', `export removed or changed in ${file}`);
      } else if (/^\+.*\bexport\b/m.test(diff)) {
        raise('minor', `export added in ${file}`);
      } else {
        raise('patch', `implementation change in ${file}`);
      }
      continue;
    }

    if (matches(file, TOKEN_SURFACE)) {
      raise('minor', `token surface changed (${file})`);
      continue;
    }

    if (file === 'package.json') {
      const diff = git(
        'diff',
        '-U0',
        `${baseSha}...HEAD`,
        '--',
        'package.json'
      );
      if (
        /^[-+]\s*"(peerDependencies|exports|publishConfig|engines)"/m.test(diff)
      ) {
        raise('major', 'peer contract or export map changed in package.json');
      } else if (/^-\s*"[^"]+":\s*"[^"]*"/m.test(diff)) {
        raise('minor', 'dependency removed or narrowed in package.json');
      } else {
        raise('patch', 'package.json metadata changed');
      }
      continue;
    }

    raise('patch', `package source changed (${file})`);
  }

  return { bump, reasons };
}

/** Bump declared for this package by any changeset present on the branch. */
function declaredBump() {
  const dir = path.join(repoRoot, '.changeset');
  let bump = 'none';
  const files = [];

  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.md') || name === 'README.md') continue;

    const source = readFileSync(path.join(dir, name), 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) {
      console.error(
        `[check-changeset] .changeset/${name} has no frontmatter block.`
      );
      process.exit(2);
    }

    for (const line of frontmatter[1].split('\n')) {
      const entry = line.match(
        /^\s*['"]?(@?[^'":]+)['"]?\s*:\s*(patch|minor|major)\s*$/
      );
      if (!entry) continue;
      if (entry[1].trim() !== PACKAGE_NAME) continue;
      if (RANK[entry[2]] > RANK[bump]) bump = entry[2];
      files.push(`${name} (${entry[2]})`);
    }
  }

  return { bump, files };
}

/** Highest-severity reasons first, capped — a 200-file diff must stay readable. */
function summarize(reasons, limit = 12) {
  const sorted = [...reasons].sort(
    (a, b) => RANK[b.split(':')[0]] - RANK[a.split(':')[0]]
  );
  const shown = sorted.slice(0, limit).map((r) => `  - ${r}`);
  if (sorted.length > limit)
    shown.push(`  - …and ${sorted.length - limit} more`);
  return shown;
}

function fail(lines) {
  console.error(`\n${'='.repeat(72)}`);
  console.error('WARNING — merge blocked: package version bump is missing.');
  console.error('='.repeat(72));
  for (const line of lines) console.error(line);
  console.error('');
  console.error(
    'Fix: run `pnpm changeset`, pick the bump, commit the generated'
  );
  console.error(
    '`.changeset/*.md` file and push. See CONTRIBUTING.md → Versioning.'
  );
  console.error(`${'='.repeat(72)}\n`);
  process.exit(1);
}

const baseSha = resolveBaseSha();
if (!baseSha) {
  console.error(
    '[check-changeset] cannot resolve a diff base. In CI set GIT_DEPTH: 0; locally fetch the base branch.'
  );
  process.exit(2);
}

// Initial release: no package.json on base → skip (else gate would demand major).
if (!fileExistsAt(baseSha, 'package.json')) {
  const { version } = JSON.parse(
    readFileSync(path.join(repoRoot, 'package.json'), 'utf8')
  );
  console.log(
    `[check-changeset] ${PACKAGE_NAME} does not exist at the diff base — ` +
      `treating this as the initial release of ${version}. No changeset ` +
      'applies until a version has been published to compare against.'
  );
  process.exit(0);
}

const entries = changedFiles(baseSha);
const { bump: required, reasons } = requiredBump(baseSha, entries);

if (required === 'none') {
  console.log(
    `[check-changeset] no published-surface changes in ${entries.length} changed file(s) — no changeset needed.`
  );
  process.exit(0);
}

const { bump: declared, files } = declaredBump();

console.log(`[check-changeset] required bump: ${required}`);
console.log(`[check-changeset] declared bump: ${declared}`);

if (declared === 'none') {
  fail([
    `This MR changes the published surface of ${PACKAGE_NAME} and needs a`,
    `changeset with at least a \`${required}\` bump. None was found in .changeset/.`,
    '',
    'Detected changes:',
    ...summarize(reasons),
  ]);
}

if (RANK[declared] < RANK[required]) {
  fail([
    `Declared bump \`${declared}\` is lower than the \`${required}\` this diff requires.`,
    '',
    `Changesets found: ${files.join(', ')}`,
    '',
    'Detected changes:',
    ...summarize(reasons),
  ]);
}

for (const reason of summarize(reasons)) console.log(reason);

const versionTouched = entries.some(({ file }) => file === 'package.json');
if (versionTouched) {
  const diff = git('diff', '-U0', `${baseSha}...HEAD`, '--', 'package.json');
  if (/^[-+]\s*"version":/m.test(diff)) {
    console.warn(
      '[check-changeset] warning: `version` in package.json was edited by hand. Changesets owns that field — `pnpm version-packages` will overwrite it.'
    );
  }
}

console.log(`[check-changeset] OK — \`${declared}\` changeset covers this MR.`);
