import { render, screen } from '@testing-library/react';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import CrossNode from 'components/CrossNode/CrossNode';
import { ReactFlowProvider } from 'reactflow';

describe('Cross node, given cross node model, displays correctly', () => {
  test('Empty cross node shows no mutation sections (fractions or single allele)', () => {
    const emptyNode = mock.empty;
    render(
      <ReactFlowProvider>
        <CrossNode model={emptyNode} />
      </ReactFlowProvider>
    );

    const body = screen.getByTestId('crossNodeBody');
    expect(body).toBeEmptyDOMElement();
  });

  test('Wild cross node shows mutation sections (fractions or single allele)', () => {
    const wildNode = mock.wild; // See wild node for details
    render(
      <ReactFlowProvider>
        <CrossNode model={wildNode} />
      </ReactFlowProvider>
    );

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
