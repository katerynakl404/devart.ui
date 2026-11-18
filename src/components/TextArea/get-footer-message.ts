import type { ReactNode } from 'react';
import type { TextAreaFooterMessage } from './TextAreaFooter';

interface GetFooterMessageParams {
  fieldId: string;
  isInvalid: boolean;
  errorText?: string;
  hintText?: ReactNode;
}

/** An error takes the hint's place. */
export const getFooterMessage = ({
  fieldId,
  isInvalid,
  errorText,
  hintText,
}: GetFooterMessageParams): TextAreaFooterMessage | undefined => {
  if (isInvalid && errorText) {
    return { id: `${fieldId}-error`, content: errorText, tone: 'error' };
  }

  if (hintText) {
    return { id: `${fieldId}-hint`, content: hintText, tone: 'hint' };
  }

  return undefined;
};
