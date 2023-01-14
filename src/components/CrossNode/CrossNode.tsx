import styles from 'components/crossNode/CrossNode.module.css';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSexIconUrl, Sex } from 'models/enums';
import { Allele } from 'models/frontend/Allele/Allele';
import {
  Genotype,
  getGenotype,
  Mutations,
} from 'components/CrossNode/genotype/genotype';

export interface CrossNodeProps {
  model: CrossNodeModel;
}

const CrossNode = (props: CrossNodeProps): JSX.Element => {
  const genotype = getGenotype(props.model);
  return (
    <div className={"bg-base-100 w-64 h-28 rounded shadow" + (props.model.isSelected ? " border border-primary" : "")}>
      <div className={styles.crossNodeHeader}>
        <img className='p-1 py-2 w-7 h-9' src={getSexIconUrl(props.model.sex)} />
        <button className='pr-2'>
          <MoreHorizIcon />
        </button>
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
