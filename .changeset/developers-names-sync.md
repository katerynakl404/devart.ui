---
'@devart/ui-react': major
---

Take the developers' names, parts and fixes from `upstream` 1.1.0
(`upstream/master` 81596ad, and `ActivityTray` from their AIINS-1948 branch).
Names, exports, props and variant keys now match theirs; visual classes stay the
design kit's wherever this package already carried them.

Renamed or replaced — update call sites:

- `Button` / `IconButton` `variant="tertiaryBrand"` → `variant="primaryTertiary"`.
  Same recipe: a brand label on the neutral tertiary pill.
- `DataSourceCard` → `IconCard` (+ `IconCardSkeleton`, `iconCardVariants`):
  `icon`, `label`, `badge`, `actionLabel`, `actionIcon`, `onActivate`,
  `disabled`. Pass a `ConnectorLogo` as `icon`.
- `UploadTray` / `UploadTrayItem` → `ActivityTray` / `ActivityTrayItem`, the
  developers' generic tray of async operations.
- `FilterChips` takes `items` (`FilterChipItem`), `value`, `onValueChange`;
  `FilterChip`, `FilterChipProps` and `filterChipVariants` are gone.
- `SidebarBrand` → `SidebarPanelHeader` (`logoIcon`, `sidebarTrigger`). On the
  icon rail the mark and the collapse trigger share one square and swap on
  hover or keyboard focus.
- `formFocusRing` is removed from `@devart/ui-react/cn`; use `focusRing`.

Added: `AsyncList`, `ListPageLayout`, `ListSelectionBar`,
`ResizableMainSideLayout`, `SelectableListCard`, `SidebarNavItem`,
`SidebarMenuRow`, `SidebarMobileTrigger`; `SidebarTrigger` takes `icon`,
`tooltip` and `tooltipSide`. Recipes that were module-private are exported next
to their component: `avatarFallbackVariants`, `iconButtonVariants`,
`progressVariants`, `progressIndicatorVariants`, `radioContainerVariants`,
`radioIndicatorVariants`, `separatorVariants`, `sheetVariants`, `haloVariants`,
`stepSliderVariants`, `stepSliderStopsVariants`, `stepSliderThumbVariants`,
`switchContainerVariants`, `switchThumbVariants`, `typographyVariants`.

Fixed:

- `Checkbox`, `Switch` and `RadioButton` focus with the brand ring, as the kit's
  `.cbx` / `.swt` do (`--shadow-focus` → `--focus-ring-brand`). Fields — `Input`,
  `TextArea`, `InputGroup` — keep the neutral `--input-focus` border.
- `SidebarMenuButton`'s destructive row focuses with the brand ring.
- `AccordionItem variant="divided"` drew no divider: `not-last:` is a Tailwind v4
  variant. It is now `border-b last:border-b-0`.
- `CodeBlock`'s surface named `bg-surface-bg`, which is not a token here, so it
  had no background. It is `bg-surface-page` — the developers' `--bg` is
  Slate-50 / Grey-950, the same as `--surface-page` in both themes.
- `File` no longer uses `role="div"` or nests its retry / dismiss buttons inside
  a button: the row's action sits on the content area, beside them. The chip
  takes its pressed fill only when that area is pressed.
- `Autocomplete` declares one combobox (the input); its empty and loading states
  announce as a single unselectable option; the walk past disabled options is
  bounded, so a list where every option is disabled no longer hangs the tab.
  The option's `key` is no longer spread into JSX.
- `CheckboxGroup` derives the next selection from `value`, so a parent that
  rejects a change is respected.
- `ScrollShadow` is focusable, so its content scrolls without a pointer.
