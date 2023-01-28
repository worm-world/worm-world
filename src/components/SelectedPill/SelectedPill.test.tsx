import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import SelectedPill from 'components/SelectedPill/SelectedPill';
import { vi } from 'vitest';

describe('SelectPill', () => {
  test('Component renders', async () => {
    render(
      <SelectedPill displayVal={'testVal'} removeFromSelected={() => {}} />
    );
    expect(screen.getByText('testVal')).toBeDefined();
  });

  test('Select button takes action on click', async () => {
    user.setup();
    const spyOnClick = vi.fn();

    render(
      <SelectedPill displayVal={'testVal'} removeFromSelected={spyOnClick} />
    );
    const button = screen.getByTestId('closeButton');
    await user.click(button);
    expect(spyOnClick).toHaveBeenCalledTimes(1);
  });
});
