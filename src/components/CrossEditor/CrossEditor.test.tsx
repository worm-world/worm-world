import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CrossEditor from 'components/CrossEditor/CrossEditor';
import type CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTrees from 'models/frontend/CrossTree/CrossTree.mock';
import { BrowserRouter } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import { vi } from 'vitest';

const Wrapper = ({ children }: { children: JSX.Element }): JSX.Element => {
  return (
    <BrowserRouter>
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </BrowserRouter>
  );
};

describe('CrossEditor', () => {
  test('dummy test', () => {});
  beforeEach(() => {
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      disconnect: vi.fn(),
      observe: vi.fn(),
      unobserve: vi.fn(),
    }));
  });

  const renderComponent = (tree: CrossTree): void => {
    render(<CrossEditor crossTree={tree} testing={true} />, {
      wrapper: Wrapper, // Need this wrapper since the component uses the react router
    });
  };

  test('successfully renders', () => {
    renderComponent(mockCrossTrees.simpleCrossTree);

    const nodes = screen.getAllByTestId('strainNode');
    expect(nodes).toHaveLength(3 + 1); // Extra is preview node on right drawer

    const title = screen.getByText(/ed3 Cross/i);
    expect(title).toBeDefined();

    const alleleNames = screen.getAllByText(/ed3/i);
    expect(alleleNames).toHaveLength(5); // title, two heterozygous, one homozygous node

    const plusses = screen.getAllByText(/\+/i);
    expect(plusses).toHaveLength(2);

    const addNewNodeButton = screen.getByRole('button', {
      name: /add strain/i,
    });
    expect(addNewNodeButton).toBeDefined();
  });

  test('can add strain nodes', async () => {
    const user = userEvent.setup();

    renderComponent(mockCrossTrees.simpleCrossTree);

    let nodes = screen.getAllByTestId('strainNode');
    expect(nodes).toHaveLength(3 + 1); // Extra is preview node on right drawer

    const addNewNodeButton = screen.getByRole('button', {
      name: /add strain/i,
    });
    await user.click(addNewNodeButton);

    const formSubmitButton = screen.getByRole('button', {
      name: /add strain/i,
    });
    expect(formSubmitButton).toBeDefined();
    expect(formSubmitButton).toBeVisible();

    await user.click(formSubmitButton);
    await waitFor(() => {
      nodes = screen.getAllByTestId('strainNode');
      expect(nodes).toHaveLength(4);
    });
  });

  test('adds notes', async () => {
    const user = userEvent.setup();

    renderComponent(mockCrossTrees.emptyCrossTree);

    const notes = screen.queryAllByTestId('noteNode');
    expect(notes).toHaveLength(0);

    const addNoteButton = screen.getByRole('button', {
      name: /add note/i,
    });
    await user.click(addNoteButton);

    const formSubmitButton = screen.getByRole('button', { name: /create/i });
    expect(formSubmitButton).toBeDefined();
    expect(formSubmitButton).toBeVisible();

    await user.click(formSubmitButton);
    await waitFor(() => {
      const notes = screen.getAllByTestId('noteNode');
      expect(notes).toHaveLength(1);
    });

    await user.click(addNoteButton);
    await user.click(formSubmitButton);
    await waitFor(() => {
      const notes = screen.getAllByTestId('noteNode');
      expect(notes).toHaveLength(2);
    });
  });
});
