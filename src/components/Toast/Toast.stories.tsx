import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Toaster, ToastMessage, toast } from './index';

/**
 * Toasts are imperative: call `toast.success(...)` / `toast.error(...)` etc.
 * anywhere and the mounted `<Toaster />` (backed by `sonner`) renders them in a
 * portal. Every story mounts a `<Toaster />` via the decorator and triggers
 * toasts from buttons. `meta.component` targets `ToastMessage` — the visual
 * primitive each toast renders — so its `variant` drives the controls panel.
 */
const meta = {
  title: 'Components/Toast',
  component: ToastMessage,
  tags: ['autodocs'],
  args: {
    variant: 'info',
    message: 'Changes saved',
    description: 'Your changes have been saved successfully.',
    duration: 4000,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    duration: { control: 'number' },
    action: { control: false },
    icon: { control: false },
    onClose: { control: false, table: { disable: true } },
    ref: { control: false, table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="grid min-h-32 place-items-center">
        <Toaster />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ToastMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The `ToastMessage` primitive rendered inline (this is what each imperative
 * toast draws inside the portal). Use the controls to switch variants.
 */
export const Message: Story = {
  render: (args) => (
    <div className="w-80">
      <ToastMessage {...args} />
    </div>
  ),
};

/**
 * Every toast appearance, rendered statically.
 *
 * `toast()` is imperative — Sonner only paints a toast after a click — so the
 * trigger-button stories below show none of the four variants at rest. These
 * are the same `ToastMessage` primitives Sonner renders inside the portal,
 * mounted inline so success / info / warning / error and the optional
 * description, action button, close button and countdown strip are all visible
 * without interaction.
 */
export const Appearances: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ToastMessage
        duration={Number.POSITIVE_INFINITY}
        message="Profile saved."
        onClose={() => undefined}
        variant="success"
      />
      <ToastMessage
        action={{ label: 'View', onClick: () => undefined }}
        description="Dashboard data refreshed automatically."
        duration={Number.POSITIVE_INFINITY}
        message="3 new updates available."
        onClose={() => undefined}
        variant="info"
      />
      <ToastMessage
        description="Click Cancel to go back and save."
        duration={Number.POSITIVE_INFINITY}
        message="Unsaved changes will be lost."
        onClose={() => undefined}
        variant="warning"
      />
      <ToastMessage
        duration={Number.POSITIVE_INFINITY}
        message="Failed to upload — try again."
        onClose={() => undefined}
        variant="error"
      />
    </div>
  ),
};

/**
 * The optional slots, on one variant: message only, message + description,
 * without the close button, and with the countdown strip running.
 */
export const States: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ToastMessage
        duration={Number.POSITIVE_INFINITY}
        message="Metric not saved"
        onClose={() => undefined}
        variant="error"
      />
      <ToastMessage
        description="The alias @mrr_growth already belongs to another metric — change the highlighted field."
        duration={Number.POSITIVE_INFINITY}
        message="Metric not saved"
        onClose={() => undefined}
        variant="error"
      />
      <ToastMessage
        description="No close affordance — dismissed by the countdown alone."
        duration={Number.POSITIVE_INFINITY}
        message="Jira checked successfully"
        variant="success"
      />
      <ToastMessage
        description="Countdown strip running at the default 4000ms."
        message="Draft saved automatically"
        onClose={() => undefined}
        variant="info"
      />
    </div>
  ),
};

/** One button per imperative variant of the `toast` helper. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => toast.success('Chat renamed')}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Draft saved automatically')}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('You are approaching your usage limit')}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Failed to send message')}
      >
        Error
      </Button>
    </div>
  ),
};

/** A toast carrying an action button and a longer description. */
export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.error('Message failed to send', {
          action: { label: 'Retry', onClick: () => toast.success('Retrying') },
        })
      }
    >
      Show toast with action
    </Button>
  ),
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS. This component portals to `document.body`, so an OPEN overlay is not
 * reached by a scoped class — only the trigger is themed here. Put `dark` on
 * `<html>` to theme the overlay itself.
 */
export const DarkTheme: Story = {
  ...Message,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
