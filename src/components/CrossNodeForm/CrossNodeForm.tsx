import { useState } from 'react';
import { Allele, WILD_ALLELE } from 'models/frontend/Allele/Allele';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Sex } from 'models/enums';
import { DynamicMultiSelect } from 'components/DynamicMultiSelect/DynamicMultiSelect';
import { db_Allele } from 'models/db/db_Allele';
import { Filter } from 'models/db/filter/Filter';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { Strain } from 'models/frontend/Strain/Strain';
import { AllelePair } from 'models/frontend/Strain/AllelePair';

export interface CrossNodeFormProps {
  addNewCrossNode: (arg: CrossNodeModel) => void;
  getFilteredAlleles: (filter: Filter<AlleleFieldName>) => Promise<db_Allele[]>;
  createAlleleFromRecord: (dbAllele: db_Allele) => Promise<Allele>;
}

// CrossNode form specifies a new cross node
const CrossNodeForm = (props: CrossNodeFormProps): JSX.Element => {
  // Save selected options
  const [sex, setSex] = useState(Sex.Male);
  const [homoAlleles, setHomoAlleles] = useState(new Set<db_Allele>());
  const [hetAlleles, setHetAlleles] = useState(new Set<db_Allele>());

  const onSubmit = (): void => {
    const homoPairs = Array.from(hetAlleles).map(async (selectedAllele) => {
      const allele = await props.createAlleleFromRecord(selectedAllele);
      return new AllelePair({ top: allele, bot: allele });
    });

    const hetPairs = Array.from(homoAlleles).map(async (selectedAllele) => {
      const allele = await props.createAlleleFromRecord(selectedAllele);
      return new AllelePair({ top: allele, bot: WILD_ALLELE });
    });

    Promise.all(homoPairs.concat(hetPairs))
      .then((allelePairs) => {
        const newNode = createNewCrossNode(sex, allelePairs);
        props.addNewCrossNode(newNode);
        setHomoAlleles(new Set());
        setHetAlleles(new Set());
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h2 className='text-lg'>Add a New Cross Node</h2>
      <SexSelector setSelectedSex={setSex} />

      <DynamicMultiSelect
        placeholder='Type allele name'
        getFilteredRecordApi={props.getFilteredAlleles}
        searchOn={'Name'}
        selectInputOn={'name'}
        displayResultsOn={['name']}
        label='Homozygous Alleles'
        selectedRecords={homoAlleles}
        setSelectedRecords={setHomoAlleles}
        shouldInclude={(allele) =>
          shouldIncludeAllele(homoAlleles, hetAlleles, allele)
        }
      />

      <DynamicMultiSelect
        placeholder='Type allele name'
        getFilteredRecordApi={props.getFilteredAlleles}
        searchOn={'Name'}
        selectInputOn={'name'}
        displayResultsOn={['name']}
        label='Heterozygous Alleles'
        selectedRecords={hetAlleles}
        setSelectedRecords={setHetAlleles}
        shouldInclude={(allele) =>
          shouldIncludeAllele(homoAlleles, hetAlleles, allele)
        }
      />
      <button
        className='btn-primary btn mt-5 max-w-xs'
        onClick={() => {
          onSubmit();
        }}
      >
        Create
      </button>
    </>
  );
};

const SexSelector = (props: {
  setSelectedSex: (sex: Sex) => void;
}): JSX.Element => {
  return (
    <>
      <label className='label'>
        <span className='label-text'>Sex</span>
      </label>
      <select
        onChange={(event) => {
          props.setSelectedSex(
            event.target.value === 'male' ? Sex.Male : Sex.Hermaphrodite
          );
        }}
        className='select-bordered select mb-4 w-full max-w-xs'
      >
        <option value='male'>male</option>
        <option value='hermaphrodite'>hermaphrodite</option>
      </select>
    </>
  );
};

const createNewCrossNode = (
  sex: Sex,
  allelePairs: AllelePair[]
): CrossNodeModel => {
  const crossNodeModel: CrossNodeModel = {
    sex,
    strain: new Strain({
      name: '',
      allelePairs,
      notes: '',
    }),
    isSelected: false,
  };
  return crossNodeModel;
};

function shouldIncludeAllele(
  homoAlleles: Set<db_Allele>,
  hetAlleles: Set<db_Allele>,
  allele: db_Allele
): boolean {
  const names = new Set([...homoAlleles, ...hetAlleles].map((a) => a.name));
  return !names.has(allele.name); // Not included, okay to add
}

export default CrossNodeForm;
