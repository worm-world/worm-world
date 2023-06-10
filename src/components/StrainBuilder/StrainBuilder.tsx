import { getFilteredAlleles } from 'api/allele';
import { AlleleMultiSelect } from 'components/AlleleMultiSelect/AlleleMultiSelect';
import { DynamicMultiSelect } from 'components/DynamicMultiSelect/DynamicMultiSelect';
import { type db_Allele } from 'models/db/db_Allele';
import { Allele, isEcaAlleleName } from 'models/frontend/Allele/Allele';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { useState } from 'react';
import { toast } from 'react-toastify';

export interface StrainBuilderProps {
  onSubmit: (strain: Strain) => void;
  setPreview?: (strain?: Strain) => void;
}

function mergePairs(pair1: AllelePair, pair2: AllelePair): AllelePair {
  return new AllelePair({ top: pair1.getAllele(), bot: pair2.getAllele() });
}

const buildStrain = async (
  homos: Set<db_Allele>,
  hets: Set<db_Allele>,
  ecas: Set<db_Allele>
): Promise<Strain> => {
  const homoPairs = Array.from(homos).map(async (allele) =>
    (await Allele.createFromRecord(allele)).toHomoPair()
  );
  const exPairs = Array.from(ecas).map(async (allele) =>
    (await Allele.createFromRecord(allele)).toEcaPair()
  );

  // Merge het pairs
  let hetPairs = await Promise.all(
    Array.from(hets).map(async (allele) =>
      (await Allele.createFromRecord(allele)).toTopHetPair()
    )
  );
  const hetPairsMap = new Map<string, AllelePair[]>();
  hetPairs.forEach((pair) => {
    const alleleName =
      pair.getAllele().gene?.sysName ?? pair.getAllele().variation?.name ?? '';
    hetPairsMap.get(alleleName)?.push(pair) ??
      hetPairsMap.set(alleleName, [pair]);
  });
  hetPairsMap.forEach((pairs, alleleName) => {
    if (pairs.length > 2) {
      throw new Error(
        'Cannot have more than two heterozygous alleles on one gene or variation.'
      );
    } else if (pairs.length === 2) {
      hetPairsMap.set(alleleName, [mergePairs(pairs[0], pairs[1])]);
    }
  });
  hetPairs = Array.from(hetPairsMap.values()).flat();
  return await Strain.buildWithDynName({
    allelePairs: (
      await Promise.all(homoPairs.concat(exPairs))
    ).concat(hetPairs),
  });
};

const StrainBuilder = (props: StrainBuilderProps): JSX.Element => {
  const [homoAlleles, setHomoAlleles] = useState(new Set<db_Allele>());
  const [hetAlleles, setHetAlleles] = useState(new Set<db_Allele>());
  const [ecaAlleles, setEcaAlleles] = useState(new Set<db_Allele>());

  const onSubmit = (): void => {
    buildStrain(homoAlleles, hetAlleles, ecaAlleles)
      .then((strain) => {
        props.onSubmit(strain);
        setHomoAlleles(new Set());
        setHetAlleles(new Set());
        setEcaAlleles(new Set());
      })
      .catch(console.error);
  };

  return (
    <>
      <AlleleMultiSelect
        placeholder='Type allele name'
        label='Homozygous Alleles'
        selectedRecords={homoAlleles}
        setSelectedRecords={(records) => {
          buildStrain(records, hetAlleles, ecaAlleles)
            .then(() => {
              setHomoAlleles(records);
            })
            .then(props.setPreview)
            .catch((error: Error) => {
              toast.error(error.message);
            });
        }}
        shouldInclude={(allele) =>
          alleleIsUnused(homoAlleles, hetAlleles, ecaAlleles, allele) &&
          !isEcaAlleleName(allele.name)
        }
      />

      <AlleleMultiSelect
        placeholder='Type allele name'
        label='Heterozygous Alleles'
        selectedRecords={hetAlleles}
        setSelectedRecords={(records) => {
          buildStrain(homoAlleles, records, ecaAlleles)
            .then(props.setPreview)
            .then(() => {
              setHetAlleles(records);
            })
            .catch((error: Error) => {
              toast.error(error.message);
            });
        }}
        shouldInclude={(allele) =>
          alleleIsUnused(homoAlleles, hetAlleles, ecaAlleles, allele) &&
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
        selectedRecords={ecaAlleles}
        setSelectedRecords={(records) => {
          buildStrain(homoAlleles, hetAlleles, records)
            .then(props.setPreview)
            .then(() => {
              setEcaAlleles(records);
            })
            .catch((error: Error) => {
              toast.error(error.message);
            });
        }}
        shouldInclude={(allele) =>
          alleleIsUnused(homoAlleles, hetAlleles, ecaAlleles, allele) &&
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
  EcaAlleles: Set<db_Allele>,
  dbAllele: db_Allele
): boolean {
  const names = new Set(
    [...homoAlleles, ...hetAlleles, ...EcaAlleles].map((a) => a.name)
  );
  return !names.has(dbAllele.name);
}

export default StrainBuilder;
