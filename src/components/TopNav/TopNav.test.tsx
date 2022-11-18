import { Tab } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import { TopNav } from './TopNav';

const renderComponent = ({ title = 'test', tabIndex = 0 }): void => {
  const tabNames = ['tab1', 'tab2', 'tab3'];
  const children = tabNames.map((name) => <Tab key={name} label={name} />);

  render(
    <TopNav title={title}>
      {children} tabIndex={tabIndex}
    </TopNav>
  );
};

describe('TopNav', () => {
  test('renders topNav component', () => {
    renderComponent({});
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3);

    expect(screen.getByText('test')).toBeValid();
  });

  test('clicking tabs work correctly', () => {
    renderComponent({});
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    fireEvent.click(tabs[1]);
    const tabsAfter = screen.getAllByRole('tab');
    expect(tabsAfter[1].getAttribute('aria-selected')).toBe('true');
  });
});
