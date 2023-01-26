import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import EditorTop from 'components/EditorTop/EditorTop';
import { vi } from 'vitest';

describe('Editor Top', () => {
  test('Component renders', async () => {
    render(
      <EditorTop
        name='top title'
        buttons={[<button key='only'>Button title</button>]}
      />
    );
    expect(screen.getByText(/top title/)).toBeDefined();
    expect(screen.getByText(/Button title/)).toBeDefined();
  });

  test('Component renders', async () => {
    user.setup();
    const spyFn = vi.fn();
    render(
      <EditorTop
        name='top title'
        buttons={[
          <button key='only' onClick={spyFn}>
            Button title
          </button>,
        ]}
      />
    );
    await user.click(screen.getByText(/Button title/));
    expect(spyFn).toHaveBeenCalled();
  });
});
