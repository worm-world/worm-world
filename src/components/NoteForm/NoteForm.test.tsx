import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteForm from 'components/NoteForm/NoteForm';
import { vi } from 'vitest';

describe('NoteForm', () => {
  test('Renders', () => {
    render(<NoteForm header='' buttonText='' callback={() => {}} />);
    expect(screen.getByRole('heading')).toBeDefined();
    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByRole('button')).toBeDefined();
  });

  test('Displays content', () => {
    const content = 'some content here';
    render(<NoteForm header='' buttonText='' callback={() => {}} />);
    expect(screen.getByText(content)).toBeDefined();
  });

  test('Invokes setContent function on typing into textarea', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<NoteForm header='' buttonText='' callback={() => {}} />);

    await user.click(screen.getByRole('textbox'));
    await user.keyboard('abc');

    expect(mockFn).toBeCalledTimes(3);
  });

  test('Invokes callback function on button click', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<NoteForm header='' buttonText='' callback={mockFn} />);

    await user.click(screen.getByRole('button'));

    expect(mockFn).toBeCalledTimes(1);
  });
});
