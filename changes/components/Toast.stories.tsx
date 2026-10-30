import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src/components/Button';
import { Toaster, toast } from '../../src/components/Toast';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { toast as upstreamToast } from '../upstream/Toast/toast';

const meta = {
  title: 'Proposed changes/Components/Toast',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** One bulk "test connection", three results — the case that was measured. */
const RESULTS = [
  'Connection OK — analytics-prod',
  'Connection OK — billing-eu',
  'Connection OK — crm',
];

type Position = 'bottom-left' | 'bottom-right';

/** What both `toast` objects share — all the panels need. */
type AnyToast = {
  success: (
    message: string,
    options: { duration: number; position: Position }
  ) => unknown;
};

function fire(api: AnyToast, position: Position) {
  for (const message of RESULTS) {
    api.success(message, { duration: 10_000, position });
  }
}

export const Page: Story = {
  name: 'Toast',
  render: () => (
    <ChangePage group="Toast" title="Toast">
      <ChangeCase
        after={
          <TryIt action="Fire them — bottom-right, one column of one width">
            <Button
              onClick={() => fire(toast, 'bottom-right')}
              size="sm"
              variant="secondary"
            >
              Test three connections
            </Button>
          </TryIt>
        }
        afterNote="every toast at the Toaster's --width, 356px"
        before={
          <TryIt action="Fire them — bottom-left, each its own width">
            <div className="flex items-center">
              <Button
                onClick={() => fire(upstreamToast, 'bottom-left')}
                size="sm"
                variant="secondary"
              >
                Test three connections
              </Button>
              {/* One Toaster for the page; it is fixed to the window, so where
                  it sits in the tree draws nothing here. */}
              <Toaster expand />
            </div>
          </TryIt>
        }
        beforeNote="each toast fits its own message"
        beforeSource={
          <>
            the developers' own <Code>toast</Code> and <Code>ToastMessage</Code>
            , vendored unchanged from their 1.4.0 into{' '}
            <Code>changes/upstream/Toast</Code>, fired into the same{' '}
            <Code>Toaster</Code> as the After half — only the corner differs.
          </>
        }
        files={['src/components/Toast/toast.tsx']}
        footnote={
          <>
            <Code>Toaster</Code> already declares <Code>--width: 356px</Code>,
            and sonner applies it to toasts it styles itself;{' '}
            <Code>toast.custom</Code> — every toast here, because the body is
            our own <Code>ToastMessage</Code> — is unstyled as far as sonner
            knows, and fell through to fitting its content.{' '}
            <Code>createToast</Code> now passes <Code>width: var(--width)</Code>
            , so the Toaster keeps the number and an explicit <Code>width</Code>{' '}
            still wins. The message column lost its 240px cap with it (
            <Code>max-w-60</Code> → <Code>flex-1</Code>), so the text takes the
            width it is given. The Toaster on this page is <Code>expand</Code>,
            so the stack shows as a column without a hover.
          </>
        }
        n={75}
        title="A stack of toasts, each a different width"
        why="Three results of one bulk action stacked at 317, 296 and 268px, each sized to its own message — ragged boxes down the edge read as three unrelated events instead of one log."
      />
    </ChangePage>
  ),
};
