import { render, screen } from '@testing-library/react';
import RightDrawer, { RightDrawerProps } from './RightDrawer';

const renderComponent = (props: RightDrawerProps): void => {
  render(<RightDrawer {...props} />, {});
};

describe('RightDrawer', () => {
  // Initial open drawer
  test('renders RightDrawer component', () => {
    renderComponent({

    });
    screen.getByRole('list'); // Throws an error if the element can't be found
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
  });

  // Initial close drawer
  test('closed SideNav is not visible', () => {
    renderComponent({ isOpen: false });

    const buttons = screen.queryAllByRole('button'); // We use queryBy to check the non-existance of an element
    expect(buttons).toHaveLength(0); // None of the sidenav buttons are visible/clickable
    const sideNav = screen.queryByRole('list');
    expect(sideNav).toBeNull();
  });
});
