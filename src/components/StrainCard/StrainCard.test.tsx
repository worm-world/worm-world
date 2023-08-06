import { render, screen } from '@testing-library/react';
import * as strains from 'models/frontend/Strain/Strain.mock';
import StrainCard from './StrainCard';

describe('StrainCard', () => {
  test('Empty strain shows "wild" label', () => {
    render(<StrainCard strain={strains.emptyWild} id={''} />);

    const body = screen.getByTestId('strainNodeBody');
    expect(body).toHaveTextContent(/wild/i);
  });
});
