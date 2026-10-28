import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Pagination } from './index';

const meta = {
  title: 'Compositions/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    currentPage: 5,
    totalPages: 10,
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: true,
    showPrevNext: true,
    onPageChange: fn(),
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0 } },
    boundaryCount: { control: { type: 'number', min: 0 } },
    showFirstLast: { control: 'boolean' },
    showPrevNext: { control: 'boolean' },
    onPageChange: { control: false },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstPage: Story = {
  args: { currentPage: 1 },
};

export const LastPage: Story = {
  args: { currentPage: 10 },
};

export const FewPages: Story = {
  args: { currentPage: 2, totalPages: 4 },
};

export const Interactive: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(next) => {
          setPage(next);
          args.onPageChange(next);
        }}
      />
    );
  },
};

/**
 * `totalItems` + `pageSize` — the range readout, "Showing 26–50 of 60" in
 * `body12` secondary, on the leading edge of one band with the controls on the
 * trailing one. The table footer's shape: `size="xs"` beside the 12px text,
 * directly under the table. **Draft.**
 */
export const WithRange: Story = {
  parameters: { layout: 'padded' },
  args: {
    currentPage: 2,
    totalPages: 3,
    totalItems: 60,
    pageSize: 25,
    size: 'xs',
    showFirstLast: false,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return (
      <div className="w-full max-w-2xl">
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={(next) => {
            setPage(next);
            args.onPageChange(next);
          }}
        />
      </div>
    );
  },
};
