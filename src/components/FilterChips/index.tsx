'use client';

import { cn } from '../../lib/utils';
import { ScrollShadow } from '../ScrollShadow';
import { ToggleGroup, ToggleGroupItem } from '../ToggleGroup';
import { Typography } from '../Typography';

interface FilterChipItem {
  value: string;
  label: string;
  /** Rendered when present; `0` still shows, only `undefined` hides it. */
  count?: number;
}

interface FilterChipsProps {
  items: FilterChipItem[];
  value: string;
  className?: string;
  /**
   * Fires with `''` when the active chip is toggled off, which is how a single
   * Radix toggle group reports deselection. A filter strip that must always
   * have a selection should ignore that value rather than store it.
   */
  onValueChange: (value: string) => void;
}

/**
 * A single-select filter strip: one scrolling row on narrow screens, wrapping
 * from `md` up (the kit's `.chip-row` scrolls at ≤767px). Selection is controlled — the strip holds no state of its own,
 * so it works equally well over a URL parameter or a store.
 *
 * The chip itself is `ToggleGroup`'s `stroke` / `xs` / `full` item — the kit's
 * `.chip` — so this component adds the row, the scroll and the count, and
 * nothing that paints a chip.
 */
const FilterChips = ({
  items,
  value,
  className,
  onValueChange,
}: FilterChipsProps) => (
  <ScrollShadow
    orientation="horizontal"
    className="w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    size={32}
  >
    <ToggleGroup
      type="single"
      value={value}
      variant="stroke"
      size="xs"
      rounded="full"
      onValueChange={onValueChange}
      className={cn(
        // Kit `.chip-row`: 6px between chips.
        'flex w-max flex-nowrap gap-1.5 md:w-full md:flex-wrap',
        className
      )}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          // Kit `.chip`: 8px between the label and the count.
          className="group gap-2 px-3"
        >
          {item.label}

          {item.count != null && (
            <Typography
              variant="p"
              textColor="light"
              // Medium weight and tabular figures are the kit's `.chip-n`
              // (label-m, `font-variant-numeric: tabular-nums`): the count
              // keeps the chip's weight, and a row of counts does not jitter
              // as the numbers change.
              weight="medium"
              className="text-xs tabular-nums group-data-[state=on]:text-ink-highlight/70"
            >
              {item.count}
            </Typography>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </ScrollShadow>
);

FilterChips.displayName = 'FilterChips';

export { FilterChips, type FilterChipItem, type FilterChipsProps };
