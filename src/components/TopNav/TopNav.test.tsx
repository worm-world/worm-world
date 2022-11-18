import { Tab } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TopNav } from './TopNav';

const renderComponent = ({ title = 'test' }): void => {
  render(
    <TopNav title={title}>
      {' '}
      <Tab />{' '}
    </TopNav>,
    {
      wrapper: BrowserRouter, // Need this wrapper since the component uses the react router
    }
  );
};

describe('TopNav', () => {
  test('renders topNav component', () => {
    renderComponent({});
    screen.getByRole('tab'); // Throws an error if the element can't be found
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);
  });
});
