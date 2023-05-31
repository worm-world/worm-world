import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import StrainNodeForm from 'components/StrainNodeForm/StrainNodeForm';
import { type db_Allele } from 'models/db/db_Allele';
import { type Sex } from 'models/enums';
import { ed3 } from 'models/frontend/Allele/Allele.mock';
import { unc119 } from 'models/frontend/Gene/Gene.mock';
import { type Strain } from 'models/frontend/Strain/Strain';
import { StrainNodeModel } from 'models/frontend/StrainNode/StrainNode';
import { beforeEach, describe, expect, test } from 'vitest';

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

    let strainNodeModel: StrainNodeModel | undefined;
    const addNewNodeToFlow = (sex: Sex, strain: Strain): void => {
      strainNodeModel = new StrainNodeModel({
        sex,
        strain,
        isChild: false,
        isParent: false,
      });
    };

    render(<StrainNodeForm onSubmit={addNewNodeToFlow} />);

    // Choose allele
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('e');
    const option = screen.getByText(/ed3/i);
    expect(option).toBeVisible();
    await user.click(option);

    // Press submit
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(strainNodeModel).toBeDefined();
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

    render(<StrainNodeForm onSubmit={() => {}} />);

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

    render(<StrainNodeForm onSubmit={() => {}} />);

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

    render(<StrainNodeForm onSubmit={() => {}} />);
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('e');
    expect(screen.getByText(/ed3/i)).toBeVisible();
    await user.keyboard('{backspace}');
    expect(screen.queryByText(/ed3/i)).toBeNull();
  });
});
