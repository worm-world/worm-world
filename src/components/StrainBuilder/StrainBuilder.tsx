import { getFilteredAlleles } from 'api/allele';
import { AlleleMultiSelect } from 'components/AlleleMultiSelect/AlleleMultiSelect';
import { DynamicMultiSelect } from 'components/DynamicMultiSelect/DynamicMultiSelect';
import { type db_Allele } from 'models/db/db_Allele';
import { Allele, isEcaAlleleName } from 'models/frontend/Allele/Allele';
import { Strain } from 'models/frontend/Strain/Strain';
import { useState } from 'react';

export interface StrainBuilderProps {
  onSubmit: (strain: Strain) => void;
  setPreview?: (strain?: Strain) => void;
}

const StrainBuilder = (props: StrainBuilderProps): JSX.Element => {
  const [prevStrain, setPrevStrain] = useState<Strain>(
    new Strain({ allelePairs: [] })
  );
  const [homoAlleles, setHomoAlleles] = useState(new Set<db_Allele>());
  const [hetAlleles, setHetAlleles] = useState(new Set<db_Allele>());
  const [exAlleles, setExAlleles] = useState(new Set<db_Allele>());

  const buildStrain = async (): Promise<Strain> => {
    const homoPairs = Array.from(homoAlleles).map(async (selectedAllele) =>
      (await Allele.createFromRecord(selectedAllele)).toHomoPair()
    );
    const hetPairs = Array.from(hetAlleles).map(async (selectedAllele) =>
      (await Allele.createFromRecord(selectedAllele)).toTopHetPair()
    );
    const exPairs = Array.from(exAlleles).map(async (selectedAllele) =>
      (await Allele.createFromRecord(selectedAllele)).toEcaPair()
    );

    return new Strain({
      allelePairs: await Promise.all(
        homoPairs.concat(hetPairs).concat(exPairs)
      ),
    });
  };

  buildStrain()
    .then((strain) => {
      if (!strain.equals(prevStrain)) {
        setPrevStrain(strain);
        props.setPreview?.(strain);
      }
    })
    .catch(console.error);

  const onSubmit = (): void => {
    buildStrain()
      .then((strain) => {
        props.onSubmit(strain);
        setHomoAlleles(new Set());
        setHetAlleles(new Set());
        setExAlleles(new Set());
      })
      .catch(console.error);
  };

  return (
    <>
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
        Add Strain to Design
      </button>
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

export default StrainBuilder;
