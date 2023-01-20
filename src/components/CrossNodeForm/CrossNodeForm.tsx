import { Gene } from 'models/frontend/Gene/Gene';
import { useEffect, useState } from 'react';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { Allele } from 'models/frontend/Allele/Allele';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import { DynamicMultiSelect } from 'components/DynamicMultiSelect/DynamicMultiSelect';
import { db_Gene } from 'models/db/db_Gene';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { db_Allele } from 'models/db/db_Allele';
import { GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import { Filter } from 'models/db/filter/Filter';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';

export interface CrossNodeFormProps {
  addNewCrossNode: (arg: CrossNodeModel) => void;
  getFilteredGenes: (filter: Filter<GeneFieldName>) => Promise<db_Gene[]>;
  getFilteredVariations: (
    filter: Filter<VariationFieldName>
  ) => Promise<db_VariationInfo[]>;
  getFilteredAlleles: (filter: Filter<AlleleFieldName>) => Promise<db_Allele[]>;
  alleleCreateFromRecord: (dbAllele: db_Allele) => Promise<Allele>;
}

// CrossNode form specifies a new cross node
const CrossNodeForm = (props: CrossNodeFormProps): JSX.Element => {
  // Save selected options
  const [selectedSex, setSelectedSex] = useState<Sex>(Sex.Male);
  const [selectedGenes, setSelectedGenes] = useState<Set<db_Gene>>(new Set());
  const [selectedVariations, setSelectedVariations] = useState<
    Set<db_VariationInfo>
  >(new Set());
  const [selectedFemaleAlleles, setSelectedFemaleAlleles] = useState<
    Set<db_Allele>
  >(new Set());
  const [selectedMaleAlleles, setSelectedMaleAlleles] = useState<
    Set<db_Allele>
  >(new Set());

  // Only allow existence of selected alleles consistent with other selections
  useEffect(() => {
    setSelectedMaleAlleles(new Set());
    setSelectedFemaleAlleles(new Set());
  }, [selectedSex, selectedGenes, selectedVariations]);

  const onSubmit = (): void => {
    const sexForNode: Sex = selectedSex;
    const genesForNode: Gene[] = Array.from(selectedGenes).map(
      (selectedGene) => {
        return Gene.createFromRecord(selectedGene);
      }
    );
    const variationsForNode: VariationInfo[] = Array.from(
      selectedVariations
    ).map((selectedVariation) => {
      return VariationInfo.createFromRecord(selectedVariation);
    });
    const maleAllelePromisesForNode: Array<Promise<Allele>> = Array.from(
      selectedMaleAlleles
    ).map(async (selectedAllele) => {
      return await props.alleleCreateFromRecord(selectedAllele);
    });
    const femaleAllelePromisesForNode: Array<Promise<Allele>> = Array.from(
      selectedFemaleAlleles
    ).map(async (selectedAllele) => {
      return await props.alleleCreateFromRecord(selectedAllele);
    });
    const allAlleles = maleAllelePromisesForNode.concat(
      femaleAllelePromisesForNode
    );
    Promise.all(allAlleles)
      .then((allelesForNode) => {
        const newNode = createNewCrossNode(
          sexForNode,
          genesForNode,
          variationsForNode,
          allelesForNode
        );
        props.addNewCrossNode(newNode);
      })
      .catch((err) => err);
  };

  return (
    <>
      <SexSelector setSelectedSex={setSelectedSex} />
      <DynamicMultiSelect
        placeholder='Select Genes'
        getFilteredRecordApi={props.getFilteredGenes}
        searchOn={'SysName'}
        selectInputOn={'sysName'}
        displayResultsOn={['sysName']}
        label='Genes to Display'
        selectedRecords={selectedGenes}
        setSelectedRecords={setSelectedGenes}
      />
      <DynamicMultiSelect
        placeholder='Select Variations'
        getFilteredRecordApi={props.getFilteredVariations}
        searchOn={'AlleleName'}
        selectInputOn={'alleleName'}
        displayResultsOn={['alleleName']}
        label='Variations to Display'
        selectedRecords={selectedVariations}
        setSelectedRecords={setSelectedVariations}
      />
      <DynamicMultiSelect
        placeholder='Select Male Alleles'
        getFilteredRecordApi={props.getFilteredAlleles}
        searchOn={'Name'}
        selectInputOn={'name'}
        displayResultsOn={['name']}
        label='Male Alleles'
        selectedRecords={selectedMaleAlleles}
        setSelectedRecords={setSelectedMaleAlleles}
        // Only include alleles of selected genes or variations
        shouldInclude={(dbAllele) =>
          shouldIncludeDbAllele(
            selectedGenes,
            selectedVariations,
            selectedMaleAlleles,
            dbAllele
          )
        }
      />
      <DynamicMultiSelect
        placeholder='Select Female Alleles'
        getFilteredRecordApi={props.getFilteredAlleles}
        searchOn={'Name'}
        selectInputOn={'name'}
        displayResultsOn={['name']}
        label='Female Alleles'
        selectedRecords={selectedFemaleAlleles}
        setSelectedRecords={setSelectedFemaleAlleles}
        // Only include alleles of selected genes or variations
        shouldInclude={(dbAllele) =>
          shouldIncludeDbAllele(
            selectedGenes,
            selectedVariations,
            selectedFemaleAlleles,
            dbAllele
          )
        }
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

const shouldIncludeDbAllele = (
  selectedGenes: Set<db_Gene>,
  selectedVariations: Set<db_VariationInfo>,
  selectedAlleles: Set<db_Allele>,
  allele: db_Allele
): boolean => {
  const alleleOfGene =
    (allele.sysGeneName !== null &&
      Array.from(selectedGenes)
        .map((selection) => selection.sysName)
        .includes(allele.sysGeneName)) ??
    false;
  const alleleOfVariation =
    (allele.variationName !== null &&
      Array.from(selectedVariations)
        .map((selection) => selection.alleleName)
        .includes(allele.variationName)) ??
    false;
  const alleleAlreadySelected = Array.from(selectedAlleles)
    .map((selection) => selection.name)
    .includes(allele.name);
  return (alleleOfGene || alleleOfVariation) && !alleleAlreadySelected;
};

const SexSelector = (props: {
  setSelectedSex: (sex: Sex) => void;
}): JSX.Element => {
  return (
    <>
      <h3 className='font-medium'>Add a New Cross Node</h3>
      <label className='label'>
        <span className='label-text'>Sex</span>
      </label>
      <select
        onChange={(event) => {
          props.setSelectedSex(
            event.target.value === 'male' ? Sex.Male : Sex.Hermaphrodite
          );
        }}
        className='select-bordered select w-full max-w-xs'
      >
        <option value='male'>male</option>
        <option value='hermaphrodite'>hermaphrodite</option>
      </select>
    </>
  );
};

const createNewCrossNode = (
  sex: Sex,
  genes: Gene[],
  variations: VariationInfo[],
  alleles: Allele[]
): CrossNodeModel => {
  const crossNodeModel: CrossNodeModel = {
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
  return crossNodeModel;
};

export default CrossNodeForm;
