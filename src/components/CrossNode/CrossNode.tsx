import styles from 'components/crossNode/CrossNode.module.css';
import SvgIcon from '@mui/material/SvgIcon';
import { Box, Typography, Button } from '@mui/material';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSexIcon, Sex } from 'models/enums';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Handle, Position } from 'reactflow';
import getGenotype, * as genotypeTypes from 'components/CrossNode/genotype/genotype';
import { Allele } from 'models/frontend/Allele/Allele';

export interface iCrossNodeProps {
  model: CrossNodeModel;
}

const CrossNode = (props: iCrossNodeProps): ReactJSXElement => {
  const genotype = getGenotype(props.model);
  return (
    <Box
      sx={props.model.isSelected ? { border: '1px solid blue' } : {}}
      className={styles.crossNode + ' bg-white'}
    >
      <Handle type='target' position={Position.Top} />
      <Box className={styles.crossNodeHeader}>
        {getCrossNodeHeader(props.model.sex)}
      </Box>
      <Box data-testid="crossNodeBody" className={styles.crossNodeBody}>{getCrossNodeBody(genotype)}</Box>
      <Handle type='source' position={Position.Bottom} />
    </Box>
  );
};

const getCrossNodeHeader = (sex: Sex): ReactJSXElement => {
  return (
    <>
      <header className={styles.sex}>
        {getSexIcon(sex)}
      </header>
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
            <Box className={styles.chromosomeLabel}>
              {chromosome}
            </Box>
            <Box className={styles.chromosomeFractionBox}>
              {getMutationBoxes(mutations)}
            </Box>
          </Box>
        );
      })}
    </>
  );
}

/**
 * @returns Array of allele-pairs formatted like fractions
 */
const getMutationBoxes = (
  mutations: genotypeTypes.Mutations
): ReactJSXElement[] => {
  return Array.from(mutations).map(([mutation, alleles]) => (
    <Box key={mutation.name} className={styles.chromosomeFraction}>
      {getMutationBox(alleles)}
    </Box>
  ));
}

const getMutationBox = (alleles: Allele[]): ReactJSXElement => {
  if (alleles.length === 1) {
    return (<div>{alleles[0].name}</div>);
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
}

export default CrossNode;
