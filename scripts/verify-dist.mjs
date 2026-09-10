/**
 * Post-build gate for the published surface of @insightis/ui.
 *
 * Runs in a plain Node process on purpose: no bundler, no vitest, no aliases —
 * so it exercises the same resolver a consumer would use.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const distDir = path.join(packageRoot, 'dist');

/** @type {string[]} */
const failures = [];
const fail = (message) => failures.push(message);

const relToRoot = (absolute) =>
  path.relative(packageRoot, absolute).split(path.sep).join('/');

const pkg = JSON.parse(
  readFileSync(path.join(packageRoot, 'package.json'), 'utf8')
);
const pkgName = pkg.name;

if (!existsSync(distDir)) {
  console.error('verify-dist: dist/ does not exist — run the build first.');
  process.exit(1);
}

// 1. Published JS entries must load in Node. Components / cn / use-mobile go
//    through package.json "exports" (no "source" here → dist). The preset's
//    monorepo export points at src/ for Tailwind jiti, so its built artifact is
//    checked via dist/ directly; publishConfig still ships dist.
const componentsDir = path.join(distDir, 'components');
const componentNames = existsSync(componentsDir)
  ? readdirSync(componentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : [];

if (componentNames.length === 0) {
  fail('no component entry points found under dist/components');
}

const packageSubpaths = [...componentNames, 'cn', 'use-mobile'];
let importedCount = 0;

for (const subpath of packageSubpaths) {
  const specifier = `${pkgName}/${subpath}`;
  try {
    await import(specifier);
    importedCount += 1;
  } catch (error) {
    const stack = error instanceof Error ? error.stack : String(error);
    fail(`entry point failed to import: ${specifier}\n    ${stack}`);
  }
}

const presetDist = path.join(distDir, 'tailwind-preset.js');
if (!existsSync(presetDist)) {
  fail('entry point missing on disk: dist/tailwind-preset.js');
} else {
  try {
    await import(pathToFileURL(presetDist).href);
    importedCount += 1;
  } catch (error) {
    const stack = error instanceof Error ? error.stack : String(error);
    fail(`entry point failed to import: dist/tailwind-preset.js\n    ${stack}`);
  }
}

const presetExport = pkg.exports?.['./tailwind-preset'];
const presetSrcTarget =
  typeof presetExport === 'string'
    ? presetExport
    : (presetExport?.default ?? presetExport?.source);
if (typeof presetSrcTarget === 'string') {
  if (!existsSync(path.join(packageRoot, presetSrcTarget))) {
    fail(`exports["./tailwind-preset"] → ${presetSrcTarget} does not exist`);
  }
} else {
  fail('exports["./tailwind-preset"] is missing or malformed');
}

// 2. No unresolvable specifiers may survive into the emitted output.
const ALIAS_SPECIFIER = /['"]@\/[^'"]*['"]/;
const SELF_REFERENCE = /['"]@insightis\/ui(?:\/[^'"]*)?['"]/;

/** @param {string} dir @returns {string[]} */
const collectEmitted = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectEmitted(absolute);
    }
    return entry.name.endsWith('.js') || entry.name.endsWith('.d.ts')
      ? [absolute]
      : [];
  });

for (const file of collectEmitted(distDir)) {
  const contents = readFileSync(file, 'utf8');
  const alias = contents.match(ALIAS_SPECIFIER);
  if (alias) {
    fail(`${relToRoot(file)} still contains the "@/" alias: ${alias[0]}`);
  }
  const self = contents.match(SELF_REFERENCE);
  if (self) {
    fail(`${relToRoot(file)} self-references the package: ${self[0]}`);
  }
}

// 3. publishConfig.exports must mirror exports and point at files that exist.
const devExports = pkg.exports ?? {};
const publishExports = pkg.publishConfig?.exports;

if (!publishExports) {
  fail('package.json has no publishConfig.exports block');
} else {
  // A wildcard target is only checked against one real component.
  const WILDCARD_SAMPLE = 'Button';

  for (const key of Object.keys(devExports)) {
    if (!(key in publishExports)) {
      fail(`exports has "${key}" but publishConfig.exports does not`);
    }
  }

  for (const [key, value] of Object.entries(publishExports)) {
    if (!(key in devExports)) {
      fail(`publishConfig.exports has "${key}" but exports does not`);
    }

    const conditions =
      typeof value === 'string' ? { default: value } : (value ?? {});

    if ('source' in conditions) {
      fail(
        `publishConfig.exports["${key}"] declares a "source" condition; the tarball ships no src/`
      );
    }

    for (const [condition, target] of Object.entries(conditions)) {
      if (typeof target !== 'string') {
        fail(
          `publishConfig.exports["${key}"].${condition} is not a string target`
        );
        continue;
      }
      const resolved = target.replaceAll('*', WILDCARD_SAMPLE);
      if (!existsSync(path.join(packageRoot, resolved))) {
        fail(
          `publishConfig.exports["${key}"].${condition} → ${resolved} does not exist` +
            (target.includes('*')
              ? ` (wildcard sampled with "${WILDCARD_SAMPLE}")`
              : '')
        );
      }
    }
  }
}

// 4. The shipped .d.ts files must type-check on their own.
const require = createRequire(import.meta.url);
const tscBin = path.join(
  path.dirname(require.resolve('typescript/package.json')),
  'bin',
  'tsc'
);
const tsc = spawnSync(
  process.execPath,
  [tscBin, '-p', 'tsconfig.dist-check.json'],
  { cwd: packageRoot, encoding: 'utf8' }
);

if (tsc.error) {
  fail(`could not run tsc -p tsconfig.dist-check.json: ${tsc.error.message}`);
} else if (tsc.status !== 0) {
  const output = `${tsc.stdout ?? ''}${tsc.stderr ?? ''}`.trim();
  fail(`tsc -p tsconfig.dist-check.json failed:\n${output}`);
}

// 5. The packed tarball must ship every publishConfig target and nothing from
//    the developer surface (src, Storybook, configs). This also catches the
//    .gitignore footgun: a package-local ignore of `dist` would silently drop
//    the built output even though `files` lists it.
// shell:true is required on Windows so Node can spawn npm.cmd; args are
// hardcoded literals, so the DEP0190 escape warning does not apply.
const pack = spawnSync('npm', ['pack', '--dry-run', '--json'], {
  cwd: packageRoot,
  encoding: 'utf8',
  shell: true,
});

if (pack.error) {
  fail(`could not run npm pack --dry-run: ${pack.error.message}`);
} else if (pack.status !== 0) {
  const output = `${pack.stdout ?? ''}${pack.stderr ?? ''}`.trim();
  fail(`npm pack --dry-run failed:\n${output}`);
} else {
  /** @type {{ filename: string, files: { path: string }[], size: number }[]} */
  let packs;
  try {
    packs = JSON.parse(pack.stdout);
  } catch (error) {
    fail(
      `npm pack --dry-run did not return JSON: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    packs = [];
  }

  const packed = packs[0];
  if (!packed?.files) {
    fail('npm pack --dry-run returned no file list');
  } else {
    const packedPaths = new Set(packed.files.map((entry) => entry.path));
    const has = (relative) => packedPaths.has(relative.replaceAll('\\', '/'));

    const WILDCARD_SAMPLE = 'Button';
    for (const [key, value] of Object.entries(publishExports ?? {})) {
      const conditions =
        typeof value === 'string' ? { default: value } : (value ?? {});
      for (const target of Object.values(conditions)) {
        if (typeof target !== 'string') continue;
        const resolved = target
          .replace(/^\.\//, '')
          .replaceAll('*', WILDCARD_SAMPLE);
        if (!has(resolved)) {
          fail(
            `tarball missing publishConfig.exports["${key}"] target: ${resolved}`
          );
        }
      }
    }

    for (const required of [
      'globals.css',
      'fonts.css',
      'LICENSE',
      'README.md',
      'package.json',
    ]) {
      if (!has(required)) {
        fail(`tarball missing required file: ${required}`);
      }
    }

    const forbiddenPrefixes = [
      'src/',
      '.storybook/',
      'storybook-static/',
      '.turbo/',
      'coverage/',
    ];
    const forbiddenExact = new Set([
      'tsconfig.json',
      'tsconfig.build.json',
      'tsconfig.base.json',
      'tsconfig.dist-check.json',
      'postcss.config.ts',
      'tailwind.config.ts',
      'vitest.config.ts',
      'components.json',
    ]);

    for (const packedPath of packedPaths) {
      if (forbiddenPrefixes.some((prefix) => packedPath.startsWith(prefix))) {
        fail(`tarball contains developer-only path: ${packedPath}`);
      }
      if (forbiddenExact.has(packedPath)) {
        fail(`tarball contains developer-only file: ${packedPath}`);
      }
      if (packedPath.endsWith('.stories.tsx') || packedPath.endsWith('.stories.ts')) {
        fail(`tarball contains a Storybook story: ${packedPath}`);
      }
    }

    const maxBytes = 2 * 1024 * 1024;
    if (typeof packed.size === 'number' && packed.size > maxBytes) {
      fail(
        `tarball is ${(packed.size / 1024 / 1024).toFixed(2)} MB; budget is 2 MB`
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`\nverify-dist: ${failures.length} problem(s) found:\n`);
  for (const failure of failures) {
    console.error(`  • ${failure}\n`);
  }
  process.exit(1);
}

console.log(
  `verify-dist: ok — ${importedCount} entry points imported, publishConfig.exports, dist .d.ts, and tarball verified.`
);
