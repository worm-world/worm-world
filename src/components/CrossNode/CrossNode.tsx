import styles from 'components/crossNode/CrossNode.module.css';
import { Box, Button } from '@mui/material';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getSexIconUrl, Sex } from 'models/enums';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Handle, Position } from 'reactflow';
import getGenotype, * as genotypeTypes from 'components/CrossNode/genotype/genotype';
import { Allele } from 'models/frontend/Allele/Allele';

export interface CrossNodeProps {
  data: CrossNodeModel;
}

const CrossNode = (props: CrossNodeProps): ReactJSXElement => {
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
      <Box data-testid='crossNodeBody' className={styles.crossNodeBody}>
        {getCrossNodeBody(genotype)}
      </Box>
      <Handle type='source' position={Position.Bottom} />
    </Box>
  );
};

const getCrossNodeHeader = (sex: Sex): ReactJSXElement => {
  return (
    <>
      {/* <label className={styles.sex}>{getSexIconUrl(sex)}</label> */}
      <img className="p-1 py-2 w-7 h-9" src={getSexIconUrl(sex)}/>
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
            <Box className={styles.chromosomeLabel}>{chromosome}</Box>
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
const getMutationBoxes = (
  mutations: genotypeTypes.Mutations
): ReactJSXElement[] => {
  return Array.from(mutations).map(([mutation, alleles]) => (
    <Box key={mutation.name} className={styles.chromosomeFraction}>
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
