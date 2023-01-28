import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CrossNodeMenu } from 'components/CrossNodeMenu/CrossNodeMenu';
import { vi } from 'vitest';

describe('CrossNodeMenu', () => {
  test('renders correctly', () => {
    const basicItems = [
      {
        text: 'option 1',
        menuCallback: () => {},
      },
      {
        text: 'option 2',
        menuCallback: () => {},
      },
    ];
    render(<CrossNodeMenu items={basicItems} />);
    const menu = screen.getByTestId('crossNodeMenu');
    expect(menu).toBeDefined();

    const options = screen.getAllByRole('listitem');
    expect(options).toHaveLength(basicItems.length + 1); // include dropdown label
  });

  test("menu with no items doesn't show dropdown when clicked", async () => {
    const user = userEvent.setup();
    render(<CrossNodeMenu items={[]} />);

    const menu = screen.getByTestId('crossNodeMenu');
    expect(menu).toBeDefined();

    let options = screen.queryAllByRole('listitem');
    expect(options).toHaveLength(0);

    await user.click(menu);
    options = screen.queryAllByRole('listitem');
    expect(options).toHaveLength(0);
  });

  test('menu option callbacks fire when clicked', async () => {
    const user = userEvent.setup();
    const opt1Callback = vi.fn();
    const opt2Callback = vi.fn();
    const opt3Callback = vi.fn();
    const items = [
      {
        text: 'option 1',
        menuCallback: opt1Callback,
      },
      {
        text: 'option 2',
        menuCallback: opt2Callback,
      },
      {
        text: 'option 3',
        menuCallback: opt3Callback,
      },
    ];

    render(<CrossNodeMenu items={items} />);

    const menu = screen.getByTestId('crossNodeMenu');
    expect(menu).toBeDefined();

    const options = screen.getAllByText(/option/);
    expect(options).toHaveLength(items.length);
    expect(opt1Callback).not.toBeCalled();

    await user.click(options[0]); // haven't expanded dropdown yet
    expect(opt1Callback).toBeCalledTimes(1);
    expect(opt2Callback).not.toBeCalled();
    expect(opt3Callback).not.toBeCalled();

    await user.click(options[1]);
    await user.click(options[2]);
    expect(opt2Callback).toBeCalledTimes(1);
    expect(opt3Callback).toBeCalledTimes(1);
  });
});
