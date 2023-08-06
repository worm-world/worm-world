import { render, screen } from '@testing-library/react';
import StrainNode from 'components/StrainNode/StrainNode';
import * as strains from 'models/frontend/Strain/Strain.mock';
import { ReactFlowProvider } from 'reactflow';

describe('StrainNode component', () => {
  test('Breed count probabilty renders and shows correct data', () => {
    const data = strains.emptyWild.toMale();
    data.probability = 0.25;
    data.isChild = true;
    render(
      <ReactFlowProvider>
        <StrainNode data={data} id={''} xPos={0} yPos={0} />
      </ReactFlowProvider>
    );
    const prob1 = screen.getByTestId('progress-0.8');
    expect(prob1).not.toBeNull();
    const prob2 = screen.getByTestId('progress-0.9');
    expect(prob2).not.toBeNull();
    const prob3 = screen.getByTestId('progress-0.95');
    expect(prob3).not.toBeNull();
    const prob4 = screen.getByTestId('progress-0.99');
    expect(prob4).not.toBeNull();

    const countOne = screen.getByTestId('countOne');
    expect(countOne.innerHTML).toBe('6 for 80% Confidence');

    const countTwo = screen.getByTestId('countTwo');
    expect(countTwo.innerHTML).toBe('9 for 90% Confidence');

    const countThree = screen.getByTestId('countThree');
    expect(countThree.innerHTML).toBe('11 for 95% Confidence');

    const countFour = screen.getByTestId('countFour');
    expect(countFour.innerHTML).toBe('17 for 99% Confidence');
  });
});
