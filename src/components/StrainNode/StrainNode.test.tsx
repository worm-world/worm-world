import { render, screen } from '@testing-library/react';
import StrainNode from 'components/StrainNode/StrainNode';
import { type Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { cmpChromosomes } from 'models/frontend/Strain/Strain';
import * as mock from 'models/frontend/StrainNodeModel/StrainNodeModel.mock';

describe('StrainNode component', () => {
  test('Empty node shows "wild" label', () => {
    const emptyNode = mock.maleWild;
    render(<StrainNode model={emptyNode} />);

    const body = screen.getByTestId('strainNodeBody');
    expect(body).toHaveTextContent(/wild/i);
  });

  test('Wild strain node shows sections', () => {
    const wildNode = mock.maleWildManyPairs;
    render(<StrainNode model={wildNode} />);

    const body = screen.getByTestId('strainNodeBody');
    expect(body).not.toBeEmptyDOMElement();
    const chromosomeISection = screen.getByText(/^I$/);
    expect(chromosomeISection).toBeDefined();

    const chromosomeIISection = screen.getByText(/^II$/);
    expect(chromosomeIISection).toBeDefined();

    const chromosomeIIISection = screen.getByText(/^III$/);
    expect(chromosomeIIISection).toBeDefined();

    const chromosomeExSection = screen.queryByText(/^Ex$/); // wild ecas don't render
    expect(chromosomeExSection).toBeNull();
  });

  test('cmpChromosomes() correctly orders chromosomes', () => {
    const expected: Array<Chromosome | undefined> = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'X',
      'Ex',
      undefined,
    ];
    const beforeSort: Array<Chromosome | undefined> = [
      'II',
      'I',
      'X',
      undefined,
      'Ex',
      'V',
      'IV',
      'III',
    ];
    const afterSort = beforeSort.sort(cmpChromosomes);
    afterSort.forEach((chrom, idx) => {
      expect(chrom).toEqual(expected[idx]);
    });
  });

  test('cmpChromosomes() puts undefined at end', () => {
    const beforeSort: Array<Chromosome | undefined> = ['II', undefined, 'I'];
    const expected: Array<Chromosome | undefined> = ['I', 'II', undefined];
    const afterSort = beforeSort.sort(cmpChromosomes);
    afterSort.forEach((chrom, idx) => {
      expect(chrom).toEqual(expected[idx]);
    });
  });
  test('Breed Count Probabilty Renders and shows correct data', () => {
    const model = mock.maleWild;
    model.probability = 0.25;
    model.isChild = true;
    render(<StrainNode model={model} />);
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
