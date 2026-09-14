// Copied into the smoke consumer app by verify-consumer.mjs.
// Imports from node_modules + SSR render (catches missing deps / duplicate React).

import { Badge } from '@devart/ui-react/Badge';
import { Button } from '@devart/ui-react/Button';
import { Card } from '@devart/ui-react/Card';
import { cn } from '@devart/ui-react/cn';
import { Typography } from '@devart/ui-react/Typography';
import { BREAKPOINTS, useIsMobile } from '@devart/ui-react/use-mobile';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const PACKAGE_NAME = '@devart/ui-react';

const fail = (message, detail) => {
  console.error(`assert-imports: ${message}`);
  if (detail) console.error(detail);
  process.exit(1);
};

const { createRequire } = await import('node:module');
const require = createRequire(import.meta.url);
const { readdirSync } = await import('node:fs');
const path = await import('node:path');

const pkgJsonPath = require.resolve(`${PACKAGE_NAME}/package.json`);
const installRoot = path.dirname(pkgJsonPath);
const componentDir = path.join(installRoot, 'dist', 'components');

const subpaths = [
  ...readdirSync(componentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name),
  'cn',
  'use-mobile',
  'tailwind-preset',
];

const failures = [];
for (const subpath of subpaths) {
  try {
    const mod = await import(`${PACKAGE_NAME}/${subpath}`);
    if (Object.keys(mod).length === 0) {
      failures.push(`${subpath}: imported but exports nothing`);
    }
  } catch (error) {
    failures.push(`${subpath}: ${error.message}`);
  }
}

if (failures.length > 0) {
  fail(
    `${failures.length} of ${subpaths.length} entry points failed to import`,
    failures.map((line) => `  - ${line}`).join('\n')
  );
}
console.log(`${subpaths.length} entry points imported from node_modules`);

const { preset, contentGlobs } = await import(
  `${PACKAGE_NAME}/tailwind-preset`
);

if (!preset?.theme?.extend?.colors) {
  fail('tailwind-preset exported no theme.extend.colors');
}
if (!Array.isArray(contentGlobs) || contentGlobs.length === 0) {
  fail('tailwind-preset exported no contentGlobs');
}

// dist glob must resolve into the installed package (src/ is not shipped).
const distGlob = contentGlobs.find((glob) => glob.includes('/dist/'));
if (!distGlob || !distGlob.startsWith(installRoot.replace(/\\/g, '/'))) {
  fail(
    'contentGlobs does not resolve into the installed package',
    `installRoot: ${installRoot}\ncontentGlobs:\n${contentGlobs
      .map((glob) => `  - ${glob}`)
      .join('\n')}`
  );
}
console.log(`contentGlobs resolves into ${path.basename(installRoot)}/dist`);

function HookProbe() {
  const isMobile = useIsMobile(BREAKPOINTS.md);
  return h('span', { 'data-probe': 'use-mobile' }, String(isMobile));
}

let markup;
try {
  markup = renderToStaticMarkup(
    h(
      Card,
      { className: cn('shadow-thumb', 'bg-brand-primary/20') },
      h(Typography, { variant: 'h3' }, 'Smoke'),
      h(Badge, { variant: 'secondary' }, 'badge'),
      h(Button, { variant: 'primary' }, 'Press'),
      h(HookProbe, null)
    )
  );
} catch (error) {
  fail(
    'rendering threw — the classic symptom of a second React copy',
    error.stack ?? String(error)
  );
}

const markupChecks = [
  ['data-probe="use-mobile">false<', 'useIsMobile resolved its SSR snapshot'],
  ['shadow-thumb', 'cn() merged the consumer class through'],
  ['Press', 'Button rendered its children'],
];

for (const [needle, why] of markupChecks) {
  if (!markup.includes(needle)) {
    fail(
      `rendered markup is missing \`${needle}\` — ${why} did not hold`,
      markup
    );
  }
}

console.log('rendered Card/Typography/Badge/Button + useIsMobile');
