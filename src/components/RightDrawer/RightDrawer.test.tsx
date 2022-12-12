import { render, screen } from '@testing-library/react';
import RightDrawer from 'components/RightDrawer/RightDrawer';

const testPropsOpen = {
  initialDrawerWidth: 200,
  maxWidth: 300,
  isOpen: true,
  close: () => alert('close button pressed'),
};

const childElement = <div>RightDrawer Child Element</div>;

describe('RightDrawer', () => {
  // Initial open drawer
  test('renders RightDrawer component', () => {
    render(<RightDrawer {...testPropsOpen}>{childElement}</RightDrawer>, {});
    screen.getByText('RightDrawer Child Element');
  });
});
