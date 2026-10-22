import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { ConnectorLogo } from '../ConnectorLogo';
import { FilterMenu, type FilterMenuOption } from './index';

const TYPES: FilterMenuOption[] = [
  { value: 'all', label: 'All', count: 45 },
  { value: 'builtin', label: 'Built-in', count: 38 },
  { value: 'custom', label: 'Custom', count: 7 },
];

const PROVIDERS: FilterMenuOption[] = [
  { value: 'all', label: 'All', count: 45 },
  {
    value: 'g:jira',
    label: 'Jira Software Cloud',
    count: 9,
    icon: <ConnectorLogo connector="jira" size="xs" />,
    children: [
      { value: 'c:skyvia-jira', label: 'Skyvia Jira', count: 1 },
      { value: 'c:campaign-tasks', label: 'Campaign tasks', count: 2 },
    ],
  },
  { value: 'g:github', label: 'GitHub', count: 5, icon: <ConnectorLogo connector="github" size="xs" /> },
  {
    value: 'g:salesforce',
    label: 'Salesforce',
    count: 12,
    icon: <ConnectorLogo connector="salesforce" size="xs" />,
    children: [{ value: 'c:main-crm', label: 'Main CRM', count: 12 }],
  },
];

/**
 * `FilterMenu` is a filter as a pill — "Type: All ▾" — and its menu: plain choices,
 * or a hierarchy (a source, its connections under it). Counts sit after each label;
 * the chosen one has a check. A chosen filter carries a ✕ before the chevron that
 * puts the first choice back without opening the menu.
 */
const meta = {
  title: 'Compositions/FilterMenu',
  component: FilterMenu,
  tags: ['autodocs'],
  args: { label: 'Type', value: 'all', options: TYPES, onValueChange: fn() },
  argTypes: { options: { control: false }, onValueChange: { control: false } },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Something chosen: the pill names it, and ✕ before the chevron clears it. */
export const Chosen: Story = { args: { value: 'custom' } };

/** A hierarchy: each source with its mark, its connections under it, every label on one line. */
export const Tree: Story = { args: { label: 'Provider', options: PROVIDERS } };

export const TreeOpen: Story = { args: { label: 'Provider', options: PROVIDERS, defaultOpen: true }, parameters: { layout: 'padded' } };

/** Live: pick, then clear with ✕. */
export const Interactive: Story = {
  render: () => {
    const [type, setType] = useState('all');
    const [prov, setProv] = useState('c:main-crm');
    return (
      <div className="flex flex-wrap items-center gap-2">
        <FilterMenu label="Type" value={type} options={TYPES} onValueChange={setType} />
        <FilterMenu label="Provider" value={prov} options={PROVIDERS} onValueChange={setProv} />
      </div>
    );
  },
};
