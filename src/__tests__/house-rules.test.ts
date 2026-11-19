/**
 * The developers' house rules that a parser can check (COMPONENT-RULES.md).
 *
 * A ratchet: what the library already breaks is listed in
 * `house-rules.baseline.json`, and only going over that list fails. Fixing a
 * component lowers its line; a new file starts at zero. After a fix, refresh
 * the list with `UPDATE_HOUSE_RULES=1` — never raise a number by hand to make
 * the gate pass.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

type Rule =
  | 'conditional-class'
  | 'class-map'
  | 'type-literal-cast'
  | 'active-variant'
  | 'components-per-file';

type Counts = Partial<Record<Rule, number>>;

const RULE_SECTION: Record<Rule, string> = {
  'conditional-class': 'Classes and recipes — no condition in TSX',
  'class-map': 'Classes and recipes — no condition in TSX',
  'type-literal-cast': 'Types and props — no `as` casts',
  'active-variant': 'Classes and recipes — `pressed:`, never `active:`',
  'components-per-file': 'Files and parts — one component per file',
};

const isPascalCase = (name: string) => /^[A-Z][A-Za-z0-9]*$/.test(name);

const isStringLike = (node: ts.Node) =>
  ts.isStringLiteral(node) ||
  ts.isNoSubstitutionTemplateLiteral(node) ||
  ts.isTemplateExpression(node);

/** `has-[[data-disabled]]:active:bg-x` → true; `data-[state=active]:x` → false. */
const hasActiveVariant = (text: string) =>
  text.split(/\s+/).some((token) => {
    let bare = token;
    while (/\[[^[\]]*\]/.test(bare)) bare = bare.replace(/\[[^[\]]*\]/g, '');
    return bare.split(':').slice(0, -1).includes('active');
  });

/**
 * A string literal chosen by a condition: `x && 'a'`, `x ? 'a' : 'b'`.
 * `seen` keeps a `cn()` inside a `className` from being counted twice.
 */
const countConditionalClasses = (
  expression: ts.Node,
  seen: Set<ts.Node>
): number => {
  let count = 0;
  const visit = (node: ts.Node) => {
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return;
    const isConditionalString =
      (ts.isConditionalExpression(node) &&
        (isStringLike(node.whenTrue) || isStringLike(node.whenFalse))) ||
      (ts.isBinaryExpression(node) &&
        node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
        isStringLike(node.right));
    if (isConditionalString && !seen.has(node)) {
      seen.add(node);
      count += 1;
    }
    ts.forEachChild(node, visit);
  };
  visit(expression);
  return count;
};

const containsJsx = (node: ts.Node): boolean => {
  if (
    ts.isJsxElement(node) ||
    ts.isJsxSelfClosingElement(node) ||
    ts.isJsxFragment(node)
  ) {
    return true;
  }
  return ts.forEachChild(node, containsJsx) ?? false;
};

/** Top-level PascalCase functions that render JSX. */
const countComponents = (source: ts.SourceFile) => {
  let count = 0;
  for (const statement of source.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      isPascalCase(statement.name.text) &&
      containsJsx(statement)
    ) {
      count += 1;
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        const init = declaration.initializer;
        if (
          ts.isIdentifier(declaration.name) &&
          isPascalCase(declaration.name.text) &&
          init &&
          (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) &&
          containsJsx(init)
        ) {
          count += 1;
        }
      }
    }
  }
  return count;
};

/** Counts every rule in one file's source. */
const scan = (fileName: string, text: string): Counts => {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const counts: Counts = {};
  const add = (rule: Rule, by = 1) => {
    if (by > 0) counts[rule] = (counts[rule] ?? 0) + by;
  };
  const seen = new Set<ts.Node>();

  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'cn'
    ) {
      for (const argument of node.arguments) {
        add('conditional-class', countConditionalClasses(argument, seen));
      }
    }

    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(source) === 'className' &&
      node.initializer &&
      ts.isJsxExpression(node.initializer) &&
      node.initializer.expression
    ) {
      add(
        'conditional-class',
        countConditionalClasses(node.initializer.expression, seen)
      );
    }

    if (
      ts.isVariableDeclaration(node) &&
      node.type &&
      ts.isTypeReferenceNode(node.type) &&
      node.type.typeName.getText(source) === 'Record' &&
      node.type.typeArguments?.[1]?.kind === ts.SyntaxKind.StringKeyword &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      add('class-map');
    }

    if (ts.isAsExpression(node) && ts.isTypeLiteralNode(node.type)) {
      add('type-literal-cast');
    }

    if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      hasActiveVariant(node.text)
    ) {
      add('active-variant');
    }

    ts.forEachChild(node, visit);
  };
  visit(source);

  const components = countComponents(source);
  if (components > 1) add('components-per-file', components);

  return counts;
};

describe('the house-rules scanner', () => {
  it('flags a class chosen by a condition, in cn() and in className', () => {
    expect(
      scan(
        'A.tsx',
        `const A = ({ on }) => (
          <div className={cn('flex', on && 'pe-8', on ? 'a' : 'b')}>
            <span className={on ? 'opacity-disabled' : undefined} />
          </div>
        );`
      )
    ).toEqual({ 'conditional-class': 3 });
  });

  it('leaves a condition that picks a prop value, not a class', () => {
    expect(
      scan(
        'A.tsx',
        `const A = ({ size }) => (
          <Icon size={size === 'xs' ? 'xs' : 'sm'} className={cn(recipe(), className)} />
        );`
      )
    ).toEqual({});
  });

  it('flags a class map, an object-literal cast and an active: variant', () => {
    expect(
      scan(
        'A.tsx',
        `const sizes: Record<Size, string> = { sm: 'text-xs', md: 'text-sm' };
         const label = (option as { label?: string }).label;
         const row = cn('hover:bg-x', 'has-[[data-disabled]]:active:bg-transparent');`
      )
    ).toEqual({
      'class-map': 1,
      'type-literal-cast': 1,
      'active-variant': 1,
    });
  });

  it('reads active only as a variant, not as a value or inside brackets', () => {
    expect(
      scan(
        'A.ts',
        `const a = 'data-[state=active]:bg-x';
         const b = '[&:active:not(:has(x))]:border-y';
         const c = 'active';
         const d = 'pressed:bg-state-pressed';`
      )
    ).toEqual({});
  });

  it('counts the components in a file only when there is more than one', () => {
    const one = `export function A() { return <div />; }
      const helper = () => 1;`;
    const two = `function A() { return <div />; }
      const B = () => <span />;
      const C = Primitive.Root;`;
    expect(scan('One.tsx', one)).toEqual({});
    expect(scan('Two.tsx', two)).toEqual({ 'components-per-file': 2 });
  });
});

const sources = import.meta.glob<string>(
  [
    '../components/**/*.{ts,tsx}',
    '!../components/**/*.stories.tsx',
    '!../components/**/*.test.{ts,tsx}',
    '!../components/**/__tests__/**',
  ],
  { query: '?raw', import: 'default', eager: true }
);

// Vitest runs from the package root; jsdom's URL does not take file: paths.
const baselinePath = resolve(
  process.cwd(),
  'src/__tests__/house-rules.baseline.json'
);

it('the library breaks no house rule beyond its baseline', () => {
  const current: Record<string, Counts> = {};
  for (const [path, text] of Object.entries(sources).sort()) {
    const counts = scan(path, text);
    if (Object.keys(counts).length > 0) {
      current[path.replace('../', '')] = counts;
    }
  }

  if (process.env.UPDATE_HOUSE_RULES) {
    writeFileSync(baselinePath, `${JSON.stringify(current, null, 2)}\n`);
    return;
  }

  const baseline: Record<string, Counts> = JSON.parse(
    readFileSync(baselinePath, 'utf8')
  );

  const over: string[] = [];
  for (const [file, counts] of Object.entries(current)) {
    for (const [rule, now] of Object.entries(counts) as [Rule, number][]) {
      const allowed = baseline[file]?.[rule] ?? 0;
      if (now > allowed) {
        over.push(
          `${file}: ${rule} ${now} (baseline ${allowed}) — COMPONENT-RULES.md, ${RULE_SECTION[rule]}`
        );
      }
    }
  }

  expect(
    over,
    'new house-rule breaks — fix them, do not raise the baseline'
  ).toEqual([]);
});
