import { render, screen } from '@testing-library/react';
import RightDrawer from 'components/rightDrawer/RightDrawer';

const testPropsOpen = {
  initialDrawerWidth: 200,
  maxWidth: 300,
  isOpen: true,
  close: () => alert('close button pressed'),
};

const testPropsClosed = {
  initialDrawerWidth: 200,
  maxWidth: 300,
  isOpen: false,
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
