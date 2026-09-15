import { Slot } from '@radix-ui/react-slot';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { useSidebar } from './SidebarProvider';

const sidebarMenuButtonVariants = cva(
  cn(
    'peer/menu-button',
    'group-data-[collapsible=icon]:!size-8 rounded-md',
    'flex w-full items-center gap-2',
    'text-left font-medium text-sm',
    'overflow-hidden',
    'outline-none',
    'transition-[width,height,padding]',

    //Default ink — kit: Text/Secondary; icon inherits currentColor
    'text-ink-secondary',

    //Hover — State/Hover fill only; text & icon stay Text/Secondary
    'hover:bg-state-hover',

    //Pressed — State/Pressed fill only. Deliberately `active:`, not the
    //`pressed:` variant: this button doubles as a Collapsible disclosure
    //trigger, and `pressed:` also matches [aria-expanded="true"], which would
    //leave every open group permanently painted as if it were active.
    'active:bg-state-pressed',

    //Focus state — neutral card-gap brand ring (matches Button/IconButton)
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card',

    //Disabled
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'aria-disabled:pointer-events-none',
    'aria-disabled:opacity-50',

    //Active state — neutral pressed surface + ink-body text (kit: no brand, no rail)
    'data-[active=true]:bg-state-pressed',
    'data-[active=true]:font-medium',
    'data-[active=true]:text-ink-body',

    '[&>span:last-child]:truncate',
    '[&>svg]:size-4',
    '[&>svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        default: '',
        outline: cn(
          'bg-surface-page',
          'shadow-[0_0_0_1px_hsl(var(--stroke-border))]',
          'hover:text-brand-primary',
          'hover:shadow-[0_0_0_1px_hsl(var(--stroke-border-hover))]'
        ),
        transparent: cn(
          'bg-transparent',

          //Hover state
          'hover:text-brand-primary',
          'hover:bg-transparent',
          '[&>span]:hover:text-brand-primary',

          //Active state
          'data-[active=true]:bg-transparent',
          'data-[active=true]:text-brand-tertiary',
          '[&>span]:data-[active=true]:text-brand-tertiary'
        ),
        destructive: cn(
          'text-fb-red-text',
          '[&>span]:text-fb-red-text',
          '[&>svg]:text-fb-red-text',

          //Hover state
          'hover:bg-fb-red/8',

          //Active state
          'active:bg-fb-red/12',

          //Focus state
          'focus-visible:ring-state-focus-ring',

          'data-[active=true]:bg-transparent',
          'data-[active=true]:text-fb-red-text'
        ),
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'group-data-[collapsible=icon]:!p-0 h-12 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * The primary interactive element within a SidebarMenu.
 * * Features:
 * - Automatically handles tooltips when the sidebar is in 'icon' collapsed mode.
 * - Supports an `isActive` state for current navigation highlighting.
 * - Integrates with `SidebarMenuAction` via CSS group selectors.
 * - Responsive sizing that adapts to collapsed/expanded states.
 */
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ref,
  ...props
}: ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : 'button';

  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

export { SidebarMenuButton, sidebarMenuButtonVariants };
