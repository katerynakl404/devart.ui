import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../index';

const renderTooltip = () =>
  render(
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>Save</TooltipTrigger>
        <TooltipContent>Save the draft</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

describe('TooltipTrigger', () => {
  it('opens on focus from the keyboard', () => {
    renderTooltip();
    fireEvent.keyDown(document.body, { key: 'Tab' });
    act(() => screen.getByRole('button', { name: 'Save' }).focus());

    expect(screen.getByRole('tooltip')).toHaveTextContent('Save the draft');
  });

  // A menu closed with the mouse hands focus back to its button
  it('stays shut on focus that follows a pointer press', () => {
    renderTooltip();
    fireEvent.pointerDown(document.body);
    act(() => screen.getByRole('button', { name: 'Save' }).focus());

    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
