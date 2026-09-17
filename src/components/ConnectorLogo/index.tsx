import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { CONNECTOR_LOGOS, type ConnectorSlug } from './logos';

const connectorLogoVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md',
  {
    variants: {
      size: {
        xs: 'size-6',
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const monogramVariants = cva(
  cn(
    'flex h-full w-full items-center justify-center',
    'bg-surface-chips text-ink-secondary',
    'font-medium uppercase'
  ),
  {
    variants: {
      size: {
        xs: 'text-xxs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Names that reach the component more often than the slug the mark is filed
 * under. Everything else is matched by stripping the name down to letters and
 * digits, so `PostgreSQL`, `postgresql` and `Amazon S3` all land on their mark
 * without an entry here.
 */
const ALIASES: Record<string, ConnectorSlug> = {
  postgres: 'postgresql',
  pg: 'postgresql',
  s3: 'amazons3',
  aws3: 'amazons3',
  sfdc: 'salesforce',
  // Product names that carry an edition or suffix the mark does not: one brand,
  // one mark.
  mssql: 'sqlserver',
  microsoftsqlserver: 'sqlserver',
  dynamics365: 'dynamics',
  dynamicscrm: 'dynamics',
  quickbooksonline: 'quickbooks',
  sugarcrm: 'sugar',
  zohocrm: 'zoho',
};

const toSlug = (connector: string) =>
  connector.toLowerCase().replace(/[^a-z0-9]/g, '');

export interface ConnectorLogoProps
  extends Omit<ComponentProps<'span'>, 'children'>,
    VariantProps<typeof connectorLogoVariants> {
  /**
   * The connector, as a name or as its slug — `PostgreSQL`, `postgresql` and
   * `Amazon S3` all resolve to the same mark.
   */
  connector: string;
  /**
   * Accessible name for the mark. Leave it off when the connector's name is
   * already rendered next to the logo, which is the usual case — the mark is
   * then decorative and screen readers skip it instead of reading the name
   * twice.
   */
  label?: string;
}

/**
 * The brand mark for a data-source connector, at one of four tile sizes.
 *
 * Marks are inlined in the package, so nothing is fetched at render time and a
 * logo cannot show up as a broken image. A connector the pack does not carry
 * falls back to a monogram tile on `surface-chips` — never an empty box — so a
 * catalog row looks finished whether or not the mark exists yet.
 *
 * ```jsx
 * <ConnectorLogo connector="PostgreSQL" size="md" />
 * <ConnectorLogo connector="Fabrikam" label="Fabrikam" />  // monogram
 * ```
 *
 * Widening the pack is `scripts/gen-connector-logos.mjs`, not a code change
 * here: it re-generates `logos.ts` from the app's connector SVG folder.
 */
function ConnectorLogo({
  connector,
  label,
  size,
  className,
  ...props
}: ConnectorLogoProps) {
  const slug = toSlug(connector);
  const resolved = (ALIASES[slug] ?? slug) as ConnectorSlug;
  const mark = CONNECTOR_LOGOS[resolved];

  return (
    <span
      className={cn(connectorLogoVariants({ size }), className)}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true })}
      {...props}
    >
      {mark ? (
        <img alt="" className="h-full w-full object-contain" src={mark} />
      ) : (
        <span className={monogramVariants({ size })}>
          {connector.charAt(0)}
        </span>
      )}
    </span>
  );
}

export {
  CONNECTOR_LOGOS,
  ConnectorLogo,
  type ConnectorSlug,
  connectorLogoVariants,
};
