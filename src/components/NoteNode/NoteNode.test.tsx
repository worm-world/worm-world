import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteNode } from 'components/NoteNode/NoteNode';
import { vi } from 'vitest';

describe('NoteNode', () => {
  test('Renders', () => {
    render(<NoteNode data={''} id={''} />);
    expect(screen.getByTestId('noteNode')).toBeDefined();
  });

  test('Displays text', () => {
    const content = 'this is some content';
    render(<NoteNode data={content} id={''} />);
    expect(screen.getByText(content)).toBeDefined();
  });

  test('Calls double-click handler', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<NoteNode data={''} id={''} />);

    await user.dblClick(screen.getByTestId('noteNode'));
    expect(mockFn).toBeCalledTimes(1);
  });
});
