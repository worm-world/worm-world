import { fireEvent, render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from 'components/layout/layout';

const renderComponent = (): void => {
  render(<Layout />, {
    wrapper: BrowserRouter, // Need this wrapper since the component uses the react router
  });
};

describe('Layout', () => {
  test('renders Layout component', () => {
    renderComponent();
    screen.getByRole('main');
  });

  test('clicking menu toggles sideNav', () => {
    renderComponent();

    const menu = screen.getByRole('main');

    // Side nav visible when margin left is > 0
    let navMarginLeft = parseInt(
      getComputedStyle(menu).marginLeft.split('px')[0]
    );
    expect(navMarginLeft).toBeGreaterThan(0);

    const menuBtn = within(menu).getByRole('button');
    fireEvent.click(menuBtn); // click the menu button
    expect(menu).toHaveStyle('marginLeft: 0'); // SideNav not visible when margin left == 0

    fireEvent.click(menuBtn); // nav open again
    navMarginLeft = parseInt(getComputedStyle(menu).marginLeft.split('px')[0]);
    expect(navMarginLeft).toBeGreaterThan(0);
  });
});
