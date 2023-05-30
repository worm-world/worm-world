import { render, screen } from '@testing-library/react';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import user from '@testing-library/user-event';
import { type Sex } from 'models/enums';
import { type Strain } from 'models/frontend/Strain/Strain';
import { beforeEach, test, describe, expect } from 'vitest';
import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { type db_Allele } from 'models/db/db_Allele';
import { ed3 } from 'models/frontend/Allele/Allele.mock';
import { unc119 } from 'models/frontend/Gene/Gene.mock';

describe('Cross node form', () => {
  beforeEach(() => {
    mockIPC((cmd, _) => {
      if (cmd === 'get_filtered_alleles') {
        return [ed3];
      }
      if (cmd === 'get_filtered_alleles_with_gene_filter') {
        return [[ed3, unc119]];
      }
      if (cmd === 'get_filtered_genes') return [unc119];
      if (cmd === 'get_filtered_allele_exprs') return [];
    });
  });

  afterAll(() => {
    clearMocks();
  });

  test('Create a new node', async () => {
    user.setup();

    let crossNodeModel: CrossNodeModel | undefined;
    const addNewNodeToFlow = (sex: Sex, strain: Strain): void => {
      crossNodeModel = new CrossNodeModel({
        sex,
        strain,
        isChild: false,
        isParent: false,
      });
    };

    render(<CrossNodeForm onSubmitCallback={addNewNodeToFlow} />);

    // Choose allele
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('e');
    const option = screen.getByText(/ed3/i);
    expect(option).toBeVisible();
    await user.click(option);

    // Press submit
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(crossNodeModel).toBeDefined();
  });

  test('Keep alleles consistent with chosen genes', async () => {
    user.setup();

    // Name matches consistent allele--but sysGeneName does not
    const inconsistentDbAllele: db_Allele = {
      name: 'BBB',
      contents: null,
      sysGeneName: 'YY',
      variationName: null,
    };

    mockIPC((cmd) => {
      if (cmd === 'get_filtered_alleles') {
        return [ed3, inconsistentDbAllele];
      }
      if (cmd === 'get_filtered_alleles_with_gene_filter') {
        return [
          [ed3, unc119],
          [inconsistentDbAllele, unc119],
        ];
      }
    });

    render(<CrossNodeForm onSubmitCallback={() => {}} />);

    // Choose allele
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('e');
    // Consistent
    const option = screen.getByText(/ed3/i);
    expect(option).toBeVisible();
    // Inconsistent
    const inconsistentOption = screen.queryByPlaceholderText(/^BBB$/i);
    expect(inconsistentOption).toBeNull();
  });

  test('Can only select allele once per select', async () => {
    user.setup();

    render(<CrossNodeForm onSubmitCallback={() => {}} />);

    // Choose allele
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('e');
    await user.click(screen.getByText(/ed3/i));
    await user.keyboard('e');
    // Only the selected pill has BB--not a duplicate option
    expect(screen.getAllByText(/ed3/)).toHaveLength(1);
  });

  test('No input gives no options', async () => {
    user.setup();

    render(<CrossNodeForm onSubmitCallback={() => {}} />);
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('e');
    expect(screen.getByText(/ed3/i)).toBeVisible();
    await user.keyboard('{backspace}');
    expect(screen.queryByText(/ed3/i)).toBeNull();
  });
});
