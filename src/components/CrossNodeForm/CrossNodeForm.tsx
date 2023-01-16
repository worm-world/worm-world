import { getGenes } from 'api/gene';
import { Gene } from 'models/frontend/Gene/Gene';
import React, { useEffect, useState } from 'react';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { getVariations } from 'api/variationInfo';
import { Allele } from 'models/frontend/Allele/Allele';
import { getFilteredAlleles } from 'api/allele';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import CrossNode from 'components/CrossNode/CrossNode';
import {
  Multiselector,
  Selector,
  Option,
} from 'components/CrossNodeForm/Selector';
import { FilterTuple } from 'models/db/filter/Filter';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';

export interface CrossNodeFormProps {
  addNewCrossNode: (arg: JSX.Element) => void;
}

// CrossNode form specifies a new cross node
const CrossNodeForm = (props: CrossNodeFormProps): JSX.Element => {
  // Set up options of the form {label: string, value: T}
  const [geneOptions, setGeneOptions] = useState<Array<Option<Gene>>>([]);
  const [variationOptions, setVariationOptions] = useState<
    Array<Option<VariationInfo>>
  >([]);
  const [alleleOptions, setAlleleOptions] = useState<Array<Option<Allele>>>([]);

  // Save selected options
  const [selectedSex, setSelectedSex] = useState<Option<Sex>>({
    label: 'male',
    value: Sex.Male,
  });
  const [selectedGenes, setSelectedGenes] = useState<Array<Option<Gene>>>([]);
  const [selectedVariations, setSelectedVariations] = useState<
    Array<Option<VariationInfo>>
  >([]);
  const [selectedAlleles, setSelectedAlleles] = useState<Array<Option<Allele>>>(
    []
  );

  // Populate genes, variations, and (filtered) alleles multiselects
  useEffect(() => {
    populateGeneOptions(setGeneOptions);
  }, []);
  useEffect(() => {
    populateVariationOptions(setVariationOptions);
  }, []);
  useEffect(() => {
    setSelectedAlleles([]);
    // Don't repopulate if no genes or variations selected
    if (selectedGenes.length === 0 && selectedVariations.length === 0) {
      setAlleleOptions([]);
      return;
    } else {
      refreshAlleleOptions(
        selectedGenes,
        selectedVariations,
        setAlleleOptions
      ).catch((e) => {
        console.error(e);
      });
    }
  }, [selectedGenes, selectedVariations]);

  // Selectors
  const geneSelector = (
    <Multiselector
      key={'Genes to Display'}
      label={'Genes to Display'}
      options={geneOptions}
      selectedValues={selectedGenes}
      setSelectedValues={setSelectedGenes}
      setAlleleOptions={setAlleleOptions}
    />
  );
  const variationSelector = (
    <Multiselector
      key={'Variations to Display'}
      label='Variations to Display'
      options={variationOptions}
      selectedValues={selectedVariations}
      setSelectedValues={setSelectedVariations}
      setAlleleOptions={setAlleleOptions}
    />
  );
  const alleleSelector = (
    <Multiselector
      key={'Alleles'}
      label='Alleles'
      options={alleleOptions}
      selectedValues={selectedAlleles}
      setSelectedValues={setSelectedAlleles}
    />
  );
  const sexSelector = (
    <Selector
      key={'Sex'}
      label='Sex'
      options={[
        { label: 'male', value: Sex.Male },
        { label: 'hermaphrodite', value: Sex.Hermaphrodite },
      ]}
      selectedValue={selectedSex}
      setSelectedValue={setSelectedSex}
    />
  );

  // Submission handler
  const sexForNode: Sex = selectedSex.value;
  const genesForNode: Gene[] = [];
  selectedGenes.forEach((selectedGene) => {
    genesForNode.push(selectedGene.value);
  });
  const variationsForNode: VariationInfo[] = [];
  selectedVariations.forEach((selectedVariation) => {
    variationsForNode.push(selectedVariation.value);
  });
  const allelesForNode: Allele[] = [];
  selectedAlleles.forEach((selectedAllele) => {
    allelesForNode.push(selectedAllele.value);
  });
  const onSubmit = (): void => {
    const newNode = createNewCrossNode(
      sexForNode,
      genesForNode,
      variationsForNode,
      allelesForNode
    );
    props.addNewCrossNode(newNode);
  };

  return (
    <>
      {getCrossNodeForm(
        [sexSelector, geneSelector, variationSelector, alleleSelector],
        onSubmit
      )}
    </>
  );
};

const populateGeneOptions = (
  setGeneOptions: React.Dispatch<React.SetStateAction<Array<Option<Gene>>>>
): void => {
  getGenes()
    .then((geneRecords) => {
      const genes = geneRecords.map((record) => Gene.createFromRecord(record));
      const geneOptions: Array<Option<Gene>> = [];
      for (const gene of genes) {
        geneOptions.push({ value: gene, label: gene.descName ?? gene.sysName });
      }
      setGeneOptions(geneOptions);
    })
    .catch((e) => {
      console.error(e);
      setGeneOptions([]);
    });
};

const populateVariationOptions = (
  setVariationOptions: React.Dispatch<
    React.SetStateAction<Array<Option<VariationInfo>>>
  >
): void => {
  getVariations()
    .then((variationRecords) => {
      const variations = variationRecords.map((record) =>
        VariationInfo.createFromRecord(record)
      );
      const variationOptions: Array<Option<VariationInfo>> = [];
      for (const variation of variations) {
        variationOptions.push({ value: variation, label: variation.name });
      }
      setVariationOptions(variationOptions);
    })
    .catch((e) => {
      console.error(e);
      setVariationOptions([]);
    });
};

const refreshAlleleOptions = async (
  selectedGenes: Array<Option<Gene>>,
  selectedVariations: Array<Option<VariationInfo>>,
  setAlleleOptions: React.Dispatch<React.SetStateAction<Array<Option<Allele>>>>
): Promise<void> => {
  // Build filter
  const filter: Array<Array<FilterTuple<AlleleFieldName>>> = [];
  for (const option of selectedGenes) {
    filter.push([['SysGeneName', { Equal: option.value.sysName }]]);
  }
  for (const option of selectedVariations) {
    filter.push([['VariationName', { Equal: option.value.name }]]);
  }

  // Note that alleles have to query DB to build rich version
  try {
    const alleleRecords = await getFilteredAlleles({
      filters: filter,
      orderBy: ['Name'],
    });
    const alleles = await Promise.all(
      alleleRecords.map(async (record) => await Allele.createFromRecord(record))
    );
    const alleleOptions: Array<Option<Allele>> = [];
    for (const allele of alleles) {
      alleleOptions.push({ value: allele, label: allele.name });
    }

    setAlleleOptions(alleleOptions);
  } catch (error) {
    console.error(error);
  }
};

const createNewCrossNode = (
  sex: Sex,
  genes: Gene[],
  variations: VariationInfo[],
  alleles: Allele[]
): JSX.Element => {
  const crossNode: CrossNodeModel = {
    sex,
    strain: {
      name: '',
      alleles,
      notes: '',
    },
    parents: [],
    isSelected: false,
    genes,
    variations,
  };
  console.log(crossNode);
  return <CrossNode model={crossNode}></CrossNode>;
};

const getCrossNodeForm = (
  selectors: JSX.Element[],
  submissionHandler: () => void
): JSX.Element => {
  return (
    <>
      <h3 className='font-medium'>Add a New Cross Node</h3>
      <ul>{selectors}</ul>
      <button
        className='btn mt-5 bg-accent'
        onClick={() => {
          submissionHandler();
        }}
      >
        Create New Cross Node
      </button>
    </>
  );
};

export default CrossNodeForm;
