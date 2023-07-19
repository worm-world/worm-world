import { render, screen } from '@testing-library/react';
import CrossDesignCard from 'components/CrossDesignCard/CrossDesignCard';
import * as crossDesigns from 'models/frontend/CrossDesign/CrossDesign.mock';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const MockCrossDesignCard = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <CrossDesignCard
        crossDesign={crossDesigns.simpleCrossDesign}
        refreshCrossDesigns={() => {}}
        isNew={false}
      ></CrossDesignCard>
    </BrowserRouter>
  );
};

describe('CrossDesignCard', () => {
  test('renders', () => {
    render(<MockCrossDesignCard />);
    expect(screen.getByText(crossDesigns.simpleCrossDesign.name)).toBeVisible();
  });

  test('Has menu', async () => {
    const user = userEvent.setup();
    render(<MockCrossDesignCard />);
    const menuButton = screen.getByTestId('menu');
    await user.click(menuButton);
    expect(screen.getByText(/open/i)).toBeVisible();
    expect(screen.getByText(/copy/i)).toBeVisible();
  });
});
