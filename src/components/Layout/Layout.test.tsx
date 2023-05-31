import { render, screen } from '@testing-library/react';
import SideNav from 'components/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';

/**
 * Helper method to render the component for us on the "screen".
 */
const renderComponent = ({ drawerWidth = 100 }): void => {
  render(<SideNav>{}</SideNav>, {
    wrapper: BrowserRouter, // Need this wrapper since the component uses the react router
  });
};

// Describe sets up a testing "suite" for all the nested tests. You can have nested describe statements
describe('Layout', () => {
  // test instantiates a unit test inside the suite. The string param is the test name
  test('renders Layout component', () => {
    renderComponent({});
    screen.getByRole('list'); // Throws an error if the element can't be found
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(1);
  });
});
