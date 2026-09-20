import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight } from 'lucide-react';
import { Typography } from '../Typography';
import { Link } from './index';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: { children: 'Permissions', href: '#', tone: 'brand' },
  argTypes: {
    tone: { control: 'select', options: ['brand', 'body', 'onSolid'] },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {};

/** A link takes the size of the text it sits in — that is what makes it a link. */
export const InText: Story = {
  render: () => (
    <Typography
      element="p"
      textStyle="body14"
      textColor="secondary"
      className="max-w-md"
    >
      A connection has to be added to a workspace and then given a scope in it —
      see <Link href="#">how scopes work</Link> for the difference.
    </Typography>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Link href="#">Brand — the default</Link>
      <Link href="#" tone="body">
        Body — inside copy it must not outshout the sentence
      </Link>
      <div className="rounded-md bg-brand-primary p-3">
        <Link href="#" tone="onSolid">
          On a solid fill
        </Link>
      </div>
    </div>
  ),
};

export const WithTrailingGlyph: Story = {
  args: { rightSlot: <ArrowRight /> },
};

export const Disabled: Story = {
  args: { 'aria-disabled': true, children: 'Permissions' },
};
