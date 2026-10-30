import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentType, type ReactNode, useMemo, useState } from 'react';
import {
  SearchInput,
  type SearchInputProps,
} from '../../src/components/SearchInput';
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

/**
 * The developers' field as a page written in JavaScript met it: the props it
 * does not declare are accepted and dropped. Typed as the live props for that
 * one purpose, so the same object goes to both halves — the component itself
 * is the vendored file, unchanged.
 */
const UpstreamLoose = UpstreamSearchInput as ComponentType<SearchInputProps>;

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

/** `variant` and `disabled`, passed the same way to both fields. */
function PassThroughs({ upstream }: { upstream?: boolean }) {
  const [value, setValue] = useState('prod');
  const primary: SearchInputProps = {
    placeholder: 'Search connections…',
    size: 'md',
    variant: 'primary',
  };
  const disabled: SearchInputProps = {
    placeholder: 'Search connections…',
    size: 'md',
    disabled: true,
    value,
    onValueChange: setValue,
    onClear: () => setValue(''),
  };
  return (
    <div className="flex flex-col gap-4">
      <Labelled label='variant="primary" — a well cut into the card'>
        {upstream ? (
          <UpstreamLoose {...primary} />
        ) : (
          <SearchInput {...primary} />
        )}
      </Labelled>
      <Labelled label="disabled">
        {upstream ? (
          <UpstreamLoose {...disabled} />
        ) : (
          <SearchInput {...disabled} />
        )}
      </Labelled>
    </div>
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
        <PassThroughs upstream={upstream} />
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
        afterNote="the matches under the field while typing · the props arrive"
        before={<Panel upstream />}
        beforeNote="a field and nothing under it · variant and disabled dropped"
        beforeSource={
          <>
            the developers' own component, vendored unchanged from their 1.4.0
            into <Code>changes/upstream/SearchInput.tsx</Code>, over the live{' '}
            <Code>InputGroup</Code> — so the field is drawn the same in both
            halves and only <Code>SearchInput</Code> differs. Both get the same
            props; the published one declares neither <Code>variant</Code> nor{' '}
            <Code>disabled</Code>, and drops them.
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
            shows five and a half rows, the half saying there is more. It is{' '}
            <Code>Autocomplete</Code>'s combobox and option row, so the two
            lists look and behave alike. The rest of the pass-throughs draw
            nothing: <Code>autoFocus</Code>, <Code>id</Code>, <Code>style</Code>
            , <Code>onKeyDown</Code>, <Code>aria-label</Code>.
          </>
        }
        n={145}
        state="draft"
        title="SearchInput — the matches while typing, and the pass-throughs"
        why="A directory search had no way to offer what it matched, and the field took eight props and dropped the rest — a page could not ask for the primary well, or switch the field off."
      />
    </ChangePage>
  ),
};
