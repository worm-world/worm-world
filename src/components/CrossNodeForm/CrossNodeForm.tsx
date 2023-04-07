import { useState } from 'react';
import { isEcaAlleleName, Allele } from 'models/frontend/Allele/Allele';
import { Sex, sexToString, stringToSex } from 'models/enums';
import { DynamicMultiSelect } from 'components/DynamicMultiSelect/DynamicMultiSelect';
import { db_Allele } from 'models/db/db_Allele';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { getFilteredAlleles } from 'api/allele';
import { AlleleMultiSelect } from 'components/AlleleMultiSelect/AlleleMultiSelect';

export interface CrossNodeFormProps {
  onSubmitCallback: (sex: Sex, strain: Strain) => void;
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
      const allele = await Allele.createFromRecord(selectedAllele);
      return new AllelePair({ top: allele, bot: allele });
    });

    const hetPairs = Array.from(hetAlleles).map(async (selectedAllele) => {
      const allele = await Allele.createFromRecord(selectedAllele);
      return new AllelePair({ top: allele, bot: allele.getWildCopy() });
    });

    const exPairs = Array.from(exAlleles).map(async (selectedAllele) => {
      const allele = await Allele.createFromRecord(selectedAllele);
      return new AllelePair({
        top: allele,
        bot: allele.getWildCopy(),
        isECA: true,
      });
    });

    Promise.all(homoPairs.concat(hetPairs).concat(exPairs))
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

      <AlleleMultiSelect
        placeholder='Type allele name'
        label='Homozygous Alleles'
        selectedRecords={homoAlleles}
        setSelectedRecords={setHomoAlleles}
        shouldInclude={(allele) =>
          alleleIsUnused(homoAlleles, hetAlleles, exAlleles, allele) &&
          !isEcaAlleleName(allele.name)
        }
      />

      <AlleleMultiSelect
        placeholder='Type allele name'
        label='Heterozygous Alleles'
        selectedRecords={hetAlleles}
        setSelectedRecords={setHetAlleles}
        shouldInclude={(allele) =>
          alleleIsUnused(homoAlleles, hetAlleles, exAlleles, allele) &&
          !isEcaAlleleName(allele.name)
        }
      />

      <DynamicMultiSelect
        placeholder='Type allele name'
        getFilteredRecordApi={getFilteredAlleles}
        searchOn={'Name'}
        selectInputOn={'name'}
        displayResultsOn={['name']}
        label='Extrachromosomal Array'
        selectedRecords={exAlleles}
        setSelectedRecords={setExAlleles}
        shouldInclude={(allele) =>
          alleleIsUnused(homoAlleles, hetAlleles, exAlleles, allele) &&
          isEcaAlleleName(allele.name)
        }
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

function alleleIsUnused(
  homoAlleles: Set<db_Allele>,
  hetAlleles: Set<db_Allele>,
  exAlleles: Set<db_Allele>,
  dbAllele: db_Allele
): boolean {
  const names = new Set(
    [...homoAlleles, ...hetAlleles, ...exAlleles].map((a) => a.name)
  );
  return !names.has(dbAllele.name);
}

export default CrossNodeForm;
