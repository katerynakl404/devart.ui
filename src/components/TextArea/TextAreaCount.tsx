import { cva } from '../../lib/cva';
import { Typography } from '../Typography';

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
