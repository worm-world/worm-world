import { render, screen } from '@testing-library/react';
import CrossNode from 'components/crossNode/CrossNode';
import * as testData from './CrossNode.data';

describe('CrossNode', () => {
  test('renders CrossNode component', () => {
    render(<CrossNode {...testData.wildCrossNode}></CrossNode>);
    screen.getByText('I');
  });
});
