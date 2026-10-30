import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkles } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { PromoCard } from '../../src/components/PromoCard';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';
import { PromoCard as UpstreamPromoCard } from '../upstream/PromoCard';

const meta = {
  title: 'Proposed changes/Components/PromoCard',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The props both PromoCards share — all the panels need. */
type AnyPromoCard = ComponentType<{
  description?: ReactNode;
  icon?: ReactNode;
  onDismiss?: () => void;
  title: ReactNode;
}>;

/** The card in the 15rem column it was drawn for. */
function Promo({ Component }: { Component: AnyPromoCard }) {
  return (
    <div className="w-60">
      <Component
        description="Unlimited sources and 15,000 credits a month"
        icon={<Sparkles />}
        onDismiss={() => undefined}
        title="Upgrade to Pro"
      />
    </div>
  );
}

export const Page: Story = {
  name: 'PromoCard',
  render: () => (
    <ChangePage group="PromoCard" title="PromoCard">
      <ChangeCase
        after={
          <TryIt action="Hover the card, then move onto the ✕ — the fill holds">
            <Promo Component={PromoCard} />
          </TryIt>
        }
        afterNote="group-hover/promo-card on the root"
        before={
          <TryIt action="Hover the card, then move onto the ✕ — the fill goes">
            <Promo Component={UpstreamPromoCard} />
          </TryIt>
        }
        beforeNote="hover:bg-state-hover on the link"
        beforeSource={
          <>
            the developers' own component, vendored unchanged from their 1.4.0
            into <Code>changes/upstream/PromoCard.tsx</Code> — the PromoCard
            their storybook ships, not a replica of it.
          </>
        }
        files={['src/components/PromoCard/index.tsx']}
        footnote={
          <>
            Over the ✕ the card keeps its fill and the ✕ adds its own tertiary
            wash on top. The hit areas do not change: the link is still the
            card, the ✕ still its own control, a sibling laid over the corner.
          </>
        }
        n={116}
        title="The hover holds over the dismiss"
        why="The ✕ is a sibling of the link, laid over its corner, and the hover was on the link — so the pointer reaching the ✕ left the link, and the card dropped its hover while the pointer was still on it."
      />
    </ChangePage>
  ),
};
