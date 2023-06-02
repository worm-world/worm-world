import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import { render, screen, act} from '@testing-library/react';
import user from '@testing-library/user-event';
import StrainForm from 'components/StrainForm/StrainForm';
import { type db_Allele } from 'models/db/db_Allele';
import { type Sex } from 'models/enums';
import { ed3 } from 'models/frontend/Allele/Allele.mock';
import { unc119 } from 'models/frontend/Gene/Gene.mock';
import { type Strain } from 'models/frontend/Strain/Strain';
import { StrainNode as StrainNodeModel } from 'models/frontend/StrainNode/StrainNode';
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
    await act(() => user.click(screen.getByText(/custom strain/i)));

    // Choose allele
    await act(async () => { 
      await user.click(screen.getByLabelText('Homozygous Alleles'));
      await user.keyboard('e');
    });

    const option = screen.getByText(/ed3/i);
    expect(option).toBeVisible();
    await act(async () => user.click(option));

    // Look at preview (2 alleles, plus pill)
    expect(screen.getAllByText(/ed3/i)).toHaveLength(3);

    // Press submit
    await act(async () => user.click(screen.getByRole('button', { name: /add/i })));

    expect(strainNodeModel).toBeDefined();
  });


  test('No input gives no options', async () => {

    render(<StrainForm onSubmit={() => {}} />);
    await act(() => user.click(screen.getByText(/custom strain/i)));

    await act(async () => {
      await user.click(screen.getByLabelText(/homozygous alleles/i));
      await user.keyboard('e');}
    );

    expect(screen.getByText(/ed3/i)).toBeVisible();
    
    await act(async () => user.keyboard('{backspace}'));
    expect(screen.queryByText(/ed3/i)).toBeNull();
  });
});
