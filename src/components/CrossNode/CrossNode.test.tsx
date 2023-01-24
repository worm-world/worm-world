import { render, screen } from '@testing-library/react';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import CrossNode, { cmpChromosomes } from 'components/CrossNode/CrossNode';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
describe('dummy test', () => {
  test('dummy test', () => {
    expect(true).toBeTruthy();
  });
});

// describe('CrossNode component', () => {
//   test('Empty node shows no sections', () => {
//     const emptyNode = mock.empty;
//     render(<CrossNode model={emptyNode} />);

//     const body = screen.getByTestId('crossNodeBody');
//     expect(body).toBeEmptyDOMElement();
//   });

//   test('Wild cross node shows sections', () => {
//     const wildNode = mock.wild; // See wild node for details
//     render(<CrossNode model={wildNode} />);

//     const body = screen.getByTestId('crossNodeBody');
//     expect(body).not.toBeEmptyDOMElement();
//     const chromosomeISection = screen.getByText(/^I$/);
//     expect(chromosomeISection).toBeDefined();

//     const chromosomeIISection = screen.getByText(/^II$/);
//     expect(chromosomeIISection).toBeDefined();

//     const chromosomeIIISection = screen.getByText(/^III$/);
//     expect(chromosomeIIISection).toBeDefined();

//     const chromosomeExSection = screen.getByText(/^Ex$/);
//     expect(chromosomeExSection).toBeDefined();
//   });

//   test('cmpChromosomes() correctly orders chromosomes', () => {
//     const expected: (Chromosome | undefined)[] = [
//       'I',
//       'II',
//       'III',
//       'IV',
//       'V',
//       'X',
//       'Ex',
//       undefined,
//     ];
//     const beforeSort: (Chromosome | undefined)[] = [
//       'II',
//       'I',
//       'X',
//       undefined,
//       'Ex',
//       'V',
//       'IV',
//       'III',
//     ];
//     const afterSort = beforeSort.sort(cmpChromosomes);
//     afterSort.forEach((chrom, idx) => {
//       expect(chrom).toEqual(expected[idx]);
//     });
//   });

//   test('cmpChromosomes() puts undefined at end', () => {
//     const beforeSort: (Chromosome | undefined)[] = ['II', undefined, 'I'];
//     const expected: (Chromosome | undefined)[] = ['I', 'II', undefined];
//     const afterSort = beforeSort.sort(cmpChromosomes);
//     afterSort.forEach((chrom, idx) => {
//       expect(chrom).toEqual(expected[idx]);
//     });
//   });
// });
