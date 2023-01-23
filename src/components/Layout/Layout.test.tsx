import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Layout from 'components/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';

const renderComponent = (): void => {
  render(<Layout>{}</Layout>, {
    wrapper: BrowserRouter,
  });
};

describe('Layout', () => {
  test('renders Layout component', () => {
    renderComponent();
    screen.getByRole('main');
  });

  test('clicking menu toggles sideNav', async () => {
    const user = userEvent.setup();
    const getMarginLeft = (element: HTMLElement): number =>
      parseInt(getComputedStyle(element).marginLeft.replace('px', ''));

    renderComponent();

    const menu = screen.getByTestId('layout-menu');
    const menuBtn = within(menu).getByRole('button');
    expect(getMarginLeft(menu)).toBeGreaterThan(0);

    await user.click(menuBtn); // close the sideNav

    // wait for transition to complete
    await waitFor(() => {
      expect(getMarginLeft(menu)).toEqual(0);
    });

    await user.click(menuBtn); // nav open again
    await waitFor(() => {
      expect(getMarginLeft(menu)).toBeGreaterThan(0);
    });
  });
});
