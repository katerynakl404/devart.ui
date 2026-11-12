import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useMemo, useState } from 'react';
import { SearchInput } from '../../src/components/SearchInput';
import { TooltipProvider } from '../../src/components/Tooltip';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { SearchInput as UpstreamSearchInput } from '../upstream/SearchInput';

const meta = {
  title: 'Proposed changes/Components/SearchInput',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PEOPLE = [
  'Anna Shevchenko',
  'BI & Reporting Analysts',
  'David Miller',
  'External Contractors — Data Migration 2026',
  'Finance & Accounting — EMEA',
  'Iryna Bondar',
  'John Doe',
  'Maria Kovalenko',
  'Oleh Fesenko',
  'Platform Engineering',
  'Sales Operations',
  'Taras Melnyk',
].map((name, i) => ({ id: `p${i}`, label: name }));

function Labelled({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium text-ink-inactive text-xxs uppercase leading-4 tracking-caps">
        {label}
      </span>
      {children}
    </div>
  );
}

/** The directory search: the caller matches, the field offers what it is given. */
function WithResults({ upstream }: { upstream?: boolean }) {
  const [value, setValue] = useState('');
  const results = useMemo(
    () =>
      PEOPLE.filter((p) =>
        p.label.toLowerCase().includes(value.trim().toLowerCase())
      ),
    [value]
  );
  const field = {
    placeholder: 'Search users and groups…',
    size: 'md',
    value,
    onValueChange: setValue,
    onClear: () => setValue(''),
  } as const;
  return upstream ? (
    <UpstreamSearchInput {...field} />
  ) : (
    <SearchInput
      {...field}
      emptyText="No user or group matches"
      results={results}
    />
  );
}

function Panel({ upstream }: { upstream?: boolean }) {
  return (
    <TooltipProvider>
      <div className="flex w-[320px] flex-col gap-6">
        <Labelled label="results">
          <TryIt action="Type “an” — then pick a name">
            <WithResults upstream={upstream} />
          </TryIt>
        </Labelled>
      </div>
    </TooltipProvider>
  );
}

export const Page: Story = {
  name: 'SearchInput',
  render: () => (
    <ChangePage group="SearchInput" title="SearchInput">
      <ChangeCase
        after={<Panel />}
        afterNote="the matches under the field while typing"
        before={<Panel upstream />}
        beforeNote="a field and nothing under it"
        beforeSource={
          <>
            the developers' own component, vendored unchanged from their 1.4.0
            into <Code>changes/upstream/SearchInput.tsx</Code>, over the live{' '}
            <Code>InputGroup</Code> — so the field is drawn the same in both
            halves and only <Code>SearchInput</Code> differs. Both get the same
            props; the published one has no <Code>results</Code> and draws the
            field alone.
          </>
        }
        files={[
          'src/components/SearchInput/index.tsx',
          'src/components/SearchInput/SearchInputWithResults.tsx',
          'src/components/SearchInput/types.ts',
        ]}
        footnote={
          <>
            The list opens only while something is typed — not on focus, not on
            a click into the field, not with the picked name still in it — and
            shows seven and a half rows, the half saying there is more. It is{' '}
            <Code>Autocomplete</Code>'s combobox and option row, so the two
            lists look and behave alike. The field also passes on{' '}
            <Code>variant</Code>, <Code>aria-label</Code> and{' '}
            <Code>autoFocus</Code>, which the products already set.
          </>
        }
        n={145}
        title="SearchInput — the matches while typing"
        why="A directory search had no way to offer what it matched."
      />
    </ChangePage>
  ),
};
