import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ed3 } from 'models/frontend/Allele/Allele.mock';
import { unc119 } from 'models/frontend/Gene/Gene.mock';
import { beforeEach, describe, expect, test } from 'vitest';
import StrainBuilder from './StrainBuilder';

describe('Strain builder', () => {
  beforeEach(() => {
    mockIPC((cmd, _) => {
      if (cmd === 'get_filtered_alleles') {
        return [ed3.generateRecord()];
      }
      if (cmd === 'get_filtered_alleles_with_gene_filter') {
        return [[ed3.generateRecord(), unc119.generateRecord()]];
      }
      if (cmd === 'get_filtered_genes') return [unc119.generateRecord()];
      if (cmd === 'get_filtered_allele_exprs') return [];
    });
  });

  afterAll(() => {
    clearMocks();
  });

  test('Initially empty form', async () => {
    user.setup();

    render(<StrainBuilder onSubmit={() => {}} />);

    const selectedPillGroups = screen.getAllByTestId('selected-pill-group');
    expect(selectedPillGroups).toHaveLength(3);
    selectedPillGroups.forEach((group) => {
      expect(group).toBeEmptyDOMElement();
    });
  });

  test('Build from empty', async () => {
    user.setup();

    render(<StrainBuilder onSubmit={() => {}} />);

    const homoAlleleInput = screen.getByLabelText(/homozygous alleles/i);

    await user.click(homoAlleleInput);
    await user.keyboard('ed3');
    await user.click(screen.getByRole('listitem', { value: /ed3/i }));

    expect(homoAlleleInput).toHaveTextContent('');

    const pillGroupsWithChildren = screen
      .getAllByTestId('selected-pill-group')
      .filter((element) => element.hasChildNodes());
    expect(pillGroupsWithChildren).toHaveLength(1);
  });
});
