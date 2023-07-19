import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import EditorTop from 'components/EditorTop/EditorTop';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { vi } from 'vitest';

describe('Editor Top', () => {
  test('Component renders', async () => {
    render(
      <EditorTop
        crossDesign={
          new CrossDesign({
            name: 'My Tree',
            nodes: [],
            edges: [],
            lastSaved: new Date(),
            offspringFilters: new Map(),
            editable: true,
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
        crossDesign={
          new CrossDesign({
            name: 'My Tree',
            nodes: [],
            edges: [],
            lastSaved: new Date(),
            offspringFilters: new Map(),
            editable: true,
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
