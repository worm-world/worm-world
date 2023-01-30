import { render, screen } from '@testing-library/react';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { db_Allele } from 'models/db/db_Allele';
import user from '@testing-library/user-event';
import * as mock from 'components/CrossNodeForm/CrossNodeForm.mock';
import { Sex } from 'models/enums';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';

describe('Cross node form', () => {
  test('Create a new node', async () => {
    user.setup();

    let crossNodeModel: CrossNodeModel | undefined;
    const addNewNodeToFlow = (sex: Sex, pairs: AllelePair[]): void => {
      crossNodeModel = {
        sex,
        strain: new Strain({ allelePairs: pairs }),
      };
    };

    render(
      <CrossNodeForm
        onSubmitCallback={addNewNodeToFlow}
        getFilteredAlleles={mock.getFilteredAlleles}
        createAlleleFromRecord={mock.alleleCreateFromRecord}
      />
    );

    // Choose allele
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('B');
    const option = screen.getByText(/^BB$/i);
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

    // Returns two alleles, since it is based on name matching
    const getFilteredAlleles = async (): Promise<db_Allele[]> => {
      return await Promise.resolve([mock.dbAllele, inconsistentDbAllele]);
    };

    render(
      <CrossNodeForm
        onSubmitCallback={() => {}}
        getFilteredAlleles={getFilteredAlleles}
        createAlleleFromRecord={mock.alleleCreateDoesNotMatter}
      />
    );

    // Choose allele
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('B');
    // Consistent
    const option = screen.getByText(/^BB$/i);
    expect(option).toBeVisible();
    // Inconsistent
    const inconsistentOption = screen.queryByPlaceholderText(/^BBB$/i);
    expect(inconsistentOption).toBeNull();
  });

  test('Can only select allele once per select', async () => {
    user.setup();

    render(
      <CrossNodeForm
        onSubmitCallback={() => {}}
        getFilteredAlleles={mock.getFilteredAlleles}
        createAlleleFromRecord={mock.alleleCreateDoesNotMatter}
      />
    );

    // Choose allele
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('B');
    await user.click(screen.getByText(/^BB$/i));
    await user.keyboard('B');
    // Only the selected pill has BB--not a duplicate option
    expect(screen.getAllByText(/^BB$/)).toHaveLength(1);
  });

  test('No input gives no options', async () => {
    user.setup();

    render(
      <CrossNodeForm
        onSubmitCallback={() => {}}
        getFilteredAlleles={mock.getFilteredAlleles}
        createAlleleFromRecord={mock.alleleCreateDoesNotMatter}
      />
    );
    await user.click(screen.getByLabelText('Homozygous Alleles'));
    await user.keyboard('B');
    expect(screen.getByText(/^BB$/i)).toBeVisible();
    await user.keyboard('{backspace}');
    expect(screen.queryByText(/^BB$/i)).toBeNull();
  });
});
