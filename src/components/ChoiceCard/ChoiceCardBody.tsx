import { Badge } from '../Badge';
import { Typography } from '../Typography';
import type { ChoiceCardProps } from './types';

type ChoiceCardBodyProps = Pick<
  ChoiceCardProps,
  'title' | 'badge' | 'description'
>;

const ChoiceCardBody = ({ title, badge, description }: ChoiceCardBodyProps) => (
  <span
    data-slot="choice-card-body"
    className="flex min-w-0 flex-1 flex-col gap-0.5"
  >
    <Typography
      variant="span"
      weight="medium"
      textColor="primary"
      align={null}
      data-slot="choice-card-title"
      className="inline-flex items-center gap-2"
    >
      {title}

      {badge && (
        <Badge variant="primary" size="sm">
          {badge}
        </Badge>
      )}
    </Typography>

    {description && (
      <Typography
        variant="span"
        weight="normal"
        textColor="secondary"
        align={null}
        data-slot="choice-card-description"
        className="text-xs"
      >
        {description}
      </Typography>
    )}
  </span>
);

export { ChoiceCardBody };
