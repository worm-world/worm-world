import { render, screen } from '@testing-library/react';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { db_Allele } from 'models/db/db_Allele';
import user from '@testing-library/user-event';
import * as mock from 'components/CrossNodeForm/CrossNodeForm.mock';

describe('Cross node form', () => {
  test('Create a new node', async () => {
    user.setup();

    let crossNodeModel: CrossNodeModel | undefined;

    const addNewCrossNode = (model: CrossNodeModel): void => {
      crossNodeModel = model;
    };

    render(
      <CrossNodeForm
        addNewCrossNode={addNewCrossNode}
        getFilteredGenes={mock.getFilteredGenes}
        getFilteredVariations={mock.getFilteredVariations}
        getFilteredAlleles={mock.getFilteredAlleles}
        alleleCreateFromRecord={mock.alleleCreateFromRecord}
      />
    );

    // Choose gene
    await user.click(screen.getByPlaceholderText('Select Genes'));
    await user.keyboard('A');
    let option = screen.getByText(/^AA$/i);
    expect(option).toBeVisible();
    await user.click(option);

    // Choose allele
    await user.click(screen.getByPlaceholderText('Select Male Alleles'));
    await user.keyboard('B');
    option = screen.getByText(/^BB$/i);
    expect(option).toBeVisible();
    await user.click(option);

    // Press submit
    await user.click(screen.getByText(/create new cross node/i));

    expect(crossNodeModel).toBeDefined();
    expect(crossNodeModel?.genes.at(0)?.sysName).toBe('AA');
    expect(crossNodeModel?.strain.alleles.at(0)?.name).toBe('BB');
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
        addNewCrossNode={() => {}}
        getFilteredGenes={mock.getFilteredGenes}
        getFilteredVariations={mock.filteredVariationDoesNotMatter}
        getFilteredAlleles={getFilteredAlleles}
        alleleCreateFromRecord={mock.alleleCreateDoesNotMatter}
      />
    );

    // Choose gene AA
    await user.click(screen.getByPlaceholderText('Select Genes'));
    await user.keyboard('A');
    let option = screen.getByText(/^AA$/i);
    await user.click(option);

    // Choose allele
    await user.click(screen.getByPlaceholderText('Select Male Alleles'));
    await user.keyboard('B');
    // Consistent
    option = screen.getByText(/^BB$/i);
    expect(option).toBeVisible();
    // Inconsistent
    const inconsistentOption = screen.queryByPlaceholderText(/^BBB$/i);
    expect(inconsistentOption).toBeNull();
  });

  test('Can only select allele once per select', async () => {
    user.setup();

    render(
      <CrossNodeForm
        addNewCrossNode={() => {}}
        getFilteredGenes={mock.getFilteredGenes}
        getFilteredVariations={mock.filteredVariationDoesNotMatter}
        getFilteredAlleles={mock.getFilteredAlleles}
        alleleCreateFromRecord={mock.alleleCreateDoesNotMatter}
      />
    );

    // Choose gene AA
    await user.click(screen.getByPlaceholderText('Select Genes'));
    await user.keyboard('A');
    const option = screen.getByText(/^AA$/i);
    await user.click(option);

    // Choose allele
    await user.click(screen.getByPlaceholderText('Select Male Alleles'));
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
        addNewCrossNode={() => {}}
        getFilteredGenes={mock.getFilteredGenes}
        getFilteredVariations={mock.filteredVariationDoesNotMatter}
        getFilteredAlleles={mock.getFilteredAlleles}
        alleleCreateFromRecord={mock.alleleCreateDoesNotMatter}
      />
    );

    await user.click(screen.getByPlaceholderText('Select Genes'));
    await user.keyboard('A');
    expect(screen.getByText(/^AA$/i)).toBeVisible();
    await user.keyboard('{backspace}');
    expect(screen.queryByText(/^AA$/i)).toBeNull();
  });
});
