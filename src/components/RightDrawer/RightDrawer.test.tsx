import { render, screen } from '@testing-library/react';
import RightDrawer from 'components/RightDrawer/RightDrawer';

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

describe('RightDrawer functions correctly', () => {
  test('Open RightDrawer component has visible children', () => {
    render(<RightDrawer {...testPropsOpen}>{childElement}</RightDrawer>, {});
    const child = screen.getByText('RightDrawer Child Element');
    expect(child).toBeVisible();
  });

  // test('Closed RightDrawer component has invisible children', () => {
  //   render(<RightDrawer {...testPropsClosed}>{childElement}</RightDrawer>, {});
  //   const child = screen.getByText('RightDrawer Child Element');
  //   expect(child).not.toBeVisible();
  // });
});
