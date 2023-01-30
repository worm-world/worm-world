import { render, screen } from '@testing-library/react';
import { StrainFlowWrapper } from 'components/FlowWrapper/FlowWrapper';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import { ReactFlowProvider } from 'reactflow';

describe('FlowWrapper', () => {
  test('FlowWrapper does not obscure contents of cross node', () => {
    const mutatedCrossNode = mock.mutated;
    const wrapperInFlow = (
      <ReactFlowProvider>
        <StrainFlowWrapper data={mutatedCrossNode} />
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
