import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconButton } from '../../src/components/IconButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../src/components/Tooltip';
import { ChangeCase, ChangePage, Code, TryIt } from '../Harness';

const meta = {
  title: 'Proposed changes/Components/Tooltip',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The bubble classes `TooltipContent` carries, minus the arrow under review. */
const TOOLTIP_BUBBLE_CLASSES =
  'z-50 w-max max-w-72 whitespace-normal rounded-md bg-ink-primary px-2 py-1 text-left text-surface-card text-xs';

/** An outlined box around the trigger, so the hit area itself is visible. */
function TriggerBox({
  children,
  inlineFlex,
}: {
  children: ReactNode;
  inlineFlex?: boolean;
}) {
  return (
    <span
      className={`${inlineFlex ? 'inline-flex' : 'inline'} outline outline-1 outline-fb-attention/60`}
    >
      {children}
    </span>
  );
}

/**
 * The two call sites a delay used to come from — one that passed nothing and
 * `ModalContent`'s close button — each under a provider of its own, as they are
 * in a product, so one tooltip's skip-delay never shortens the other's wait.
 */
const CALL_SITES = [
  {
    site: 'nothing passed',
    label: 'Copy connection string',
    icon: <Copy />,
    upstreamDelay: undefined,
  },
  { site: 'ModalContent', label: 'Close', icon: <X />, upstreamDelay: 200 },
];

function DelaySites({ upstream }: { upstream?: boolean }) {
  return (
    <div className="flex items-start gap-10">
      {CALL_SITES.map(({ site, label, icon, upstreamDelay }) => {
        const button = (
          <IconButton aria-label={label} size="sm" variant="tertiary">
            {icon}
          </IconButton>
        );
        return (
          <div className="flex flex-col items-center gap-2" key={site}>
            {upstream ? (
              <TooltipPrimitive.Provider delayDuration={upstreamDelay}>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    {button}
                  </TooltipPrimitive.Trigger>
                  <TooltipContent side="top">{label}</TooltipContent>
                </TooltipPrimitive.Root>
              </TooltipPrimitive.Provider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="top">{label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span className="text-ink-secondary text-xxs tabular-nums">
              {site} · {upstream ? (upstreamDelay ?? 700) : 300}ms
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const Page: Story = {
  name: 'Tooltip',
  render: () => (
    <ChangePage group="Tooltip" title="Tooltip">
      <ChangeCase
        after={
          <TryIt action="Hover either trigger">
            <TooltipProvider>
              <div className="flex items-center gap-8">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TriggerBox inlineFlex>
                      <Info className="size-3.5 text-ink-icon" />
                    </TriggerBox>
                  </TooltipTrigger>
                  <TooltipContent side="top">Read replica</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-ink-body text-sm underline decoration-dotted">
                      A text trigger
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">Read replica</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </TryIt>
        }
        afterNote="arrow 8×4 · visible gap 4px · trigger hugs the icon"
        before={
          <TryIt action="Hover either trigger">
            <TooltipPrimitive.Provider>
              <div className="flex items-center gap-8">
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <TriggerBox>
                      <Info className="size-3.5 text-ink-icon" />
                    </TriggerBox>
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      className={TOOLTIP_BUBBLE_CLASSES}
                      side="top"
                      sideOffset={8}
                    >
                      Read replica
                      <TooltipPrimitive.Arrow className="fill-ink-primary" />
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <span className="text-ink-body text-sm underline decoration-dotted">
                      A text trigger
                    </span>
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                      className={TOOLTIP_BUBBLE_CLASSES}
                      side="top"
                      sideOffset={8}
                    >
                      Read replica
                      <TooltipPrimitive.Arrow className="fill-ink-primary" />
                    </TooltipPrimitive.Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
              </div>
            </TooltipPrimitive.Provider>
          </TryIt>
        }
        beforeNote="Radix default 10×5 · visible gap 3px · trigger 20px tall"
        beforeSource={
          <>
            raw Radix with the package's own bubble classes and the stock arrow.
            The amber outline is the trigger's box: left, a plain inline{' '}
            <Code>&lt;span&gt;</Code> grows to the line box — 20px around a 14px
            icon — so the tip drifts a further 6px from the glyph it points at.
          </>
        }
        files={['src/components/Tooltip/TooltipContent.tsx']}
        footnote={
          <>
            Radix draws the arrow into the <Code>sideOffset</Code> gap rather
            than beside it, so the distance a reader sees is{' '}
            <Code>sideOffset − arrowHeight</Code> = 8 − 5 = 3px; neither 5 nor 3
            is on the 4px scale. The trigger half is not fixed in the package —
            the trigger belongs to the consumer — but <Code>inline-flex</Code>{' '}
            is what makes the box hug the icon.
          </>
        }
        n={13}
        title="The arrow put the gap off the 4px scale"
        why="The arrow is now 8×4, putting the tip exactly 4px from the trigger, so all three numbers sit on the grid."
      />

      <ChangeCase
        after={
          <TryIt action="Hover each icon in turn and count">
            <DelaySites />
          </TryIt>
        }
        afterNote="300ms wherever nothing is passed — the provider's default"
        before={
          <TryIt action="Hover each icon in turn and count">
            <DelaySites upstream />
          </TryIt>
        }
        beforeNote="Radix's 700ms where nothing was passed · 200ms in ModalContent"
        beforeSource={
          <>
            Radix's own <Code>Tooltip.Provider</Code> — which the developers'{' '}
            <Code>TooltipProvider</Code> was, a bare re-export — at the delays
            the two call sites ended up with. The bubble is today's{' '}
            <Code>TooltipContent</Code> on both sides.
          </>
        }
        files={['src/components/Tooltip/index.tsx']}
        footnote={
          <>
            300 is the kit's value — <Code>[data-tip]</Code> opens on{' '}
            <Code>transition: opacity .12s .3s</Code>. This package's own 200s —{' '}
            <Code>ModalContent</Code>'s among them — are removed so they take
            it, and so is the sidebar rail's 500 (§72); the developers'{' '}
            <Code>ModalContent</Code> still passes 200. The bubble's own
            entrance is unchanged: a 150ms <Code>tailwindcss-animate</Code>{' '}
            keyframe, not a <Code>--motion-*</Code> token.
          </>
        }
        n={63}
        title="The delay before it opens"
        why="The provider passed nothing of its own, so the delay was whatever each call site wrote: Radix's 700ms wherever a consumer forgot, which reads as a tooltip that never comes, and 200ms in ModalContent, which fires while the pointer is still crossing the row."
      />
    </ChangePage>
  ),
};
