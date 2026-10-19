import { act, fireEvent, render, screen } from '@testing-library/react';
import { Database } from 'lucide-react';
import type { ReactNode } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  SidebarChatItem,
  type SidebarContextProps,
  SidebarMenuRow,
  SidebarMobileTrigger,
  SidebarNavItem,
  SidebarPanelHeader,
  SidebarProvider,
  SidebarStat,
  SidebarTrigger,
  SidebarUser,
  useSidebar,
} from '../index';

// `SidebarProvider` reads the viewport through `useMaxWidth`; jsdom ships no
// `matchMedia`. Always-desktop is the state these contracts are asserted in.
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

const withProvider = (ui: ReactNode) =>
  render(<SidebarProvider defaultOpen>{ui}</SidebarProvider>);

/** Attribute match, so the slash in `group/brand` needs no CSS escaping. */
const brandRow = (root: HTMLElement) =>
  root.querySelector('[class*="group/brand"]');

describe('SidebarTrigger', () => {
  it('stamps the marker consumers select it by', () => {
    withProvider(<SidebarTrigger label="Collapse sidebar" />);

    const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(trigger.getAttribute('data-sidebar')).toBe('trigger');
  });

  /** Wrapping in a tooltip must not move the marker onto another element. */
  it('keeps the marker on the button when a tooltip is enabled', () => {
    withProvider(<SidebarTrigger label="Collapse sidebar" tooltip />);

    const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(trigger.getAttribute('data-sidebar')).toBe('trigger');
  });

  /**
   * The sheet focuses inside as it opens; a tooltip answering that focus pops
   * with no pointer near it. Wider than the viewport = always the sheet.
   */
  it('drops its tooltip while the sidebar is the sheet', () => {
    render(
      <SidebarProvider sheetBreakpoint={99_999}>
        <SidebarTrigger label="Collapse sidebar" tooltip />
      </SidebarProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
    act(() => trigger.focus());
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows its tooltip on the desktop layout', () => {
    withProvider(<SidebarTrigger label="Collapse sidebar" tooltip />);

    const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
    act(() => trigger.focus());
    expect(screen.getByRole('tooltip')).toHaveTextContent('Collapse sidebar');
  });
});

describe('SidebarMobileTrigger', () => {
  /**
   * Consumers separate the two triggers with `:not([data-sidebar])`. Stamping
   * the attribute here would silently make every such selector match both.
   */
  it('carries no data-sidebar attribute', () => {
    withProvider(<SidebarMobileTrigger label="Toggle sidebar" />);

    const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
    expect(trigger.hasAttribute('data-sidebar')).toBe(false);
  });

  it('shows its name as a tooltip when asked, and keeps no marker', () => {
    withProvider(<SidebarMobileTrigger label="Open sidebar" tooltip />);

    const trigger = screen.getByRole('button', { name: 'Open sidebar' });
    act(() => trigger.focus());
    expect(screen.getByRole('tooltip')).toHaveTextContent('Open sidebar');
    expect(trigger.hasAttribute('data-sidebar')).toBe(false);
  });
});

describe('SidebarNavItem', () => {
  it('renders the icon and label inside the caller’s own link', () => {
    withProvider(
      <SidebarNavItem asChild icon={Database} label="Data sources">
        {/* biome-ignore lint/a11y/useAnchorContent: the row injects icon and label as this anchor's children */}
        <a href="/sources" data-status="active" aria-current="page" />
      </SidebarNavItem>
    );

    const link = screen.getByRole('link', { name: 'Data sources' });
    expect(link.getAttribute('href')).toBe('/sources');
    expect(link.textContent).toContain('Data sources');
    expect(link.querySelector('svg')).not.toBeNull();
  });

  /** e2e asserts `aria-current="page"`, so the slot must not drop it. */
  it('preserves the routing attributes the caller set', () => {
    withProvider(
      <SidebarNavItem asChild icon={Database} label="Data sources">
        {/* biome-ignore lint/a11y/useAnchorContent: the row injects icon and label as this anchor's children */}
        <a href="/sources" data-status="active" aria-current="page" />
      </SidebarNavItem>
    );

    const link = screen.getByRole('link', { name: 'Data sources' });
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.getAttribute('data-status')).toBe('active');
  });

  it('drops the active styling when the row is not activatable', () => {
    const { rerender } = withProvider(
      <SidebarNavItem href="/chat" icon={Database} label="New chat" />
    );

    expect(screen.getByRole('link', { name: 'New chat' }).className).toContain(
      'data-[status=active]:bg-state-pressed'
    );

    rerender(
      <SidebarProvider defaultOpen>
        <SidebarNavItem
          href="/chat"
          icon={Database}
          label="New chat"
          activatable={false}
        />
      </SidebarProvider>
    );

    expect(
      screen.getByRole('link', { name: 'New chat' }).className
    ).not.toContain('data-[status=active]:bg-state-pressed');
  });

  /** The name stays the label; the badge is said after it, rail included. */
  it('describes the row with its badge, and hides the badge on the rail', () => {
    withProvider(
      <SidebarNavItem
        badge={<span>3</span>}
        href="/sources"
        icon={Database}
        label="Data sources"
      />
    );

    const link = screen.getByRole('link', { name: 'Data sources' });
    expect(link).toHaveAccessibleDescription('3');
    expect(screen.getByText('3').parentElement?.className).toContain(
      'group-data-[collapsible=icon]:hidden'
    );
  });

  it('sets an element icon in the glyph’s own box', () => {
    withProvider(
      <SidebarNavItem
        href="/warehouse"
        icon={<svg data-testid="mark" />}
        label="Warehouse"
      />
    );

    const mark = screen.getByTestId('mark');
    expect(screen.getByRole('link', { name: 'Warehouse' })).toContainElement(
      mark
    );
    expect(mark.parentElement?.className).toContain('size-4');
  });
});

describe('SidebarPanelHeader', () => {
  const logoIcon = (
    <a href="/home" aria-label="Home">
      <span>Acme</span>
    </a>
  );

  /** Trigger swap classes live on the wrapper — Tooltip roots have no DOM. */
  const triggerWrap = (button: HTMLElement) => button.parentElement;

  it('merges the logo classes onto the caller’s own element', () => {
    const { container } = withProvider(
      <SidebarPanelHeader logoIcon={logoIcon} />
    );

    expect(brandRow(container)).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Home' }).className).toContain(
      'flex min-w-0 flex-1 items-center'
    );
    expect(
      triggerWrap(screen.getByRole('button', { name: 'Toggle Sidebar' }))
        ?.className
    ).toContain('group-data-[collapsible=icon]:size-full');
  });

  /**
   * The collapsed swap is opacity-only. Switching it to `display` keeps
   * Storybook green, drops the trigger out of the tab order, and breaks
   * consumer tests that read accumulated opacity rather than visibility.
   */
  it('hides the swapped-out element with opacity, never display', () => {
    withProvider(<SidebarPanelHeader logoIcon={logoIcon} />);

    const logo = screen.getByRole('link', { name: 'Home' });
    const wrap = triggerWrap(
      screen.getByRole('button', { name: 'Toggle Sidebar' })
    );

    expect(logo.className).toContain(
      'group-data-[collapsible=icon]:group-hover/brand:opacity-0'
    );
    expect(wrap?.className).toContain(
      'group-data-[collapsible=icon]:opacity-0'
    );
    expect(wrap?.className).toContain(
      'group-data-[collapsible=icon]:group-hover/brand:opacity-100'
    );
    expect(wrap?.className).not.toContain('hidden');
  });

  /** Slot-on-Tooltip would leave the logo painted under a visible trigger. */
  it('keeps the swap wrapper when the trigger is tooltip-wrapped', () => {
    withProvider(
      <SidebarPanelHeader
        logoIcon={logoIcon}
        sidebarTrigger={
          <SidebarTrigger tooltip label="Collapse sidebar" variant="tertiary" />
        }
      />
    );

    const wrap = triggerWrap(
      screen.getByRole('button', { name: 'Collapse sidebar' })
    );

    expect(wrap?.className).toContain(
      'group-data-[collapsible=icon]:opacity-0'
    );
  });
});

describe('SidebarMenuRow', () => {
  const arrow = (row: HTMLElement) =>
    row.querySelector('svg.lucide-arrow-up-right');

  it('reports a selection through onSelect', () => {
    const onSelect = vi.fn();
    render(
      <SidebarMenuRow icon={Database} label="Settings" onSelect={onSelect} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('renders the icon it was given, and nothing in its place otherwise', () => {
    const { rerender } = render(
      <SidebarMenuRow icon={Database} label="Settings" />
    );

    const icon = screen
      .getByRole('button', { name: 'Settings' })
      .querySelector('svg.lucide-database');
    expect(icon).toHaveClass('text-ink-secondary');

    rerender(<SidebarMenuRow label="Settings" />);
    expect(
      screen.getByRole('button', { name: 'Settings' }).querySelector('svg')
    ).toBeNull();
  });

  /** `isExternal` only draws the affordance — opening anything stays with the caller’s anchor. */
  it('draws the outbound arrow only for external rows', () => {
    const { rerender } = render(
      <SidebarMenuRow label="Documentation" isExternal />
    );
    expect(
      arrow(screen.getByRole('button', { name: 'Documentation' }))
    ).not.toBeNull();

    rerender(<SidebarMenuRow label="Documentation" />);
    expect(
      arrow(screen.getByRole('button', { name: 'Documentation' }))
    ).toBeNull();
  });

  it('lets a trailing slot take the arrow’s place even on an external row', () => {
    render(
      <SidebarMenuRow
        label="Documentation"
        isExternal
        trailingSlot={<span>Beta</span>}
      />
    );

    const row = screen.getByRole('button', { name: /^Documentation/ });
    expect(row).toHaveTextContent('Beta');
    expect(arrow(row)).toBeNull();
  });
});

describe('SidebarProvider', () => {
  /** Drives `useMaxWidth`: it reads `innerWidth` on every media change. */
  const viewport = () => {
    const listeners = new Set<() => void>();
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_: string, listener: () => void) =>
        listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) =>
        listeners.delete(listener),
    })) as unknown as typeof window.matchMedia;
    const resize = (width: number) => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: width,
      });
      for (const listener of listeners) listener();
    };
    const restore = () => {
      window.matchMedia = original;
      resize(1024);
    };
    return { resize, restore };
  };

  /** A sheet left open would spring back the next time the window narrows. */
  it('closes the sheet when the viewport leaves the mobile size', () => {
    const { resize, restore } = viewport();
    resize(500);
    let sidebar: SidebarContextProps | undefined;
    const Probe = () => {
      sidebar = useSidebar();
      return null;
    };
    const { unmount } = render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>
    );

    act(() => sidebar?.setOpenMobile(true));
    expect(sidebar?.openMobile).toBe(true);

    act(() => resize(1400));
    expect(sidebar?.isMobile).toBe(false);
    expect(sidebar?.openMobile).toBe(false);

    act(() => resize(500));
    expect(sidebar?.isMobile).toBe(true);
    expect(sidebar?.openMobile).toBe(false);

    unmount();
    restore();
  });
});

describe('SidebarChatItem', () => {
  const menu = <span />;

  it('names the kebab with menuLabel and shows the same as its tooltip', () => {
    withProvider(
      <SidebarChatItem href="/chats/1" menu={menu} menuLabel="Chat actions">
        Message queue
      </SidebarChatItem>
    );

    const kebab = screen.getByRole('button', { name: 'Chat actions' });
    act(() => kebab.focus());
    expect(screen.getByRole('tooltip')).toHaveTextContent('Chat actions');
  });

  /**
   * Below `lg` and on touch the kebab never hides, so the link keeps room for
   * it for good. Swapping either for a hover-only rule leaves a phone with no
   * way into the row menu.
   */
  it('keeps the kebab, and room for it, where there is no hover', () => {
    withProvider(
      <SidebarChatItem href="/chats/1" menu={menu}>
        Message queue
      </SidebarChatItem>
    );

    const kebab = screen.getByRole('button', { name: 'More actions' });
    expect(kebab.className).toContain('max-lg:opacity-100');
    expect(kebab.className).toContain('[@media(hover:none)]:opacity-100');

    const link = screen.getByRole('link', { name: 'Message queue' });
    expect(link.className).toContain('max-lg:pr-8');
    expect(link.className).toContain('[@media(hover:none)]:pr-8');
  });

  it('reserves no room on a row without a menu', () => {
    withProvider(
      <SidebarChatItem href="/chats/1">Message queue</SidebarChatItem>
    );

    expect(
      screen.getByRole('link', { name: 'Message queue' }).className
    ).not.toContain('pr-8');
  });

  /** The label replaces the bare number for the ear; the eye keeps both. */
  it('speaks the count label in place of the number, and tips the count', () => {
    withProvider(
      <SidebarChatItem
        count={3}
        countLabel="3 messages queued — still sending"
        href="/chats/1"
      >
        Message queue
      </SidebarChatItem>
    );

    expect(
      screen.getByRole('link', {
        name: /^Message queue\s*3 messages queued — still sending$/,
      })
    ).toBeInTheDocument();
    const counter = screen.getByText('3');
    expect(counter).toHaveAttribute('aria-hidden', 'true');
    // A tooltip trigger stamps its state on the element it wraps.
    expect(counter).toHaveAttribute('data-state', 'closed');
  });

  it('reads the bare number when there is no count label', () => {
    withProvider(
      <SidebarChatItem count={3} href="/chats/1">
        Message queue
      </SidebarChatItem>
    );

    expect(
      screen.getByRole('link', { name: /^Message queue\s*3$/ })
    ).toBeInTheDocument();
    expect(screen.getByText('3')).not.toHaveAttribute('aria-hidden');
  });
});

describe('SidebarUser', () => {
  /**
   * Collapsed to the avatar, the button's only name is this text. Hiding it
   * with `display` would leave the account menu's trigger unnamed on the rail.
   */
  it('keeps the name as visually hidden text on the rail, never removed', () => {
    withProvider(
      <SidebarUser avatar={<span />} meta="Admin · Free" name="Kateryna K." />
    );

    expect(
      screen.getByRole('button', { name: /Kateryna K\.\s*Admin · Free/ })
    ).toBeInTheDocument();
    const info = screen.getByText('Kateryna K.').parentElement;
    expect(info?.className).toContain('group-data-[collapsible=icon]:sr-only');
    expect(info?.className).not.toContain(
      'group-data-[collapsible=icon]:hidden'
    );
  });
});

describe('SidebarStat', () => {
  it('is a button by default', () => {
    withProvider(<SidebarStat label="Balance" value="9,480 left" />);

    expect(
      screen.getByRole('button', { name: /Balance\s*9,480 left/ })
    ).toHaveAttribute('type', 'button');
  });

  it('renders the caller’s element with asChild, label and value inside', () => {
    const { container } = withProvider(
      <SidebarStat asChild label="Balance" value="9,480 left">
        <div />
      </SidebarStat>
    );

    const row = container.querySelector('[data-sidebar="stat"]');
    expect(row?.tagName).toBe('DIV');
    expect(row).not.toHaveAttribute('type');
    expect(row).toHaveTextContent('Balance9,480 left');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
