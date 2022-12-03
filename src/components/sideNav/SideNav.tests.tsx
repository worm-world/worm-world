/**
 * Main idea for writing a test for React Components:
 *
 * Components are subject to change. This traditionally makes writing tests for them pretty brittle.
 * Imagine writing a test that your component says "Hello <User>". If later down the line, we decide we want the component
 * to actually say "Welcome <User>", this would require us to rewrite all the tests to fit the new text. Obvously, NOT fun
 * and super brittle to work with. Key point: DO NOT TEST IMPLEMENTATION DETAILS
 *
 * Instead, we want to test that the component does what we intended it to. WE ARE TESTING FUNCTIONALITY.
 * When writing tests, take the perspective of a user and test the interactions they might take. For example, say we have a
 * component with a button. Clicking the button would make an api request. We then would be testing the button still functionally
 * works --> test that clicking the button fires an event. Most components we build will have some sort of functionality/logic, and
 * that is what should be tested.
 *
 * Key idea: Test logic/functionality NOT appearance of a component
 *
 *  -----------------------------
 *
 * Writing a test:
 * 1. Render the application
 * 2. Use screen.getBy<searchMethod> to access a specific part of the component
 * 3. Make assertions or interact with that selected portion of the component
 *
 *  -----------------------------
 *
 * Final notes:
 *
 * I really like the getByRole search method since that is less brittle than getByText. If you are struggling to figure out what role to use,
 * check out the Chrome Extension: Testing Playgroung (https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano/related?hl=en)
 * It's pretty cool and intuitive to use.
 *
 * The documentation has a pretty comprehensive example you can look at for ideas of how to test your component:
 * https://testing-library.com/docs/react-testing-library/example-intro
 *
 * Please take the time to read up on React Testing Library and the API available to you
 * https://testing-library.com/docs/react-testing-library/api
 *
 * Also note that there is a difference between findBy, getBy, and queryBy. Read up to make sure you understand what those mean. (*hint* findBy needs to be awaited)
 * https://testing-library.com/docs/queries/about/
 * https://testing-library.com/docs/react-testing-library/cheatsheet
 *
 */

import { render, screen } from '@testing-library/react';
import SideNav from 'components/sideNav/SideNav';
import { BrowserRouter } from 'react-router-dom';

/**
 * Helper method to render the component for us on the "screen".
 */
const renderComponent = ({ isOpen = true, drawerWidth = 100 }): void => {
  render(<SideNav drawerWidth={drawerWidth} isOpen={isOpen} />, {
    wrapper: BrowserRouter, // Need this wrapper since the component uses the react router
  });
};

// Describe sets up a testing "suite" for all the nested tests. You can have nested describe statements
describe('SideNav', () => {
  // test instantiates a unit test inside the suite. The string param is the test name
  test('renders SideNav component', () => {
    renderComponent({});
    screen.getByRole('list'); // Throws an error if the element can't be found
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
  });

  test('closed SideNav is not visible', () => {
    renderComponent({ isOpen: false });

    const buttons = screen.queryAllByRole('button'); // We use queryBy to check the non-existance of an element
    expect(buttons).toHaveLength(0); // None of the sidenav buttons are visible/clickable
    const sideNav = screen.queryByRole('list');
    expect(sideNav).toBeNull();
  });
});
