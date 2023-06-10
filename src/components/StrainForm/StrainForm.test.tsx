import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import StrainForm from 'components/StrainForm/StrainForm';
import { type Sex } from 'models/enums';
import { ed3 } from 'models/frontend/Allele/Allele.mock';
import { unc119 } from 'models/frontend/Gene/Gene.mock';
import { type Strain } from 'models/frontend/Strain/Strain';
import { StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Strain form with strain builder', () => {
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

  test('Create a new strain', async () => {
    let strainNodeModel: StrainNodeModel | undefined;
    const addNewNodeToFlow = (sex: Sex, strain: Strain): void => {
      strainNodeModel = new StrainNodeModel({
        sex,
        strain,
        isChild: false,
        isParent: false,
      });
    };

    render(<StrainForm onSubmit={addNewNodeToFlow} />);
    await user.click(screen.getByText(/custom strain/i));

    // Choose allele
    await user.click(screen.getByLabelText(/homozygous alleles/i));
    await user.keyboard('e');

    const option = screen.getByText(/ed3/i);
    expect(option).toBeVisible();
    await user.click(option);

    // Press submit
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(strainNodeModel).toBeDefined();
  });

  test('No input gives no options', async () => {
    render(<StrainForm onSubmit={() => {}} />);
    await user.click(screen.getByText(/custom strain/i));

    await user.click(screen.getByLabelText(/homozygous alleles/i));
    await user.keyboard('e');

    expect(screen.getByText(/ed3/i)).toBeVisible();

    await user.keyboard('{backspace}');
    expect(screen.queryByText(/ed3/i)).toBeNull();
  });
});
