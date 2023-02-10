import { render, screen } from '@testing-library/react';
import SavedTreeCard from './SavedTreeCard';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const MockSavedTreeCard = (): JSX.Element => {
  return (
    <BrowserRouter>
      <SavedTreeCard
        tree={mockCrossTree.simpleCrossTree}
        refreshTrees={() => {}}
      ></SavedTreeCard>
    </BrowserRouter>
  );
};

describe('SavedTreeCard', () => {
  test('renders', () => {
    render(<MockSavedTreeCard />);
    expect(screen.getByText(mockCrossTree.simpleCrossTree.name)).toBeVisible();
    expect(
      screen.getByText(mockCrossTree.simpleCrossTree.description)
    ).toBeVisible();
  });

  test('Has menu', async () => {
    const user = userEvent.setup();
    render(<MockSavedTreeCard />);
    const menuButton = screen.getByTestId('menu');
    await user.click(menuButton);
    expect(screen.getByText(/open/i)).toBeVisible();
    expect(screen.getByText(/copy/i)).toBeVisible();
  });
});
