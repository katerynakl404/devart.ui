import type { Meta, StoryObj } from '@storybook/react-vite';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Typography } from '../Typography';
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  modalContentVariants,
} from './index';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    // Radix portals the dialog to document.body — snapshot the whole page.
    layout: 'centered',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="secondary">Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Rename chat</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Typography textColor="body">
            Give this chat a short, descriptive name so it is easier to find
            later.
          </Typography>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <Button>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructiveOutline">Delete chat</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete chat?</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Typography textColor="body">
            This action cannot be undone. The chat and all its messages will be
            permanently removed.
          </Typography>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <Button variant="destructive">Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <Modal defaultOpen>
      <ModalTrigger asChild>
        <Button variant="secondary">Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Initially open</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Typography textColor="body">
            Rendered open so the layout is visible without interaction.
          </Typography>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

/**
 * A dialog is sized by what it holds, not one width for everything. Three
 * steps, and every dialog maps to one — so a one-line confirm no longer reads
 * as a major modal.
 *
 * | Step | Width | Holds |
 * |---|---|---|
 * | `sm` | 360px | a confirm the user only reads and answers |
 * | `md` | 480px | the default — anything the user fills in |
 * | `lg` | 576px | the multi-step wizard |
 *
 * Rename is `md`, not `sm`: the user types into it, so it is a form, not a
 * confirmation. Only Delete and Disconnect are `sm`.
 */
export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        [
          [
            'sm',
            '360px',
            'Delete file?',
            "This action can't be undone. The file will be permanently removed.",
          ],
          ['md', '480px', 'Rename file', 'Give your file a recognizable name.'],
          [
            'lg',
            '576px',
            'New connection',
            'The multi-step wizard — a long connector name and a two-line token field both need the extra width.',
          ],
        ] as const
      ).map(([size, width, title, body]) => (
        <div className="flex flex-col gap-1" key={size}>
          <Typography textColor="secondary" textStyle="overline">
            {`size="${size}" · max-width ${width}`}
          </Typography>
          {/* The dialog shell rendered inline (not portalled) so all three
              widths are visible side by side in one frame. */}
          <div
            className={cn(
              modalContentVariants({ size }),
              'flex w-full flex-col rounded-lg border border-stroke bg-surface-card p-4'
            )}
          >
            <ModalHeader>
              {/* Radix's Title needs a Dialog context, so this static preview
                  renders the same type style directly. */}
              <Typography textColor="primary" textStyle="heading20">
                {title}
              </Typography>
            </ModalHeader>
            <Typography textColor="secondary">{body}</Typography>
            <ModalFooter>
              <Button size="sm" variant="secondary">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </ModalFooter>
          </div>
        </div>
      ))}
    </div>
  ),
};
