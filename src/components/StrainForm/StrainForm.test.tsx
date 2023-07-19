import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import StrainForm from 'components/StrainForm/StrainForm';
import { ed3 } from 'models/frontend/Allele/Allele.mock';
import { unc119 } from 'models/frontend/Gene/Gene.mock';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Strain form', () => {
  beforeEach(async () => {
    user.setup();

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

  test('No input gives no options', async () => {
    render(<StrainForm onSubmit={() => {}} newId={''} showGenes={false} />);

    await user.click(screen.getByLabelText(/alleles/i));
    await user.keyboard('e');

    expect(screen.getByText(/ed3/i)).toBeVisible();

    await user.keyboard('{backspace}');
    expect(screen.queryByText(/ed3/i)).toBeNull();
  });
});
