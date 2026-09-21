import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight } from 'lucide-react';
import { Typography } from '../Typography';
import { LinkButton } from './index';

const meta = {
  title: 'Components/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  args: { children: 'Permissions', href: '#', tone: 'brand' },
  argTypes: {
    tone: { control: 'select', options: ['brand', 'body', 'onSolid'] },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof LinkButton>;

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
      see <LinkButton href="#">how scopes work</LinkButton> for the difference.
    </Typography>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <LinkButton href="#">Brand — the default</LinkButton>
      <LinkButton href="#" tone="body">
        Body — inside copy it must not outshout the sentence
      </LinkButton>
      <div className="rounded-md bg-brand-primary p-3">
        <LinkButton href="#" tone="onSolid">
          On a solid fill
        </LinkButton>
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

/**
 * Inside a sentence there is nothing else to mark a link, so the rule is always
 * there — at 25% of the ink, so it does not cut the line of text in half. Hover
 * brings it to full strength rather than adding it.
 */
export const Inline: Story = {
  render: () => (
    <Typography textStyle="body14">
      Connections are shared across the workspace. See{' '}
      <LinkButton variant="inline">how permissions work</LinkButton> before you
      invite anyone, or{' '}
      <LinkButton variant="inline" tone="body">
        read the overview
      </LinkButton>{' '}
      first.
    </Typography>
  ),
};
