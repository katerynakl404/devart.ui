import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { expect, userEvent } from 'storybook/test';
import { Typography } from '../Typography';
import { LinkButton } from './index';

const meta = {
  title: 'Components/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  args: { children: 'Permissions', href: '#', variant: 'primary' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'white'] },
    inline: { control: 'boolean' },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

/** A link takes the size of the text it sits in — that is what makes it a link. */
export const InText: Story = {
  render: () => (
    <Typography element="p" textColor="secondary" className="max-w-md">
      A connection has to be added to a workspace and then given a scope in it —
      see <LinkButton href="#">how scopes work</LinkButton> for the difference.
    </Typography>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <LinkButton href="#">Primary — the default</LinkButton>
      <LinkButton href="#" variant="secondary">
        Secondary — inside copy it must not outshout the sentence
      </LinkButton>
      <div className="rounded-md bg-brand-primary p-3">
        <LinkButton href="#" variant="white">
          White — on a solid fill
        </LinkButton>
      </div>
    </div>
  ),
};

export const WithTrailingGlyph: Story = {
  args: { rightSlot: <ArrowRight /> },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Permissions' },
};

/** Inside a sentence there is nothing else to mark a link, so the rule is always
 *  there — at 25% of the ink, so it does not cut the line of text in half. Hover
 *  brings it to full strength rather than adding it. */
export const Inline: Story = {
  render: () => (
    <Typography>
      Connections are shared across the workspace. See{' '}
      <LinkButton href="#" inline>
        how permissions work
      </LinkButton>{' '}
      before you invite anyone, or{' '}
      <LinkButton href="#" inline variant="secondary">
        read the overview
      </LinkButton>{' '}
      first.
    </Typography>
  ),
};

/** Without `href` it is a `<button type="button">` with the same look — for a
 *  link-styled control that acts rather than goes: "Select all", "View more",
 *  a row's "Set up". It takes Tab and answers Enter and Space, which an `<a>`
 *  with no `href` did not. Inspect the two: an `<a>` beside a `<button>`. */
export const AsButton: Story = {
  render: () => {
    const [all, setAll] = useState(false);
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-start gap-3">
        <Typography textColor="secondary">
          {all ? '5 selected' : '5 connections'} ·{' '}
          <LinkButton onClick={() => setAll((v) => !v)}>
            {all ? 'Deselect all' : 'Select all'}
          </LinkButton>
        </Typography>
        <LinkButton
          className="text-sm"
          rightSlot={open ? <ChevronUp /> : <ChevronDown />}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'View less' : 'View more'}
        </LinkButton>
        <LinkButton href="#" className="text-sm" rightSlot={<ArrowRight />}>
          Permissions — with an href, a link
        </LinkButton>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const selectAll = canvas.getByRole('button', { name: 'Select all' });
    await expect(selectAll).toHaveAttribute('type', 'button');

    selectAll.focus();
    await userEvent.keyboard('{Enter}');
    await expect(
      canvas.getByRole('button', { name: 'Deselect all' })
    ).toBeInTheDocument();

    await expect(
      canvas.getByRole('link', { name: /Permissions/ })
    ).toHaveAttribute('href', '#');
  },
};
