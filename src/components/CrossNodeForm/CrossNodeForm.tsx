import { getFilteredGenes, getGenes } from 'api/gene';
import { Gene } from 'models/frontend/Gene/Gene';
import React, { useEffect, useState } from 'react';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { getFilteredVariations, getVariations } from 'api/variationInfo';
import { Allele } from 'models/frontend/Allele/Allele';
import { getFilteredAlleles } from 'api/allele';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import CrossNode from 'components/CrossNode/CrossNode';
import { Multiselector, Selector, Option } from 'components/Selector/Selector';
import { Filter, FilterTuple } from 'models/db/filter/Filter';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { DynamicMultiSelect } from 'components/Selector/DynamicMultiSelect';

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
      <h3 className='font-medium'>Add a New Cross Node</h3>
      <label className='label'>
        <span className='label-text'>Sex</span>
      </label>
      <select className='select-bordered select w-full max-w-xs'>
        <option value={Sex.Male}>male</option>
        <option value={Sex.Hermaphrodite}>hermaphrodite</option>
      </select>
      <DynamicMultiSelect
        getFilteredRecordApi={getFilteredGenes}
        searchOn={'SysName'}
        selectInputOn={'sysName'}
        displayResultsOn={['sysName']}
        label='Genes to Display'
      />
      <DynamicMultiSelect
        getFilteredRecordApi={getFilteredVariations}
        searchOn={'AlleleName'}
        selectInputOn={'alleleName'}
        displayResultsOn={['alleleName']}
        label='Variations to Display'
      />
      <DynamicMultiSelect
        getFilteredRecordApi={getFilteredAlleles}
        searchOn={'Name'}
        selectInputOn={'name'}
        displayResultsOn={['name']}
        label='Alleles'
      />
      <button
        className='btn mt-5 max-w-xs bg-accent'
        onClick={() => {
          onSubmit();
        }}
      >
        Create New Cross Node
      </button>
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

export default CrossNodeForm;
