import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, Table2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Button } from '../../src/components/Button';
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '../../src/components/Modal';
import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger,
} from '../../src/components/SegmentedControl';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Modal',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The developers' one width and one cap, re-declared on the dialog itself:
 * `max-w-lg` is 32rem, and the cap was `max-h-[90dvh]`. With the default
 * `size` the dialog reads `--modal-w-md`, so that is the token that carries it.
 */
const ONE_WIDTH = {
  '--modal-w-md': '32rem',
  '--modal-max-h': '90dvh',
} as CSSProperties;

const TABLES = [
  ['finance.quarterly_revenue_by_region', '48,210'],
  ['finance.invoice_line_items_archive', '1,204,388'],
  ['finance.currency_exchange_rates_daily', '9,125'],
  ['finance.accounts_receivable_aging', '3,412'],
  ['finance.general_ledger_entries', '2,880,101'],
  ['finance.budget_vs_actual_by_department', '1,140'],
  ['sales.customer_lifetime_value_scores', '88,902'],
  ['sales.opportunity_stage_history', '412,560'],
  ['sales.order_lines_with_discounts', '3,071,244'],
  ['sales.territory_assignments_current', '264'],
  ['sales.pipeline_snapshot_weekly', '15,630'],
  ['sales.product_bundle_definitions', '512'],
  ['marketing.campaign_touchpoints_raw', '6,902,118'],
  ['marketing.email_engagement_events', '2,204,931'],
  ['marketing.attribution_model_outputs', '71,442'],
  ['marketing.landing_page_sessions', '1,880,072'],
  ['hr.employee_compensation_history', '22,604'],
  ['hr.org_chart_reporting_lines', '1,908'],
  ['hr.leave_requests_and_approvals', '14,377'],
  ['support.ticket_resolution_timeline', '330,915'],
  ['support.customer_satisfaction_surveys', '41,206'],
  ['support.agent_shift_schedules', '7,488'],
  ['ops.warehouse_inventory_snapshots', '960,450'],
  ['ops.shipment_tracking_events', '4,118,670'],
  ['ops.supplier_lead_times_by_sku', '18,233'],
  ['ops.returns_and_refunds_ledger', '52,901'],
];

/** A dialog holding a table of tables — the case the ladder was widened for. */
function ScopeDialog({
  label,
  size,
  style,
}: {
  label: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: CSSProperties;
}) {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button size="sm" variant="secondary">
          {label}
        </Button>
      </ModalTrigger>
      <ModalContent size={size} style={style}>
        <ModalHeader>
          <ModalTitle>Choose what Data Analyze can read</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col">
            {TABLES.map(([name, rows]) => (
              <div
                className="flex items-center gap-2 border-stroke border-b py-1.5 text-ink-body text-sm last:border-b-0"
                key={name}
              >
                <ChevronRight className="size-4 shrink-0 text-ink-icon" />
                <Table2 className="size-4 shrink-0 text-ink-icon" />
                <span className="min-w-0 flex-1 truncate">{name}</span>
                <span className="shrink-0 text-ink-secondary text-xs tabular-nums">
                  {rows} rows
                </span>
                <SegmentedControl defaultValue="read" size="sm">
                  <SegmentedControlList>
                    <SegmentedControlTrigger value="read">
                      Read
                    </SegmentedControlTrigger>
                    <SegmentedControlTrigger value="hidden">
                      Hidden
                    </SegmentedControlTrigger>
                  </SegmentedControlList>
                </SegmentedControl>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <ModalClose asChild>
            <Button>Save</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export const Page: Story = {
  name: 'Modal',
  render: () => (
    <ChangePage group="Modal" title="Modal">
      <ChangeCase
        after={
          <TryIt action="Open it at each size">
            <div className="flex flex-wrap gap-2">
              <ScopeDialog label="sm · 22.5rem" size="sm" />
              <ScopeDialog label="md · 30rem" size="md" />
              <ScopeDialog label="lg · 36rem" size="lg" />
              <ScopeDialog label="xl · 56rem" size="xl" />
            </div>
          </TryIt>
        }
        afterNote="a size per content · capped at 80dvh, the body scrolls"
        before={
          <TryIt action="Open the dialog">
            <ScopeDialog label="The one width · 32rem" style={ONE_WIDTH} />
          </TryIt>
        }
        beforeNote="max-w-lg for every dialog · max-h-[90dvh]"
        beforeSource={
          <>
            today's <Code>ModalContent</Code> with the two old values
            re-declared on it — <Code>--modal-w-md: 32rem</Code>, which is{' '}
            <Code>max-w-lg</Code>, and <Code>--modal-max-h: 90dvh</Code>. Exact
            for both; the rest of the dialog is today's on both sides.
          </>
        }
        files={['src/components/Modal/ModalContent.tsx', 'globals.css']}
        footnote={
          <>
            <Code>xl</Code> is the draft step: 56rem, the 30 → 36 ratio once
            more, for a dialog that holds a tree or a table — a last resort, as
            a surface that wide usually belongs on a screen of its own. The cap
            is 720px on a 900px window. In the design bundle, which compiles
            only enumerated classes, <Code>max-h-[90dvh]</Code> produced nothing
            and there was no cap at all; Storybook compiles it, so the Before
            shows the cap the class meant.
          </>
        }
        n={71}
        state="draft"
        title="A size ladder, and a height it cannot pass"
        why="One width for every dialog fits a column of fields and nothing wider: a table of tables truncated its names to a word. And 90dvh left 5% of the window at each end, so a tall dialog read as a page with a hairline round it rather than something on a page."
      />
    </ChangePage>
  ),
};
