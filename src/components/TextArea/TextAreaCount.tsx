import { cva } from '../../lib/cva';
import { Typography } from '../Typography';

// The kit's `.ta-count`: Body 12 in --ink-inactive, right-aligned. The line
// height is the one `text-xs` pairs with (16px, the kit's Body 12) — the same
// line as the error text it shares the row with, so the row keeps its height
// when the error comes and goes.
export const textAreaCountVariants = cva(
  'ms-auto shrink-0 text-xs tabular-nums',
  {
    variants: {
      overLimit: {
        true: 'text-fb-red-text',
        false: 'text-ink-inactive',
      },
    },
    defaultVariants: {
      overLimit: false,
    },
  }
);

interface TextAreaCountProps {
  id: string;
  length: number;
  limit?: number;
  disabled?: boolean;
}

export const TextAreaCount = ({
  id,
  length,
  limit,
  disabled = false,
}: TextAreaCountProps) => {
  const overLimit = !disabled && limit !== undefined && length > limit;

  return (
    <Typography
      id={id}
      element="span"
      textStyle="body12"
      noWrap
      className={textAreaCountVariants({ overLimit })}
    >
      {limit === undefined ? length : `${length} / ${limit}`}
    </Typography>
  );
};
