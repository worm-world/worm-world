import styles from 'components/crossNode/CrossNode.module.css';
import { Box, Button } from '@mui/material';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSexIconUrl, Sex } from 'models/enums';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Allele } from 'models/frontend/Allele/Allele';
import {
  Genotype,
  getGenotype,
  Mutations,
} from 'components/CrossNode/genotype/genotype';

export interface CrossNodeProps {
  model: CrossNodeModel;
}

const CrossNode = (props: CrossNodeProps): ReactJSXElement => {
  const genotype = getGenotype(props.model);
  return (
    <Box
      sx={props.model.isSelected ? { border: '1px solid blue' } : {}}
      className={styles.crossNode + ' bg-white'}
    >
      <Box className={styles.crossNodeHeader}>
        {getCrossNodeHeader(props.model.sex)}
      </Box>
      <Box data-testid='crossNodeBody' className={styles.crossNodeBody}>
        {getCrossNodeBody(genotype)}
      </Box>
    </Box>
  );
};

const getCrossNodeHeader = (sex: Sex): ReactJSXElement => {
  return (
    <>
      {/* <label className={styles.sex}>{getSexIconUrl(sex)}</label> */}
      <img className='p-1 py-2 w-7 h-9' src={getSexIconUrl(sex)} />
      <Button sx={{ boxShadow: 'none' }}>
        <MoreHorizIcon />{' '}
      </Button>
    </>
  );
};

const getCrossNodeBody = (genotype: Genotype): ReactJSXElement => {
  return (
    <>
      {Array.from(genotype).map(([chromosome, mutations]) => {
        const displayChrom = chromosome ?? '?'; // undefined chromosomes are represented by: ?
        return (
          <Box key={displayChrom} className={styles.chromosomeBox}>
            <Box className={styles.chromosomeLabel}>{displayChrom}</Box>
            <Box className={styles.chromosomeFractionBox}>
              {getMutationBoxes(mutations)}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

/**
 * @returns Array of allele-pairs formatted like fractions
 */
const getMutationBoxes = (mutations: Mutations): ReactJSXElement[] => {
  return Array.from(mutations).map(([mutation, alleles], idx) => (
    <Box
      key={`${mutation.chromosome}-${idx}`}
      className={styles.chromosomeFraction}
    >
      {getMutationBox(alleles)}
    </Box>
  ));
};

const getMutationBox = (alleles: Allele[]): ReactJSXElement => {
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
