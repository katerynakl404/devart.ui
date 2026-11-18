import { Typography } from '../Typography';

/** The red asterisk after a required field's label; hidden from screen readers, which hear `required` on the control. */
export const RequiredMark = () => (
  <Typography
    variant="span"
    textColor="destructive"
    aria-hidden="true"
    // Follows the label's size: InputGroup's xs and sm labels are text-xs
    className="text-[length:inherit]"
  >
    {' *'}
  </Typography>
);
