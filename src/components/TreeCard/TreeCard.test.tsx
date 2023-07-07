import { render, screen } from '@testing-library/react';
import TreeCard from 'components/TreeCard/TreeCard';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const MockTreeCard = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <TreeCard
        tree={mockCrossTree.simpleCrossTree}
        refreshTrees={() => {}}
        isNew={false}
      ></TreeCard>
    </BrowserRouter>
  );
};

describe('TreeCard', () => {
  test('renders', () => {
    render(<MockTreeCard />);
    expect(screen.getByText(mockCrossTree.simpleCrossTree.name)).toBeVisible();
  });

  test('Has menu', async () => {
    const user = userEvent.setup();
    render(<MockTreeCard />);
    const menuButton = screen.getByTestId('menu');
    await user.click(menuButton);
    expect(screen.getByText(/open/i)).toBeVisible();
    expect(screen.getByText(/copy/i)).toBeVisible();
  });
});
