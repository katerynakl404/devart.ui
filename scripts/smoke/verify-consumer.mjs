#!/usr/bin/env node
// Install the packed tarball into a fresh npm app and verify it as a consumer.
// CI: smoke_consumer. Local: `pnpm smoke`. Flags: --keep, --work <dir>.

import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_NAME = '@devart/ui-react';

// Exact pin so a duplicate React is structural, not a range coincidence.
const REACT_VERSION = '19.0.0';
const TAILWIND_VERSION = '3.4.17';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
);

const argv = process.argv.slice(2);
const keep = argv.includes('--keep');
const workFlag = argv.indexOf('--work');
const work =
  workFlag !== -1 && argv[workFlag + 1]
    ? path.resolve(argv[workFlag + 1])
    : mkdtempSync(path.join(tmpdir(), 'ui-smoke-'));

const app = path.join(work, 'app');

let stepNumber = 0;
const step = (label) => {
  stepNumber += 1;
  console.log(`\n[smoke ${stepNumber}] ${label}`);
};

function fail(message, detail) {
  console.error(`\nsmoke: FAILED — ${message}`);
  if (detail) console.error(detail);
  console.error(`\nWorkdir: ${work}${keep ? '' : ' (kept for inspection)'}`);
  process.exit(1);
}

/** `shell: true` finds npm.cmd / pnpm.cmd on Windows; args here are hardcoded. */
function run(cmd, args, { cwd = app, allowFailure = false } = {}) {
  const result = spawnSync(cmd, args, {
    cwd,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.error) {
    if (allowFailure) return { status: 1, stdout: '', stderr: '' };
    fail(`could not run \`${cmd} ${args.join(' ')}\``, result.error.message);
  }
  if (result.status !== 0 && !allowFailure) {
    fail(
      `\`${cmd} ${args.join(' ')}\` exited with ${result.status}`,
      `${result.stdout ?? ''}\n${result.stderr ?? ''}`
    );
  }
  return result;
}

step('packing the tarball');

if (!existsSync(path.join(repoRoot, 'dist'))) {
  fail('dist/ is missing — run `pnpm build` before `pnpm smoke`');
}

mkdirSync(work, { recursive: true });
const packDir = path.join(work, 'pkg');
mkdirSync(packDir, { recursive: true });

run('pnpm', ['pack', '--pack-destination', packDir], { cwd: repoRoot });

const tarball = readdirSync(packDir).find((file) => file.endsWith('.tgz'));
if (!tarball) fail(`pnpm pack produced no .tgz in ${packDir}`);
const tarballPath = path.join(packDir, tarball).replace(/\\/g, '/');
console.log(`  ${tarball}`);

step('generating the consumer project');
mkdirSync(path.join(app, 'src'), { recursive: true });

const write = (rel, contents) =>
  writeFileSync(path.join(app, rel), `${contents}\n`, 'utf8');

// Temp app is outside the repo — forward this project's registry so CI mirrors work.
const registry = (
  run('npm', ['config', 'get', 'registry'], {
    cwd: repoRoot,
    allowFailure: true,
  }).stdout || ''
)
  .trim()
  .split('\n')
  .pop();

if (registry?.startsWith('http')) {
  write('.npmrc', `registry=${registry}`);
  console.log(`  registry: ${registry}`);
} else {
  console.log('  registry: npm default (could not read `npm config get`)');
}

// npm (flat tree): surfaces duplicate React and missing dependency declarations.
write(
  'package.json',
  JSON.stringify(
    {
      name: 'ui-smoke-consumer',
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        'check-types': 'tsc --noEmit',
        'build:css':
          'tailwindcss -c tailwind.config.js -i src/index.css -o out/app.css',
        'build:app': 'vite build',
      },
      dependencies: {
        [PACKAGE_NAME]: `file:${tarballPath}`,
        react: REACT_VERSION,
        'react-dom': REACT_VERSION,
      },
      devDependencies: {
        '@types/react': '^19',
        '@types/react-dom': '^19',
        '@vitejs/plugin-react': '^4.5.0',
        autoprefixer: '^10.4.20',
        postcss: '^8.4.49',
        tailwindcss: TAILWIND_VERSION,
        typescript: '~5.9.3',
        vite: '^7.3.0',
      },
    },
    null,
    2
  )
);

write(
  'tsconfig.json',
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: false,
        noEmit: true,
      },
      include: ['src'],
    },
    null,
    2
  )
);

write(
  'tailwind.config.js',
  `import { contentGlobs, preset } from '${PACKAGE_NAME}/tailwind-preset';

export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}', ...contentGlobs],
};`
);

write(
  'postcss.config.js',
  'export default { plugins: { tailwindcss: {}, autoprefixer: {} } };'
);

write(
  'vite.config.js',
  `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: 'src/main.tsx' } },
});`
);

write(
  'src/index.css',
  `@tailwind base;
@tailwind components;
@tailwind utilities;

@import '${PACKAGE_NAME}/globals.css';`
);

write(
  'src/main.tsx',
  `import { Autocomplete } from '${PACKAGE_NAME}/Autocomplete';
import { Badge } from '${PACKAGE_NAME}/Badge';
import { Button } from '${PACKAGE_NAME}/Button';
import { Card } from '${PACKAGE_NAME}/Card';
import { cn } from '${PACKAGE_NAME}/cn';
import { Modal, ModalContent, ModalTrigger } from '${PACKAGE_NAME}/Modal';
import { SidebarProvider } from '${PACKAGE_NAME}/Sidebar';
import { Toaster, toast } from '${PACKAGE_NAME}/Toast';
import { Typography } from '${PACKAGE_NAME}/Typography';
import { BREAKPOINTS, useIsMobile } from '${PACKAGE_NAME}/use-mobile';
import { createRoot } from 'react-dom/client';
import './index.css';

interface Option {
  id: string;
  label: string;
}

const OPTIONS: Option[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
];

function App() {
  const isMobile = useIsMobile(BREAKPOINTS.md);

  return (
    <SidebarProvider>
      <Card className={cn('shadow-thumb bg-brand-primary/20', 'md:p-4')}>
        <Typography variant="h3">Smoke</Typography>
        <Badge variant="secondary" className="text-xxs">
          {isMobile ? 'mobile' : 'desktop'}
        </Badge>
        <Button variant="primary" onClick={() => toast.success('ok')}>
          Press
        </Button>
        <Autocomplete<Option>
          options={OPTIONS}
          getOptionLabel={(option) => option.label}
        />
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Open</Button>
          </ModalTrigger>
          <ModalContent>Body</ModalContent>
        </Modal>
      </Card>
      <Toaster />
    </SidebarProvider>
  );
}

const host = document.getElementById('root');
if (host) createRoot(host).render(<App />);`
);

cpSync(
  path.join(repoRoot, 'scripts', 'smoke', 'assert-imports.mjs'),
  path.join(app, 'assert-imports.mjs')
);

step('installing (npm, flat tree, pinned React)');
run('npm', ['install', '--no-audit', '--no-fund', '--loglevel', 'error']);

step('asserting a single React copy');
for (const dep of ['react', 'react-dom']) {
  const { stdout } = run('npm', ['ls', dep, '--json', '--all'], {
    allowFailure: true,
  });

  const versions = new Set();
  const walk = (node) => {
    for (const [name, child] of Object.entries(node.dependencies ?? {})) {
      if (name === dep && child.version) versions.add(child.version);
      walk(child);
    }
  };
  try {
    walk(JSON.parse(stdout));
  } catch {
    fail(`could not parse \`npm ls ${dep} --json\``, stdout);
  }

  const found = [...versions];
  if (found.length !== 1) {
    fail(
      `expected exactly one ${dep}, found ${found.length}: ${found.join(', ')}`,
      'A second copy nested under a dependency makes every hook-using ' +
        'component throw "Invalid hook call" for the consumer.'
    );
  }
  if (found[0] !== REACT_VERSION) {
    fail(`expected ${dep}@${REACT_VERSION}, resolved ${found[0]}`);
  }
  console.log(`  ${dep}@${found[0]} (1 copy)`);
}

step('importing every entry point and rendering');
const assertImports = run('node', ['assert-imports.mjs']);
console.log(
  assertImports.stdout
    .trim()
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')
);

step('type-checking with skipLibCheck: false');
run('npm', ['run', '--silent', 'check-types']);
console.log('  tsc --noEmit clean against the shipped .d.ts');

step('building CSS and asserting generated classes');
run('npm', ['run', '--silent', 'build:css']);
const css = readFileSync(path.join(app, 'out', 'app.css'), 'utf8');

const cssChecks = [
  ['.shadow-thumb', 'theme.extend.boxShadow'],
  ['.text-xxs', 'theme.extend.fontSize'],
  ['@media (min-width: 768px)', 'theme.extend.screens from BREAKPOINTS'],
  ['--breakpoint-md', 'the base-layer plugin publishing --breakpoint-*'],
  // Only in Button recipe — proves contentGlobs scanned installed dist.
  ['bg-btn-primary-bg-press', 'contentGlobs scanning the installed dist'],
];

for (const [needle, why] of cssChecks) {
  if (css.includes(needle)) {
    console.log(`  ok  ${needle}  (${why})`);
    continue;
  }
  fail(
    `generated CSS is missing \`${needle}\` — ${why} did not take effect`,
    needle === 'bg-btn-primary-bg-press'
      ? 'Tailwind did not scan the installed package. Check that ' +
          'contentGlobs resolves against node_modules and that nothing ' +
          'excludes node_modules from `content`.'
      : `out/app.css is ${css.length} bytes.`
  );
}

step('bundling with Vite');
run('npm', ['run', '--silent', 'build:app']);
console.log('  vite build resolved every import from dist');

if (keep) console.log(`\nWorkdir kept at ${work}`);
else rmSync(work, { recursive: true, force: true });

console.log(
  `\nsmoke: ok — tarball installs standalone, single React@${REACT_VERSION}, ` +
    'types check with skipLibCheck:false, contentGlobs reaches the installed ' +
    'dist, and Vite bundles it.'
);
