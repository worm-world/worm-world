import { screen, render } from '@testing-library/react';
import { NoteNode } from 'components/NoteNode/NoteNode';

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
});
