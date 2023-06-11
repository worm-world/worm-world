import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopNav } from 'components/TopNav/TopNav';

const renderComponent = ({ title = 'test', tabIndex = 0 }): void => {
  const tabNames = ['tab1', 'tab2', 'tab3'];
  const children = tabNames.map((name) => <span key={name}>{name}</span>);

  render(
    <TopNav title={title} tabIndex={tabIndex}>
      {children}
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

  test('clicking tabs work correctly', async () => {
    const user = userEvent.setup();
    renderComponent({});

    const tabs = await screen.findAllByRole('tab');
    expect(tabs[0].classList.contains('tab-active')).toBe(true);
    expect(tabs[1].classList.contains('tab-active')).toBe(false);

    await user.click(tabs[1]);
    expect(tabs[0].classList.contains('tab-active')).toBe(false);
    expect(tabs[1].classList.contains('tab-active')).toBe(true);
  });
});
