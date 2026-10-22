import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileCode, SquareTerminal } from 'lucide-react';
import type { ReactNode } from 'react';
import type { VariantProps } from '../../lib/cva';
import { Badge } from '../Badge';
import { TooltipProvider } from '../Tooltip';
import { CodeBlock, codeSyntaxVariants } from './index';

const CONFIG = `{
  "mcpServers": {
    "Devart AI": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://127.0.0.1:5027/sse", "--allow-http"]
    }
  }
}`;

type Syntax = NonNullable<VariantProps<typeof codeSyntaxVariants>['variant']>;

/* Already tokenised, the way a caller's highlighter hands it over — the package
   has no parser, and neither does its catalog. `code` is joined from the same
   pieces the markup is built from, so the copied text and the shown text are
   one source here too. */
const PYTHON_TOKENS: ReadonlyArray<readonly [Syntax | null, string]> = [
  ['keyword', 'import'],
  [null, ' pandas '],
  ['keyword', 'as'],
  [null, ' pd\n\n'],
  ['comment', '# Revenue by region, top three'],
  [null, '\ndf = pd.read_csv('],
  ['string', "'sales.csv'"],
  [null, ')\ntop = df.groupby('],
  ['string', "'region'"],
  [null, ')['],
  ['string', "'revenue'"],
  [null, '].sum().nlargest('],
  ['number', '3'],
  [null, ')\n'],
  ['keyword', 'for'],
  [null, ' region, total '],
  ['keyword', 'in'],
  [null, ' top.items():\n    '],
  ['keyword', 'print'],
  [null, '(region, round(total / '],
  ['number', '1000'],
  [null, ', '],
  ['number', '1'],
  [null, '))'],
];

const PYTHON = PYTHON_TOKENS.map(([, text]) => text).join('');

const highlight = (tokens: typeof PYTHON_TOKENS) => {
  const out: ReactNode[] = [];
  let at = 0;
  for (const [variant, text] of tokens) {
    out.push(
      variant ? (
        <span key={at} className={codeSyntaxVariants({ variant })}>
          {text}
        </span>
      ) : (
        text
      )
    );
    at += text.length;
  }
  return out;
};

const PYTHON_OUTPUT = `North 412.6
West 287.3
South 154.9`;

const LOG = `[09:14:02] Loaded 18,240 rows from sales.csv in 0.42s (columns: region, revenue, quarter, product, channel, discount, returned)
[09:14:02] Grouped by region: 4 groups, the largest North with 6,118 rows
[09:14:03] Done`;

const TRACEBACK = `Traceback (most recent call last):
  File "<cell>", line 4, in <module>
    df = pd.read_csv('sales.csv')
FileNotFoundError: [Errno 2] No such file or directory: 'sales.csv' — the workspace has no file by that name; upload it, or choose one from Files.`;

const LONG_SQL = Array.from(
  { length: 40 },
  (_, i) =>
    `SELECT ${i + 1} AS step, 'stage ${i + 1}' AS label FROM pipeline_runs;`
).join('\n');

const meta = {
  title: 'Compositions/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  args: { code: CONFIG, size: 'md', variant: 'default', copyable: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    variant: { control: 'inline-radio', options: ['default', 'error'] },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="w-full max-w-lg">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: { code: 'db2 get instance', size: 'sm' },
};

/** Without the control, for a snippet that is read rather than pasted. */
export const NotCopyable: Story = {
  args: { copyable: false, code: 'SELECT 1;', size: 'sm' },
};

/** A bar over the code for whatever the caller wants said about it. Copy
 *  moves into the bar, at its end — the spot it held in the corner. */
export const WithHeader: Story = {
  args: {
    header: (
      <>
        <FileCode />
        claude_desktop_config.json
      </>
    ),
  },
};

/** Numbers in a gutter that a selection and a screen reader both skip. */
export const LineNumbers: Story = {
  args: { code: PYTHON, lineNumbers: true },
};

/** The code scrolls inside the height; the header stays put. */
export const MaxHeight: Story = {
  args: {
    code: LONG_SQL,
    lineNumbers: true,
    maxHeight: '14rem',
    header: (
      <>
        <FileCode />
        pipeline.sql
      </>
    ),
  },
};

/** Output read as prose wraps instead of scrolling sideways. */
export const Wrap: Story = {
  args: {
    code: LOG,
    wrap: true,
    header: (
      <>
        Output
        <Badge variant="green" size="sm">
          Done
        </Badge>
      </>
    ),
  },
};

/** The code is tinted and the header is not: the header is where the failure
 *  is named, the output under it is what failed. */
export const ErrorOutput: Story = {
  name: 'Error',
  args: {
    code: TRACEBACK,
    variant: 'error',
    wrap: true,
    header: (
      <>
        Output
        <Badge variant="error" size="sm">
          Error
        </Badge>
      </>
    ),
  },
};

/** Pre-highlighted children, coloured with `codeSyntaxVariants`. `code` stays
 *  the plain text: it is what Copy copies and what the gutter counts. */
export const HighlightedPython: Story = {
  args: {
    code: PYTHON,
    children: highlight(PYTHON_TOKENS),
    lineNumbers: true,
    header: (
      <>
        <FileCode />
        Python
      </>
    ),
  },
};

/** A run of code and what it printed, as a chat answer shows it: the source
 *  numbered and capped, the output wrapped. */
export const CodeRun: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <CodeBlock
        code={PYTHON}
        lineNumbers
        maxHeight="14rem"
        copyLabel="Copy code"
        header={
          <>
            <FileCode />
            Python
          </>
        }
      >
        {highlight(PYTHON_TOKENS)}
      </CodeBlock>
      <CodeBlock
        code={PYTHON_OUTPUT}
        wrap
        maxHeight="12rem"
        copyLabel="Copy output"
        header={
          <>
            <SquareTerminal />
            Output
            <Badge variant="green" size="sm">
              Done
            </Badge>
          </>
        }
      />
    </div>
  ),
};
