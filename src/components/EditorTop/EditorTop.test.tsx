import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import EditorTop from 'components/EditorTop/EditorTop';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { vi } from 'vitest';

describe('Editor Top', () => {
  test('Component renders', async () => {
    render(
      <EditorTop
        tree={
          new CrossTree({
            name: 'My Tree',
            description: '',
            settings: { longName: false, contents: false },
            nodes: [],
            edges: [],
            lastSaved: new Date(),
            invisibleNodes: new Set<string>(),
            crossFilters: new Map(),
          })
        }
        buttons={[<button key='only'>Button title</button>]}
      />
    );
    expect(screen.getByRole('heading')).toBeDefined();
    expect(screen.getByRole('button')).toBeDefined();
  });

  test('Button callback called on click', async () => {
    user.setup();
    const spyFn = vi.fn();
    render(
      <EditorTop
        tree={
          new CrossTree({
            name: 'My Tree',
            description: '',
            settings: { longName: false, contents: false },
            nodes: [],
            edges: [],
            lastSaved: new Date(),
            invisibleNodes: new Set<string>(),
            crossFilters: new Map(),
          })
        }
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
