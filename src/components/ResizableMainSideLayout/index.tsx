'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import type { PanelSize } from 'react-resizable-panels';
import {
  type PanelImperativeHandle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../Resizable';

/**
 * Width of the open side panel, published on `<html>` so a fixed overlay
 * elsewhere in the page can dodge it without importing this layout.
 *
 * Fixed rather than configurable, the same way `--sidebar-width` is: a contract
 * two unrelated components share is only useful if both spell it identically.
 */
const SIDE_PANEL_WIDTH_CSS_VAR = '--right-dock-width';

interface ResizableMainSideLayoutProps {
  /** Expands or collapses the side panel. The open state itself is the caller's. */
  sideOpen: boolean;
  mainContent: ReactNode;
  sidePanelContent: ReactNode;
  groupId?: string;
  mainPanelId?: string;
  sidePanelId?: string;
  mainDefaultSize?: string;
  mainMinSize?: string;
  sideDefaultSize?: string;
  sideMinSize?: string;
  sideMaxSize?: string;
  sideCollapsedSize?: string;
  className?: string;
}

/**
 * A two-pane layout whose right pane collapses to nothing and expands on
 * demand — a preview, an artifact panel, a details dock.
 *
 * Sizes are not persisted: every mount starts from the defaults.
 */
const ResizableMainSideLayout = ({
  sideOpen,
  mainContent,
  sidePanelContent,
  groupId = 'resizable-main-side-layout',
  mainPanelId = 'resizable-main',
  sidePanelId = 'resizable-side',
  mainDefaultSize = '65%',
  mainMinSize = '40%',
  sideDefaultSize = '35%',
  sideMinSize = '25%',
  sideMaxSize = '60%',
  sideCollapsedSize = '0%',
  className,
}: ResizableMainSideLayoutProps) => {
  const sidePanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    const panel = sidePanelRef.current;
    if (!panel) return;

    if (sideOpen) {
      panel.expand();
    } else {
      panel.collapse();
    }
  }, [sideOpen]);

  useEffect(
    () => () => {
      // Reset the shared dock width CSS var on unmount.
      document.documentElement.style.removeProperty(SIDE_PANEL_WIDTH_CSS_VAR);
    },
    []
  );

  const publishSideWidth = (panelSize: PanelSize) => {
    document.documentElement.style.setProperty(
      SIDE_PANEL_WIDTH_CSS_VAR,
      `${Math.round(panelSize.inPixels)}px`
    );
  };

  return (
    <ResizablePanelGroup
      id={groupId}
      className={className}
      orientation="horizontal"
    >
      <ResizablePanel
        defaultSize={mainDefaultSize}
        id={mainPanelId}
        minSize={mainMinSize}
      >
        {mainContent}
      </ResizablePanel>

      {/* Hidden rather than unmounted: dropping the handle would renumber the
          group's children and reset the panels' sizes. */}
      <ResizableHandle className={sideOpen ? undefined : 'hidden'} withHandle />

      <ResizablePanel
        aria-hidden={sideOpen ? undefined : true}
        inert={!sideOpen}
        collapsedSize={sideCollapsedSize}
        collapsible
        defaultSize={sideDefaultSize}
        id={sidePanelId}
        maxSize={sideMaxSize}
        minSize={sideMinSize}
        panelRef={sidePanelRef}
        onResize={publishSideWidth}
      >
        {sidePanelContent}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

ResizableMainSideLayout.displayName = 'ResizableMainSideLayout';

export {
  ResizableMainSideLayout,
  type ResizableMainSideLayoutProps,
  SIDE_PANEL_WIDTH_CSS_VAR,
};
