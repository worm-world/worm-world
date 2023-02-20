import { useState } from 'react';
import {
  Allele,
  WILD_ALLELE,
  isEcaAlleleName,
} from 'models/frontend/Allele/Allele';
import { Sex, sexToString, stringToSex } from 'models/enums';
import { DynamicMultiSelect } from 'components/DynamicMultiSelect/DynamicMultiSelect';
import { db_Allele } from 'models/db/db_Allele';
import { FilterGroup } from 'models/db/filter/FilterGroup';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';

export interface CrossNodeFormProps {
  onSubmitCallback: (sex: Sex, strain: Strain) => void;
  getFilteredAlleles: (
    filter: FilterGroup<AlleleFieldName>
  ) => Promise<db_Allele[]>;
  createAlleleFromRecord: (dbAllele: db_Allele) => Promise<Allele>;
  enforcedSex?: Sex;
}

// CrossNode form specifies a new cross node
const CrossNodeForm = (props: CrossNodeFormProps): JSX.Element => {
  // Save selected options
  const [sex, setSex] = useState(props.enforcedSex ?? Sex.Male);
  const [homoAlleles, setHomoAlleles] = useState(new Set<db_Allele>());
  const [hetAlleles, setHetAlleles] = useState(new Set<db_Allele>());
  const [exAlleles, setExAlleles] = useState(new Set<db_Allele>());

  const onSubmit = (): void => {
    const homoPairs = Array.from(homoAlleles).map(async (selectedAllele) => {
      const allele = await props.createAlleleFromRecord(selectedAllele);
      return new AllelePair({ top: allele, bot: allele });
    });

    // Heterozygous pairs combined with (essentially) heterozygous ECA alleles
    const hetPairs = Array.from(hetAlleles)
      .map(async (selectedAllele) => {
        const allele = await props.createAlleleFromRecord(selectedAllele);
        return new AllelePair({ top: allele, bot: WILD_ALLELE });
      })
      .concat(
        Array.from(exAlleles).map(async (selectedAllele) => {
          const allele = await props.createAlleleFromRecord(selectedAllele);
          return new AllelePair({ top: allele, bot: WILD_ALLELE, isECA: true });
        })
      );

    Promise.all(homoPairs.concat(hetPairs))
      .then((allelePairs) => {
        setHomoAlleles(new Set()); // clear form values
        setHetAlleles(new Set());
        setExAlleles(new Set());
        const strain = new Strain({ allelePairs });
        props.onSubmitCallback(sex, strain);
      })
      .catch((err) => err);
  };

  return (
    <>
      <h2 className='text-lg'>Add a New Cross Node</h2>
      <SexSelector setSelectedSex={setSex} enforcedSex={props.enforcedSex} />

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

      <DynamicMultiSelect
        placeholder='Type allele name'
        getFilteredRecordApi={props.getFilteredAlleles}
        searchOn={'Name'}
        selectInputOn={'name'}
        displayResultsOn={['name']}
        label='Extrachromosomal Array'
        selectedRecords={exAlleles}
        setSelectedRecords={setExAlleles}
        shouldInclude={(allele) => isEcaAlleleName(allele.name)}
      />
      <button className='btn-primary btn mt-5 max-w-xs' onClick={onSubmit}>
        Create
      </button>
    </>
  );
};

const SexSelector = (props: {
  setSelectedSex: (sex: Sex) => void;
  enforcedSex?: Sex;
}): JSX.Element => {
  let disabled = false;
  let selectedValue: string | undefined;
  if (props.enforcedSex !== undefined) {
    disabled = true;
    selectedValue = sexToString(props.enforcedSex);
    props.setSelectedSex(props.enforcedSex);
  }
  return (
    <>
      <label className='label'>
        <span className='label-text'>Sex</span>
      </label>
      <select
        disabled={disabled}
        onChange={(event) => {
          props.setSelectedSex(stringToSex(event.target.value));
        }}
        value={selectedValue}
        className='select-bordered select mb-4 w-full max-w-xs'
      >
        <option value={sexToString(Sex.Male)}>male</option>
        <option value={sexToString(Sex.Hermaphrodite)}>hermaphrodite</option>
      </select>
    </>
  );
};

function shouldIncludeAllele(
  homoAlleles: Set<db_Allele>,
  hetAlleles: Set<db_Allele>,
  dbAllele: db_Allele
): boolean {
  const names = new Set([...homoAlleles, ...hetAlleles].map((a) => a.name));
  return !names.has(dbAllele.name) && !isEcaAlleleName(dbAllele.name);
}

export default CrossNodeForm;
