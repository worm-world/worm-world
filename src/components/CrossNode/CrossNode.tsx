import styles from 'components/crossNode/CrossNode.module.css';
import { Box, Typography, Button } from '@mui/material';
import CrossNode from 'models/frontend/CrossNode/CrossNode';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSexIcon, Sex } from 'models/enums';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Handle, Position } from 'reactflow';
import getGenotype, * as genotypeTypes from 'components/CrossNode/genotype/genotype';

export interface iCrossNodeProps {
  data: CrossNode;
}

const CrossNodeElement = (props: iCrossNodeProps): ReactJSXElement => {
  const genotype = getGenotype(props.data);
  return (
    <Box
      sx={props.data.isSelected ? { border: '1px solid blue' } : {}}
      className={styles.crossNode + ' bg-white'}
    >
      <Handle type='target' position={Position.Top} />
      <Box className={styles.crossNodeHeader}>
        {getCrossNodeHeader(props.data.sex)}
      </Box>
      <Box className={styles.crossNodeBody}>{getCrossNodeBody(genotype)}</Box>
      <Handle type='source' position={Position.Bottom} />
    </Box>
  );
};

const getCrossNodeHeader = (sex: Sex): ReactJSXElement => {
  return (
    <>
      <Typography sx={{ fontSize: '1.2em' }} className={styles.sex}>
        {getSexIcon(sex)}
      </Typography>
      <Button sx={{ boxShadow: 'none' }}>
        <MoreHorizIcon />{' '}
      </Button>
    </>
  );
};

const getCrossNodeBody = (
  genotype: genotypeTypes.Genotype
): ReactJSXElement => {
  return (
    <>
      {Array.from(genotype).map(([chromosome, mutations]) => {
        return (
          <Box key={chromosome} className={styles.chromosomeBox}>
            <Typography className={styles.chromosomeLabel}>
              {chromosome}
            </Typography>
            <Box className={styles.chromosomeFractionBox}>
              {getFractionsForChromosome(mutations)}
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
const getFractionsForChromosome = (
  mutations: genotypeTypes.Mutations
): ReactJSXElement[] => {
  return Array.from(mutations).map(([mutation, alleles]) => (
    <Box key={mutation.name} className={styles.chromosomeFraction}>
      <div className={styles.fractionAllele}>{alleles[0].name}</div>
      <div>
        <hr className={styles.fractionBar} />
      </div>
      <div className={styles.fractionAllele}>{alleles[1].name}</div>
    </Box>
  ));
};

export default CrossNodeElement;
