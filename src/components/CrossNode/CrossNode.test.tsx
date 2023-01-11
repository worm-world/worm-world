import { render, screen } from '@testing-library/react';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import CrossNode from 'components/CrossNode/CrossNode';
import { ReactFlowProvider } from 'reactflow';

describe('CrossNode component', () => {
  test('Empty node shows no sections', () => {
    const emptyNode = mock.empty;
    render(<CrossNode model={emptyNode} />);

    const body = screen.getByTestId('crossNodeBody');
    expect(body).toBeEmptyDOMElement();
  });

  test('Wild cross node shows sections', () => {
    const wildNode = mock.wild; // See wild node for details
    render(<CrossNode model={wildNode} />);

    const body = screen.getByTestId('crossNodeBody');
    expect(body).not.toBeEmptyDOMElement();
    const chromosomeISection = screen.getByText(/^I$/);
    expect(chromosomeISection).toBeDefined();

    const chromosomeIISection = screen.getByText(/^II$/);
    expect(chromosomeIISection).toBeDefined();

    const chromosomeIIISection = screen.getByText(/^III$/);
    expect(chromosomeIIISection).toBeDefined();

    const chromosomeECASection = screen.getByText(/^ECA$/);
    expect(chromosomeECASection).toBeDefined();
  });
});
