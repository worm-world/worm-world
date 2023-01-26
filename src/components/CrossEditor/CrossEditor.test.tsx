import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import * as mockCrossTrees from 'models/frontend/CrossTree/CrossTree.mock';
import CrossEditor from 'components/CrossEditor/CrossEditor';

describe('CrossEditor', () => {
  beforeAll(() => {
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn(),
    }));
  });

  test('successfully renders', () => {
    render(<CrossEditor currentTree={mockCrossTrees.simpleCrossTree} />);

    const nodes = screen.getAllByTestId('crossNode');
    expect(nodes).toHaveLength(3);

    const title = screen.getByText(/ed3 Cross/i);
    expect(title).toBeDefined();

    const alleleNames = screen.getAllByText(/ed3/i);
    expect(alleleNames).toHaveLength(5); // title, two heterozygous, one homozygous node

    const plusses = screen.getAllByText(/\+/i);
    expect(plusses).toHaveLength(2);

    const addNewNodeButton = screen.getByText(/add new/i);
    expect(addNewNodeButton).toBeDefined();
  });

  test('can add cross nodes', async () => {
    const user = userEvent.setup();

    render(<CrossEditor currentTree={mockCrossTrees.simpleCrossTree} />);

    let nodes = screen.getAllByTestId('crossNode');
    expect(nodes).toHaveLength(3);

    const addNewNodeButton = screen.getByText(/add new/i);
    await user.click(addNewNodeButton);

    const formSubmitButton = screen.getByText(/create new cross node/i);
    expect(formSubmitButton).toBeDefined();

    await user.click(formSubmitButton);
    nodes = screen.getAllByTestId('crossNode');
    expect(nodes).toHaveLength(4);
  });
});
