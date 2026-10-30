import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
import { Button } from '../../src/components/Button';
import { ConfirmationDialog } from '../../src/components/ConfirmationDialog';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/ConfirmationDialog',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The dialog, held open the way an application holds it. */
function RemoveDialog({ description }: { description: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="secondary">
        Remove connection…
      </Button>
      <ConfirmationDialog
        cancelLabel="Cancel"
        confirmLabel="Remove"
        description={description}
        onConfirm={() => setOpen(false)}
        onOpenChange={setOpen}
        open={open}
        title="Remove connection"
        variant="destructive"
      />
    </>
  );
}

export const Page: Story = {
  name: 'ConfirmationDialog',
  render: () => (
    <ChangePage group="ConfirmationDialog" title="ConfirmationDialog">
      <ChangeCase
        after={
          <TryIt action="Open it — the two names stand out of the question">
            <RemoveDialog
              description={
                <>
                  Remove <strong>Finance warehouse</strong> from{' '}
                  <strong>Data Analyze</strong>? Its members lose access to the
                  data at once.
                </>
              }
            />
          </TryIt>
        }
        afterNote="description: ReactNode — inline marks, one paragraph"
        before={
          <TryIt action="Open it — the names run on as plain text">
            <RemoveDialog description="Remove Finance warehouse from Data Analyze? Its members lose access to the data at once." />
          </TryIt>
        }
        beforeNote="description: string"
        beforeSource={
          <>
            the same dialog with its <Code>description</Code> a string — all the
            published type takes. The change is a type, so this is what the
            developers' component draws for any call it accepts; both halves are
            the live component.
          </>
        }
        files={['src/components/ConfirmationDialog/index.tsx']}
        footnote={
          <>
            It renders inside a <Code>&lt;p&gt;</Code> already, so the type
            allows inline content and no more; a second block still goes in{' '}
            <Code>bodySlot</Code>.
          </>
        }
        n={157}
        title="description takes inline marks"
        why="A confirmation names what it acts on and products set that name in bold, which a string cannot carry — so every product with a question like that built the dialog again from Modal parts (twelve copies in the AI connectivity prototype)."
      />
    </ChangePage>
  ),
};
