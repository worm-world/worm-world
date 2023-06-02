import { render, screen } from '@testing-library/react';
import { StrainFlowWrapper } from 'components/FlowWrapper/FlowWrapper';
import * as mock from 'models/frontend/StrainNodeModel/StrainNodeModel.mock';
import { ReactFlowProvider } from 'reactflow';

describe('FlowWrapper', () => {
  test('FlowWrapper does not obscure contents of strain node', () => {
    const strainNodeModel = mock.maleManyPairs;
    const wrapperInFlow = (
      <ReactFlowProvider>
        <StrainFlowWrapper data={strainNodeModel} />
      </ReactFlowProvider>
    );
    render(wrapperInFlow);

    const chromI = screen.getByText(/^I$/);
    const chromII = screen.getByText(/^II$/);
    const chromX = screen.getByText(/^X$/);
    const chromEx = screen.getByText(/^Ex$/);

    expect(chromI).toBeVisible();
    expect(chromII).toBeVisible();
    expect(chromX).toBeVisible();
    expect(chromEx).toBeVisible();
  });
});
