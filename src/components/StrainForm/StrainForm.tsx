import { Strain } from 'models/frontend/Strain/Strain';
import { useState } from 'react';
import StrainNode from 'components/StrainNode/StrainNode';
import { StrainData } from 'models/frontend/StrainData/StrainData';
import { type Sex } from 'models/enums';
import { getFilteredStrains } from 'api/strain';
import { AlleleMultiSelect } from 'components/AlleleMultiSelect/AlleleMultiSelect';
import { type db_Allele } from 'models/db/db_Allele';
import { type db_Strain } from 'models/db/db_Strain';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { type StrainFieldName } from 'models/db/filter/db_StrainFieldName';
import { isEcaAlleleName, Allele } from 'models/frontend/Allele/Allele';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';

export interface StrainFormProps {
  onSubmit: (strain: Strain) => void;
  enforcedSex?: Sex;
}

export type StrainFormSource = 'select' | 'alleles' | 'toggle';
export interface StrainFormState {
  strain: Strain;
  source: StrainFormSource;
}

const StrainForm = (props: StrainFormProps): React.JSX.Element => {
  const defaultState: StrainFormState = {
    strain: new Strain({ sex: props.enforcedSex }),
    source: 'alleles',
  };
  const [state, setState] = useState(defaultState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Includes Eca
  const regAlleles = new Set(
    state.strain
      .getRegularAlleles(state.strain.sex)
      .map((allele) => allele.generateRecord())
  );

  const irregAlleles = new Set(
    state.strain
      .getIrregularAlleles(state.strain.sex)
      .map((allele) => allele.generateRecord())
  );

  if (irregAlleles.size > 0 && !showAdvanced) setShowAdvanced(true);

  const setStrainFromAlleles = ({
    regs = regAlleles,
    irregs = irregAlleles,
  }): void => {
    buildStrain(regs, irregs)
      .then((strain) => {
        setState({ strain, source: 'alleles' });
      })
      .catch(console.error);
  };

  function alleleIsUnused(allele: db_Allele): boolean {
    return ![...regAlleles, ...irregAlleles]
      .map((allele) => allele.name)
      .includes(allele.name);
  }

  return (
    <div className='form-control h-full gap-2'>
      <h1 className='text-lg'>Add Strain</h1>
      <StrainNode
        data={
          new StrainData({
            strain: state.strain,
            toggleHetPair: (pair) => {
              pair.flip();
              if (state.strain !== undefined)
                Strain.build({ allelePairs: state.strain.getAllelePairs() })
                  .then((strain) => {
                    setState({ source: 'toggle', strain });
                  })
                  .catch(console.error);
            },
            toggleSex: () => {
              setState((state) => {
                state.strain.toggleSex();
                return { strain: state.strain, source: 'toggle' };
              });
            },
            isParent: props.enforcedSex !== undefined,
          })
        }
      />
      <StrainSelect
        strain={state.strain.generateRecord()}
        setStrain={(strain) => {
          Strain.createFromRecord(strain)
            .then((strain) => {
              setState({ strain, source: 'select' });
            })
            .catch(console.error);
        }}
        clearStrain={() => {
          setState({ strain: new Strain(), source: 'select' });
        }}
        source={state.source}
      />
      <AlleleMultiSelect
        placeholder='Type allele name'
        label='Alleles'
        selectedRecords={regAlleles}
        setSelectedRecords={(regs) => {
          setStrainFromAlleles({ regs });
        }}
        shouldInclude={alleleIsUnused}
      />
      {showAdvanced && (
        <AlleleMultiSelect
          placeholder='Type allele name'
          label='Heterozygous Alleles'
          selectedRecords={irregAlleles}
          setSelectedRecords={(irregs) => {
            setStrainFromAlleles({ irregs });
          }}
          shouldInclude={(allele) =>
            alleleIsUnused(allele) && !isEcaAlleleName(allele.name)
          }
        />
      )}
      <button
        className='btn-primary btn mt-4'
        onClick={() => {
          props.onSubmit(state.strain);
          setState(defaultState);
        }}
      >
        Add Strain to Design
      </button>
      <button
        className='btn-ghost btn mt-auto'
        disabled={irregAlleles.size > 0}
        onClick={() => {
          setShowAdvanced(!showAdvanced);
        }}
      >
        {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
      </button>
    </div>
  );
};

export interface StrainSelectProps {
  strain: db_Strain;
  setStrain: (strain: db_Strain) => void;
  clearStrain: () => void;
  source: StrainFormSource;
}

export const StrainSelect = (props: StrainSelectProps): React.JSX.Element => {
  const [searchRes, setSearchRes] = useState<db_Strain[]>([]);
  const [text, setText] = useState('');

  if (props.source !== 'select' && props.strain.name !== text) {
    setText(props.strain.name);
    setSearchRes([]);
  }

  const getSearchRes = async (strainName: string): Promise<db_Strain[]> => {
    const filter: FilterGroup<StrainFieldName> = {
      filters: [[['Name', { Like: strainName }]]],
      orderBy: [],
    };
    return await getFilteredStrains(filter);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    props.clearStrain();
    setText(event.target.value);
    if (event.target.value === '') {
      setSearchRes([]);
      return;
    }
    getSearchRes(event.target.value).then(setSearchRes).catch(console.error);
  };

  return (
    <div>
      <label htmlFor={'strain-select-input'} className='label'>
        <span className='label-text'>Strain</span>
      </label>
      <div className='dropdown w-full max-w-md'>
        <input
          type='text'
          id='strain-select-input'
          placeholder='Type strain name'
          className='input-bordered input w-full max-w-xs'
          onChange={onInputChange}
          value={text}
        />
        {searchRes.length === 0 ? (
          <></>
        ) : (
          <ul className='dropdown-content menu rounded-box z-50 my-2 max-h-80 w-52 overflow-auto bg-base-100 p-2 shadow'>
            {searchRes.map((strain, idx) => {
              return (
                <li
                  key={idx}
                  tabIndex={0}
                  onClick={() => {
                    props.setStrain(strain);
                    setText(strain.name);
                    setSearchRes([]);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') props.setStrain(strain);
                  }}
                >
                  <a>{strain.name}</a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

const buildStrain = async (
  regs: Set<db_Allele>,
  irregs: Set<db_Allele>
): Promise<Strain> => {
  const homoPairs = await Promise.all(
    Array.from(regs).map(async (dbAllele) => {
      const allele = await Allele.createFromRecord(dbAllele);
      return allele.isEca() ? allele.toTopHet() : allele.toHomo();
    })
  );

  // Merge co-located het pairs
  const hetPairs: AllelePair[] = [];
  const hetMap = new Map<string, Allele[]>();
  (
    await Promise.all(
      Array.from(irregs).map(
        async (allele) => await Allele.createFromRecord(allele)
      )
    )
  ).forEach((allele) => {
    const locus = allele.gene?.sysName ?? allele.variation?.name ?? '';
    hetMap.get(locus)?.push(allele) ?? hetMap.set(locus, [allele]);
  });
  hetMap.forEach((alleles, locus) => {
    if (alleles.length > 2)
      throw new Error(
        'Cannot have more than two heterozygous alleles on one gene or variation.'
      );
    else if (alleles.length === 2)
      hetPairs.push(new AllelePair({ top: alleles[0], bot: alleles[1] }));
    else
      hetPairs.push(
        new AllelePair({ top: alleles[0], bot: alleles[0].toWild() })
      );
  });
  return await Strain.build({ allelePairs: [...homoPairs, ...hetPairs] });
};

export default StrainForm;
