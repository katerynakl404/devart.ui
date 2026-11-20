#!/usr/bin/env node
/**
 * Two-way sync audit: this library against the developers' `upstream/master`.
 *
 * It answers the four questions the handoff loop asks every time:
 *   1. What moved in `upstream` since the last audit, and which §s it can touch.
 *   2. Which of our files break their house rules — ours only, theirs subtracted.
 *   3. Where our comments are heavier than their code carries.
 *   4. Whether `DESIGN-SYSTEM-CHANGES.md`'s index and its sections still agree.
 *
 * State lives in `.sync-audit.json`, so a re-run reads only what changed:
 * files whose blob hash moved on either side. Full scan: `--full`.
 *
 *   node scripts/sync-audit.mjs            # delta since the stored state
 *   node scripts/sync-audit.mjs --full     # rescan everything
 *   node scripts/sync-audit.mjs --write    # store the result as the new baseline
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

const STATE = '.sync-audit.json';
const UPSTREAM = 'upstream/master';
const argv = new Set(process.argv.slice(2));
const FULL = argv.has('--full');
const WRITE = argv.has('--write');
const WHERE = argv.has('--where');

const sh = (cmd) => execSync(cmd, { encoding: 'utf8', maxBuffer: 5e8 }).trim();
const shQuiet = (cmd) => {
  try {
    return sh(cmd);
  } catch {
    return '';
  }
};

/* ------------------------------------------------------------------ rules */

const isPascal = (n) => /^[A-Z][A-Za-z0-9]*$/.test(n);
const isStr = (n) =>
  ts.isStringLiteral(n) ||
  ts.isNoSubstitutionTemplateLiteral(n) ||
  ts.isTemplateExpression(n);

/** `active:bg-x` → true; `data-[state=active]:x` → false. */
const hasActive = (text) =>
  text.split(/\s+/).some((token) => {
    let bare = token;
    while (/\[[^[\]]*\]/.test(bare)) bare = bare.replace(/\[[^[\]]*\]/g, '');
    return bare.split(':').slice(0, -1).includes('active');
  });

/** Tailwind-shaped tokens: no sentences, at least one `-` or `:`. */
const looksLikeClasses = (value) =>
  value.length > 0 &&
  /[-:]/.test(value) &&
  value.split(/\s+/).every((token) => /^[\w:/[\]().,%&>+*#-]+$/.test(token));

const containsJsx = (node) =>
  ts.isJsxElement(node) ||
  ts.isJsxSelfClosingElement(node) ||
  ts.isJsxFragment(node)
    ? true
    : (ts.forEachChild(node, containsJsx) ?? false);

/** The mechanical half of COMPONENT-RULES.md, counted in one file. */
function scanRules(name, text, sites) {
  const source = ts.createSourceFile(
    name,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const counts = {
    'conditional-class': 0,
    'class-map': 0,
    'type-literal-cast': 0,
    'active-variant': 0,
    'components-per-file': 0,
  };
  const seen = new Set();
  const note = (rule, node) => {
    if (!sites) return;
    const { line } = source.getLineAndCharacterOfPosition(node.getStart());
    sites.push({
      rule,
      line: line + 1,
      text: node.getText().replace(/\s+/g, ' ').slice(0, 110),
    });
  };

  const countConditional = (expression) => {
    let found = 0;
    const visit = (node) => {
      if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return;
      const hit =
        (ts.isConditionalExpression(node) &&
          (isStr(node.whenTrue) || isStr(node.whenFalse))) ||
        (ts.isBinaryExpression(node) &&
          node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
          isStr(node.right));
      if (hit && !seen.has(node)) {
        seen.add(node);
        note('conditional-class', node);
        found += 1;
      }
      ts.forEachChild(node, visit);
    };
    visit(expression);
    return found;
  };

  const walk = (node) => {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText() === 'className' &&
      node.initializer &&
      ts.isJsxExpression(node.initializer) &&
      node.initializer.expression
    ) {
      counts['conditional-class'] += countConditional(
        node.initializer.expression
      );
    }
    if (ts.isCallExpression(node) && node.expression.getText() === 'cn') {
      for (const argument of node.arguments)
        counts['conditional-class'] += countConditional(argument);
    }
    if (isStr(node) && hasActive(node.getText())) {
      counts['active-variant'] += 1;
      note('active-variant', node);
    }
    if (ts.isAsExpression(node) && ts.isTypeLiteralNode(node.type)) {
      counts['type-literal-cast'] += 1;
      note('type-literal-cast', node);
    }
    /* A `Record<_, string>` is a CLASS map only when it annotates a const
       whose values read as class strings — `Decls`, a theme-colour cast or any
       other string record is data, not styling. */
    if (
      ts.isVariableDeclaration(node) &&
      node.type &&
      ts.isTypeReferenceNode(node.type) &&
      node.type.typeName.getText() === 'Record' &&
      node.type.typeArguments?.length === 2 &&
      node.type.typeArguments[1].kind === ts.SyntaxKind.StringKeyword &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer) &&
      node.initializer.properties.length > 0 &&
      node.initializer.properties.every(
        (prop) =>
          ts.isPropertyAssignment(prop) &&
          isStr(prop.initializer) &&
          looksLikeClasses(prop.initializer.getText().slice(1, -1))
      )
    ) {
      counts['class-map'] += 1;
      note('class-map', node);
    }
    ts.forEachChild(node, walk);
  };
  walk(source);

  let components = 0;
  for (const statement of source.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      isPascal(statement.name.text) &&
      containsJsx(statement)
    ) {
      components += 1;
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const init = declaration.initializer;
        if (
          ts.isIdentifier(declaration.name) &&
          isPascal(declaration.name.text) &&
          init &&
          (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) &&
          containsJsx(init)
        ) {
          components += 1;
        }
      }
    }
  }
  counts['components-per-file'] = Math.max(0, components - 1);
  return counts;
}

/** Comment lines, and the markers their style keeps out of code. */
function scanComments(text) {
  let comment = 0;
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (/^(\/\/|\/\*|\*|\*\/)/.test(t)) comment += 1;
  }
  return {
    comment,
    lines: text.split('\n').length,
    sectionRefs: (text.match(/§\s?\d+/g) || []).length,
    dates: (text.match(/\b20\d\d-[01]\d-[0-3]\d\b/g) || []).length,
  };
}

/* ------------------------------------------------------------------- data */

const sourceFiles = sh('git ls-files src')
  .split('\n')
  .filter(
    (f) => /\.tsx?$/.test(f) && !/\.stories\.|__tests__|\.test\./.test(f)
  );

const theirFiles = new Map();
for (const line of sh(`git ls-tree -r ${UPSTREAM} -- src`).split('\n')) {
  const m = line.match(/^\d+ blob ([0-9a-f]+)\t(.+)$/);
  if (m) theirFiles.set(m[2], m[1]);
}
const ourHashes = new Map();
for (const line of sh('git ls-files -s src').split('\n')) {
  const m = line.match(/^\d+ ([0-9a-f]+) \d+\t(.+)$/);
  if (m) ourHashes.set(m[2], m[1]);
}
/* A file edited but not staged has a stale index hash — hash the worktree. */
for (const f of shQuiet('git diff --name-only -- src')
  .split('\n')
  .filter(Boolean)) {
  if (existsSync(f)) ourHashes.set(f, shQuiet(`git hash-object "${f}"`));
}

const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : null;
const upstreamSha = sh(`git rev-parse ${UPSTREAM}`);
const changedSide = (f) =>
  !prev?.files?.[f] ||
  prev.files[f].ours !== ourHashes.get(f) ||
  prev.files[f].theirs !== (theirFiles.get(f) ?? null);

const toScan = FULL || !prev ? sourceFiles : sourceFiles.filter(changedSide);

const files = {};
for (const f of sourceFiles) {
  if (!toScan.includes(f) && prev?.files?.[f]) {
    files[f] = prev.files[f];
    continue;
  }
  if (!existsSync(f)) continue;
  const ours = readFileSync(f, 'utf8');
  const sites = WHERE ? [] : undefined;
  const rules = scanRules(f, ours, sites);
  let base = {
    'conditional-class': 0,
    'class-map': 0,
    'type-literal-cast': 0,
    'active-variant': 0,
    'components-per-file': 0,
  };
  if (theirFiles.has(f)) base = scanRules(f, sh(`git show ${UPSTREAM}:${f}`));
  const delta = {};
  for (const [k, v] of Object.entries(rules))
    if (v - base[k] > 0) delta[k] = v - base[k];
  files[f] = {
    sites,
    ours: ourHashes.get(f) ?? null,
    theirs: theirFiles.get(f) ?? null,
    inUpstream: theirFiles.has(f),
    rules: delta,
    ...scanComments(ours),
  };
}

/* ------------------------------------------------------- the changes file */

const doc = readFileSync('DESIGN-SYSTEM-CHANGES.md', 'utf8').replace(/\r/g, '');
const indexStart = doc.indexOf('| Component | Changes |');
const indexBlock = doc.slice(
  indexStart,
  doc.indexOf('Retired numbers', indexStart)
);
const indexed = new Set(
  (indexBlock.match(/§\s?\d+/g) || []).map((s) => +s.replace(/\D/g, ''))
);
const sections = new Map();
{
  let component = '';
  for (const line of doc.split('\n')) {
    const h1 = line.match(/^# (.+)$/);
    if (h1) component = h1[1].replace(/`/g, '').trim();
    const h2 = line.match(/^## (\d+)\.\s*(.*)$/);
    if (h2) sections.set(+h2[1], { component, title: h2[2] });
  }
}

/* ----------------------------------------------------------------- report */

const out = [];
const say = (s = '') => out.push(s);

say(
  `upstream/master  ${upstreamSha.slice(0, 7)}   previous audit  ${prev ? prev.upstream.slice(0, 7) : '—'}`
);
say(
  `scanned ${toScan.length} of ${sourceFiles.length} source files${FULL ? ' (full)' : ''}`
);
say();

if (prev && prev.upstream !== upstreamSha) {
  const commits = shQuiet(`git log --oneline ${prev.upstream}..${upstreamSha}`);
  const touched = shQuiet(
    `git log --name-only --format= ${prev.upstream}..${upstreamSha} -- src globals.css`
  )
    .split('\n')
    .filter((l) => l && !/__tests__|\.stories\.|__snapshots__/.test(l));
  const uniq = [...new Set(touched)];
  say('THEY MOVED');
  say(commits || '(no commits)');
  say(`files: ${uniq.length}`);
  for (const f of uniq) say(`  ${f}`);
  const comps = new Set(uniq.map((f) => f.split('/')[2]).filter(Boolean));
  const hit = [...sections.entries()].filter(([, s]) =>
    comps.has(s.component.replace(/\W/g, ''))
  );
  if (hit.length) {
    say('§s to re-check against those files:');
    for (const [n, s] of hit)
      say(`  §${n} ${s.component} — ${s.title.slice(0, 64)}`);
  }
  say();
} else if (prev) {
  say('THEY MOVED: nothing since the last audit.');
  say();
}

const broken = Object.entries(files)
  .filter(([, v]) => Object.keys(v.rules).length)
  .map(([f, v]) => ({
    f,
    v,
    total: Object.values(v.rules).reduce((a, b) => a + b, 0),
  }))
  .sort((a, b) => b.total - a.total);
const totals = {};
for (const r of broken)
  for (const [k, n] of Object.entries(r.v.rules))
    totals[k] = (totals[k] || 0) + n;
say(
  'OUR HOUSE-RULE DEBT  (ours minus theirs, so inherited code does not count)'
);
say(JSON.stringify(totals));
for (const r of broken) {
  say(
    `  ${String(r.total).padStart(3)}  ${r.v.inUpstream ? '     ' : 'new  '}${r.f}  ${JSON.stringify(r.v.rules)}`
  );
  if (WHERE && r.v.sites)
    for (const s2 of r.v.sites)
      say(`         ${r.f}:${s2.line}  ${s2.rule}  ${s2.text}`);
}
if (prev) {
  const was = Object.entries(prev.files || {}).filter(
    ([, v]) => Object.keys(v.rules || {}).length
  ).length;
  say(`files with debt: ${broken.length} (was ${was})`);
}
say();

const markers = Object.entries(files).filter(
  ([, v]) => v.sectionRefs || v.dates
);
say('MARKERS THEIR STYLE KEEPS OUT OF CODE  (§ numbers, dates)');
for (const [f, v] of markers)
  say(`  ${f}  §×${v.sectionRefs}  dates×${v.dates}`);
say();

const heavy = Object.entries(files)
  .map(([f, v]) => ({ f, ...v, pct: Math.round((v.comment / v.lines) * 100) }))
  .filter((r) => r.comment >= 30 && r.pct >= 35)
  .sort((a, b) => b.comment - a.comment);
say(
  'COMMENT WEIGHT  (files at least a third comment — trimmed per component at handoff)'
);
for (const r of heavy)
  say(
    `  ${String(r.comment).padStart(4)}/${String(r.lines).padStart(4)}  ${String(r.pct).padStart(3)}%  ${r.f}`
  );
say();

const orphan = [...sections.keys()].filter((n) => !indexed.has(n));
const missing = [...indexed].filter((n) => !sections.has(n) && n > 21);
say('DESIGN-SYSTEM-CHANGES.md');
say(
  `  sections: ${sections.size}   indexed: ${[...indexed].filter((n) => sections.has(n)).length}`
);
if (orphan.length)
  say(`  written up, never indexed: ${orphan.map((n) => `§${n}`).join(' ')}`);
if (missing.length)
  say(`  indexed, no section: ${missing.map((n) => `§${n}`).join(' ')}`);
if (!orphan.length && !missing.length)
  say('  index and sections agree both ways.');

console.log(out.join('\n'));

if (WRITE) {
  writeFileSync(
    STATE,
    `${JSON.stringify({ audited: new Date().toISOString().slice(0, 10), upstream: upstreamSha, files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, { ...v, sites: undefined }])) }, null, 2)}\n`
  );
  console.log(`\n${STATE} written.`);
}
