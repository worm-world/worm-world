import { render, screen } from '@testing-library/react';
import StrainNode from 'components/StrainNode/StrainNode';
import * as strains from 'models/frontend/Strain/Strain.mock';

describe('StrainNode component', () => {
  test('Empty node shows "wild" label', () => {
    const emptyNode = strains.emptyWild.toMale();
    render(<StrainNode data={emptyNode} id={''} />);

    const body = screen.getByTestId('strainNodeBody');
    expect(body).toHaveTextContent(/wild/i);
  });

  test('Breed Count Probabilty Renders and shows correct data', () => {
    const data = strains.emptyWild.toMale();
    data.probability = 0.25;
    data.isChild = true;
    render(<StrainNode data={data} id={''} />);
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
