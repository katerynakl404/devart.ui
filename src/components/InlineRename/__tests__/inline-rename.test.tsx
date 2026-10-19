import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InlineRename, type InlineRenameProps } from '../index';

const field = () => screen.getByRole('textbox', { name: 'Chat name' });

/** The field focuses a tick after it mounts (see the component). */
const flushOpen = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 0)));

const renderField = async (overrides: Partial<InlineRenameProps> = {}) => {
  const onCommit = vi.fn();
  const onCancel = vi.fn();
  render(
    <InlineRename
      aria-label="Chat name"
      defaultValue="Q1 revenue"
      onCommit={onCommit}
      onCancel={onCancel}
      {...overrides}
    />
  );
  await flushOpen();
  return { onCommit, onCancel };
};

describe('InlineRename', () => {
  it('opens focused, holding the title, all of it selected', async () => {
    await renderField();

    expect(field()).toHaveFocus();
    expect(field()).toHaveValue('Q1 revenue');
    expect((field() as HTMLInputElement).selectionStart).toBe(0);
    expect((field() as HTMLInputElement).selectionEnd).toBe(10);
  });

  it('commits the trimmed title on Enter', async () => {
    const { onCommit, onCancel } = await renderField();

    fireEvent.change(field(), { target: { value: '  Q2 revenue  ' } });
    fireEvent.keyDown(field(), { key: 'Enter' });

    expect(onCommit).toHaveBeenCalledExactlyOnceWith('Q2 revenue');
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('commits on blur', async () => {
    const { onCommit } = await renderField();

    fireEvent.change(field(), { target: { value: 'Q2 revenue' } });
    fireEvent.blur(field());

    expect(onCommit).toHaveBeenCalledExactlyOnceWith('Q2 revenue');
  });

  /** Enter closes the field, and closing it blurs it. One rename, not two. */
  it('commits once when Enter is followed by blur', async () => {
    const { onCommit, onCancel } = await renderField();

    fireEvent.change(field(), { target: { value: 'Q2 revenue' } });
    fireEvent.keyDown(field(), { key: 'Enter' });
    fireEvent.blur(field());

    expect(onCommit).toHaveBeenCalledOnce();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('cancels on Esc, and the blur after it does not commit', async () => {
    const { onCommit, onCancel } = await renderField();

    fireEvent.change(field(), { target: { value: 'Q2 revenue' } });
    fireEvent.keyDown(field(), { key: 'Escape' });
    fireEvent.blur(field());

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it.each([
    ['empty', '   '],
    ['unchanged', 'Q1 revenue'],
  ])('treats an %s title as a cancel', async (_, value) => {
    const { onCommit, onCancel } = await renderField();

    fireEvent.change(field(), { target: { value } });
    fireEvent.keyDown(field(), { key: 'Enter' });

    expect(onCommit).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledOnce();
  });

  /** Enter while an IME is composing picks a candidate; it is not a commit. */
  it('ignores Enter mid-composition', async () => {
    const { onCommit, onCancel } = await renderField();

    fireEvent.keyDown(field(), { key: 'Enter', isComposing: true });

    expect(onCommit).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('keeps its clicks and keys away from the row it sits in', async () => {
    const onRowClick = vi.fn();
    const onRowKeyDown = vi.fn();
    render(
      <div onClick={onRowClick} onKeyDown={onRowKeyDown}>
        <InlineRename
          aria-label="Chat name"
          defaultValue="Q1 revenue"
          onCommit={() => {}}
          onCancel={() => {}}
        />
      </div>
    );
    await flushOpen();

    fireEvent.click(field());
    fireEvent.keyDown(field(), { key: ' ' });
    fireEvent.keyDown(field(), { key: 'Enter' });

    expect(onRowClick).not.toHaveBeenCalled();
    expect(onRowKeyDown).not.toHaveBeenCalled();
  });
});
