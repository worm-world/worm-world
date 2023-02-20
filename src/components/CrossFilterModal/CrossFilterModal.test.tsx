import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CrossFilterModal } from 'components/CrossFilterModal/CrossFilterModal';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import {
  ed3HeteroHerm,
  ed3HeteroMale,
  ed3HomoHerm,
} from 'models/frontend/CrossTree/CrossTree.mock';
import { Node } from 'reactflow';
import { vi } from 'vitest';

const renderComponent = ({
  childNodes = new Array<Node<CrossNodeModel>>(),
  invisibleSet = new Set<string>(),
  toggleVisible = vi.fn(),
}): void => {
  render(
    <CrossFilterModal
      childNodes={childNodes}
      invisibleSet={invisibleSet}
      toggleVisible={toggleVisible}
    />
  );
};

describe('CrossFilterModal', () => {
  test('modal displays all nodes in map', () => {
    const childNodes = [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm];
    renderComponent({ childNodes });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(childNodes.length + 1); // +1 for the hidden checkbox controlling the modal

    // check if node models rendered
    childNodes.forEach((node) => {
      const chromPairs = [...node.data.strain.chromPairMap.values()];
      chromPairs.forEach((pair) => {
        if (pair.length > 0) {
          const pairText = pair[0].getAllele().name;
          const pairElements = screen.getAllByText(pairText);
          expect(pairElements.length).toBeGreaterThan(0);
        }
      });
    });

    // check header is there
    const header = screen.getByRole('heading');
    expect(header).toBeDefined();
  });

  test('modal unchecks nodes marked invisible', () => {
    const childNodes = [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm];
    const invisibleSet = new Set<string>(ed3HeteroHerm.id);
    renderComponent({ childNodes, invisibleSet });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(childNodes.length + 1); // +1 for the hidden checkbox controlling the modal

    expect(checkboxes[0]).not.toBeChecked(); // modal checkbox
    expect(checkboxes[1]).not.toBeChecked(); // node 0
    expect(checkboxes[2]).toBeChecked(); // node 1
    expect(checkboxes[3]).toBeChecked(); // node 2
  });

  test('clicking a strain checkbox triggers callback function', async () => {
    const childNodes = [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm];
    const toggleVisible = vi.fn();
    const user = userEvent.setup();
    renderComponent({ childNodes, toggleVisible });

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(childNodes.length + 1); // +1 for the hidden checkbox controlling the modal

    expect(toggleVisible).not.toHaveBeenCalled();
    await user.click(checkboxes[1]);
    expect(toggleVisible).toHaveBeenCalledTimes(1);

    await user.click(checkboxes[2]);
    await user.click(checkboxes[3]);
    expect(toggleVisible).toHaveBeenCalledTimes(3);
  });
});
