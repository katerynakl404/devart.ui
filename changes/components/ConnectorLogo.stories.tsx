import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChangePage, Code, NoPanel } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/ConnectorLogo',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NOT_UPSTREAM = (
  <>
    <Code>ConnectorLogo</Code> is not in the developers' library at 1.4.0, so
    there is no published mark to set this against. It is reviewed in its own
    story under Components/ConnectorLogo.
  </>
);

export const Page: Story = {
  name: 'ConnectorLogo',
  render: () => (
    <ChangePage group="ConnectorLogo" title="ConnectorLogo">
      <NoPanel
        section={16}
        title="Connector marks as data-URIs, a monogram for the rest"
        why={NOT_UPSTREAM}
      />
      <NoPanel
        section={108}
        title="The DB2 mark — it fell back to a “D”"
        why={NOT_UPSTREAM}
      />
      <NoPanel
        section={115}
        title="The SQLite mark — it fell back to an “S”"
        why={NOT_UPSTREAM}
      />
    </ChangePage>
  ),
};
