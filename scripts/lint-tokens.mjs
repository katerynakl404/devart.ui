#!/usr/bin/env node
// Dead-class gate: every token-backed utility written in `src/` must actually
// resolve to CSS.
//
// Tailwind never errors on a class that maps to no theme key — it silently
// emits nothing, so `bg-surface-crad` (or a token deleted from THEME_COLORS)
// ships as a missing colour with a green build and green tests. SPEC decision
// 10 names this as the accepted gap; this script closes it.
//
// How it works: Tailwind itself is the oracle. The CLI compiles `src/` exactly
// as the build does, so the generated CSS contains a rule for every *valid*
// candidate it found. Anything this script extracts that is missing from that
// CSS is dead.
//
// Runs in CI (`lint_tokens` in .gitlab-ci.yml) and locally via
// `pnpm lint:tokens`.
//
// Exit codes: 0 = pass, 1 = dead classes found, 2 = the check could not run.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

/**
 * Utility families whose values come from the design tokens. A typo here is
 * invisible at build time, which is the whole reason this gate exists.
 * Prefixes outside this list (layout, flex, spacing) fail loudly enough on
 * their own and would only add false positives.
 */
const TOKEN_PREFIXES = [
  'bg-',
  'text-',
  'border-',
  'ring-',
  'ring-offset-',
  'fill-',
  'stroke-',
  'outline-',
  'decoration-',
  'divide-',
  'placeholder-',
  'caret-',
  'accent-',
  'from-',
  'via-',
  'to-',
  'shadow-',
  'rounded-',
  'font-',
  'leading-',
  'tracking-',
  'duration-',
  'opacity-',
];

const die = (message) => {
  console.error(`lint-tokens: ${message}`);
  process.exit(2);
};

/**
 * `src/lib` holds the token *definitions* — `THEME_COLORS` keys and the
 * `twMerge` class-group names read like classes but are never rendered, so
 * scanning them would report every token as dead.
 */
const SKIPPED_DIRS = new Set([path.join('src', 'lib')]);

/**
 * Tests render nothing, and their prose is full of words that look like
 * utilities — a case named "matches accent-insensitively" reads as an
 * `accent-` class and would be reported as dead. Stories stay in scope: they do
 * render, and they are where a designer's class edits land.
 */
const SKIPPED_FILE = /\.(test|spec)\.tsx?$/;

/** Every `.ts`/`.tsx` under `src/` — the same set `tailwind.config.ts` scans. */
const sourceFiles = (dir) => {
  const out = [];
  if (SKIPPED_DIRS.has(path.relative(repoRoot, dir))) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name) && !SKIPPED_FILE.test(entry.name))
      out.push(full);
  }
  return out;
};

/**
 * Class candidates live in string literals only. Reading comments too would
 * report stale token names mentioned in prose (`// was bg-card`) as errors.
 *
 * The literals come from the TypeScript parser, not a regex: a regex cannot
 * tell a comment from code, so an apostrophe in prose (`kit's`) or a
 * backticked name in a doc comment (`bg-*`) opened a "string" that ran on
 * through the comment and reported its words as dead classes.
 */
const ts = require('typescript');

const STRING_KINDS = new Set([
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateExpression,
]);

/** Every string literal in a file, as `{ body, start }` with `start` at the first character inside the quotes. */
const stringLiterals = (file, text) => {
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const out = [];
  const visit = (node) => {
    // A quoted object key (`'border-radius': …` in a plugin's CSS object) is a
    // CSS property name, never a class.
    const isKey =
      node.parent &&
      ts.isPropertyAssignment(node.parent) &&
      node.parent.name === node;
    if (STRING_KINDS.has(node.kind) && !isKey) {
      const start = node.getStart(source);
      // The raw source text, holes included, so a template keeps its `${`
      // markers and the offsets below stay true to the file.
      out.push({ body: text.slice(start + 1, node.end - 1), start: start + 1 });
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
};

/** Splits on `:` outside `[]`, `()` and `{}` so arbitrary values stay intact. */
const baseUtility = (token) => {
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i++) {
    const ch = token[i];
    if (ch === '[' || ch === '(' || ch === '{') depth++;
    else if (ch === ']' || ch === ')' || ch === '}') depth--;
    else if (ch === ':' && depth === 0) start = i + 1;
  }
  return token.slice(start).replace(/^!/, '').replace(/^-/, '');
};

const extractCandidates = (files) => {
  /** @type {Map<string, {file: string, line: number}>} */
  const found = new Map();

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const lineStarts = [0];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') lineStarts.push(i + 1);
    }
    const lineOf = (index) => {
      let lo = 0;
      let hi = lineStarts.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lineStarts[mid] <= index) lo = mid;
        else hi = mid - 1;
      }
      return lo + 1;
    };

    for (const { body, start } of stringLiterals(file, text)) {
      let offset = start;
      for (const token of body.split(/(\s+)/)) {
        const current = offset;
        offset += token.length;
        if (!token.trim()) continue;
        // A template hole means the class is assembled at runtime; Tailwind's
        // own extractor cannot see it either, so neither of us can judge it.
        if (token.includes('${') || token.includes('}')) continue;
        if (!TOKEN_PREFIXES.some((p) => baseUtility(token).startsWith(p)))
          continue;
        if (!found.has(token)) {
          found.set(token, {
            file: path.relative(repoRoot, file),
            line: lineOf(current),
          });
        }
      }
    }
  }
  return found;
};

/** Compiles `src/` through the real config and returns every class it emitted. */
const compiledClasses = () => {
  const cliPath = (() => {
    const pkgPath = require.resolve('tailwindcss/package.json');
    const bin = require(pkgPath).bin;
    const relative = typeof bin === 'string' ? bin : bin.tailwindcss;
    return path.join(path.dirname(pkgPath), relative);
  })();

  const workDir = mkdtempSync(path.join(tmpdir(), 'lint-tokens-'));
  const input = path.join(workDir, 'in.css');
  const output = path.join(workDir, 'out.css');
  writeFileSync(input, '@tailwind utilities;\n');

  try {
    execFileSync(
      process.execPath,
      [cliPath, '-c', 'tailwind.config.ts', '-i', input, '-o', output],
      { cwd: repoRoot, stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' }
    );
  } catch (error) {
    die(`tailwind CLI failed\n${error.stderr ?? error.message}`);
  }

  const css = readFileSync(output, 'utf8');
  if (css.length < 1000)
    die('tailwind produced almost no CSS — check the config');

  const classes = new Set();
  // Selector fragments: a `.`, then class-name chars, where `\x` is one escaped
  // character. `.hover\:bg-x:hover` yields `hover:bg-x`. Tailwind writes a
  // comma as the hex escape `\2c ` (digits plus one optional space), so a hex
  // escape is read first — otherwise every arbitrary value with a comma in it,
  // `bg-[color-mix(in_srgb,…)]`, would be reported as dead.
  const HEX_ESCAPE = /\\([0-9a-fA-F]{1,6}) ?/g;
  for (const match of css.matchAll(
    /\.((?:\\[0-9a-fA-F]{1,6} ?|\\.|[^\s.,:>+~()[\]{}'"])+)/g
  )) {
    classes.add(
      match[1]
        .replace(HEX_ESCAPE, (_, hex) =>
          String.fromCodePoint(parseInt(hex, 16))
        )
        .replace(/\\(.)/g, '$1')
    );
  }
  return classes;
};

/** Levenshtein, capped — only used to phrase the suggestion in the report. */
const distance = (a, b) => {
  if (Math.abs(a.length - b.length) > 4) return 99;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = row;
  }
  return prev[b.length];
};

const suggest = (token, valid) => {
  const base = baseUtility(token);
  let best = null;
  let bestScore = Math.min(4, Math.max(2, Math.ceil(base.length / 4)));
  for (const candidate of valid) {
    const other = baseUtility(candidate);
    if (other === base) continue;
    const score = distance(base, other);
    if (score <= bestScore) {
      bestScore = score;
      best = other;
    }
  }
  return best;
};

const main = () => {
  const candidates = extractCandidates(sourceFiles(path.join(repoRoot, 'src')));
  const valid = compiledClasses();
  const dead = [...candidates.entries()].filter(([token]) => !valid.has(token));

  if (dead.length === 0) {
    console.log(
      `lint-tokens: ${candidates.size} token classes checked, all resolve to CSS.`
    );
    return;
  }

  console.error(
    `lint-tokens: ${dead.length} class${dead.length === 1 ? '' : 'es'} generate no CSS.\n` +
      'Tailwind drops an unknown token silently — these render with no style.\n'
  );
  for (const [token, where] of dead.sort((a, b) =>
    a[1].file.localeCompare(b[1].file)
  )) {
    const hint = suggest(token, valid);
    console.error(
      `  ${where.file}:${where.line}\n    ${token}${hint ? `  → did you mean ${hint}?` : ''}`
    );
  }
  console.error(
    '\nValid token names live in src/lib/constants.ts (colours) and ' +
      'src/tailwind-preset.ts (radius, shadow, font, duration).'
  );
  process.exit(1);
};

main();
