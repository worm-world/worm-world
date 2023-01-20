import { render, screen } from '@testing-library/react';
import FlowWrapper from 'components/FlowWrapper/FlowWrapper';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import CrossNode from 'components/CrossNode/CrossNode';
import { ReactFlowProvider } from 'reactflow';

describe('FlowWrapper', () => {
  test('FlowWrapper does not obscure contents of cross node', () => {
    const mutatedCrossNode = mock.mutated;
    const wrapperInFlow = (
      <ReactFlowProvider>
        <FlowWrapper data={<CrossNode model={mutatedCrossNode} />} />
      </ReactFlowProvider>
    );
    render(wrapperInFlow);

    const chromI = screen.getByText(/^I$/);
    const chromII = screen.getByText(/^II$/);
    const chromX = screen.getByText(/^X$/);
    const chromEx = screen.getByText(/^Ex$/);
    const chromUnknown = screen.getByText(/^\?$/);

    expect(chromI).toBeVisible();
    expect(chromII).toBeVisible();
    expect(chromX).toBeVisible();
    expect(chromEx).toBeVisible();
    expect(chromUnknown).toBeVisible();
  });
});
