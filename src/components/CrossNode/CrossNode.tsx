import styles from 'components/crossNode/CrossNode.module.css';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { BiDotsHorizontalRounded as MoreHorizIcon } from 'react-icons/bi';
import { Sex } from 'models/enums';
import { IoMale, IoFemale, IoMaleFemale } from 'react-icons/io5';
import { Allele } from 'models/frontend/Allele/Allele';
import {
  Genotype,
  getGenotype,
  Mutations,
} from 'components/CrossNode/genotype/genotype';

export interface CrossNodeProps {
  model: CrossNodeModel;
}

const getSexIcon = (sex: Sex, className: string): JSX.Element => {
  switch (sex) {
    case Sex.Male:
      return <IoMale className={className} />;
    case Sex.Hermaphrodite:
      return <IoMaleFemale className={className} />;
    case Sex.Female:
      return <IoFemale className={className} />;
  }
};

const CrossNode = (props: CrossNodeProps): JSX.Element => {
  const genotype = getGenotype(props.model);
  return (
    <div
      className={
        'h-28 w-64 rounded bg-base-100 shadow' +
        (props.model.isSelected ? ' border border-primary' : '')
      }
    >
      <div className={styles.crossNodeHeader}>
        {getSexIcon(props.model.sex, 'pt-1 pl-1 text-2xl')}
        <label htmlFor='right-cross-drawer' className='drawer-button pr-2'>
          <button>
            <MoreHorizIcon />
          </button>
        </label>
      </div>
      <div data-testid='crossNodeBody' className={styles.crossNodeBody}>
        {Array.from(genotype).map(([chromosome, mutations]) => {
          const displayChrom = chromosome ?? '?'; // undefined chromosomes are represented by: ?
          return (
            <div key={displayChrom} className={styles.chromosomeBox}>
              <div className={styles.chromosomeLabel}>{displayChrom}</div>
              <div className={styles.chromosomeFractionBox}>
                {getMutationBoxes(mutations)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * @returns Array of allele-pairs formatted like fractions
 */
const getMutationBoxes = (mutations: Mutations): JSX.Element[] => {
  return Array.from(mutations).map(([mutation, alleles], idx) => (
    <div
      key={`${mutation.chromosome}-${idx}`}
      className={styles.chromosomeFraction}
    >
      {getMutationBox(alleles)}
    </div>
  ));
};

const getMutationBox = (alleles: Allele[]): JSX.Element => {
  if (alleles.length === 1) {
    return <div>{alleles[0].name}</div>;
  } else
    return (
      <>
        <div className={styles.fractionAllele}>{alleles[0].name}</div>
        <div>
          <hr className={styles.fractionBar} />
        </div>
        <div className={styles.fractionAllele}>{alleles[1].name}</div>
      </>
    );
};

export default CrossNode;
