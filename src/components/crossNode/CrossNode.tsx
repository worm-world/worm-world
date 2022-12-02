import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import styles from './CrossNode.module.css';
import { Box, Typography, Button } from '@mui/material';
import CrossNode from 'models/frontend/CrossNode';
import { Sex } from '../../models/enums';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Allele } from 'models/frontend/Allele';

const sexIcons = {
  [Sex.Male]: '♂',
  [Sex.Hermaphrodite]: '⚥',
  [Sex.Female]: '♀',
};

interface GeneGroup {
  [geneName: string]: Allele[];
}

interface ChromosomeGroup {
  [chromosome: string]: GeneGroup;
}
function getChromosomeGroups(crossNode: CrossNode): ChromosomeGroup {
  const genes = crossNode.genes;
  const alleles = crossNode.strain.alleles;

  const chromosomes = Array.from(new Set(genes.map((gene) => gene.chromosome)));

  // Creates object like {I: {}, II: {}}
  let chromosomeGroup: ChromosomeGroup = chromosomes.reduce(
    (accumulator, chromosome) => {
      return { ...accumulator, [chromosome]: {} };
    },
    {}
  );

  // Creates object like {I: {gene1: [], gene2: []}, II: {gene3: []}}
  for (const gene of genes) {
    chromosomeGroup[gene.chromosome][gene.name] = [];
  }

  chromosomeGroup = alleles.reduce((chromosomeGroup, allele) => {
    const chromosome = genes.filter((gene) => gene.name === allele.geneName)[0]
      .chromosome;
    chromosomeGroup[chromosome][allele.geneName].push(allele);
    return chromosomeGroup;
  }, chromosomeGroup);

  return chromosomeGroup;
}

const CrossNodeElement = (props: CrossNode): ReactJSXElement => {
  const chromosomeGroups = getChromosomeGroups(props);
  return (
    <Box
      sx={props.isSelected ? { border: '1px solid blue' } : {}}
      className={styles.crossNode}
    >
      <Box className={styles.crossNodeHeader}>
        <Typography sx={{ 'font-size': '1.2em' }} className={styles.sex}>
          {sexIcons[props.sex]}
        </Typography>
        <Button>
          <MoreHorizIcon />{' '}
        </Button>
      </Box>
      <Box className={styles.crossNodeBody}>
        {Object.keys(chromosomeGroups).map((chromosome) => (
          <Box key={chromosome} className={styles.chromosomeBox}>
            <label className={styles.chromosomeLabel}>{chromosome}</label>
            <Box className={styles.chromosomeFractionBox}>
              {getChromosomeFractions(chromosomeGroups[chromosome])}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/**
 * @returns Array of allele-pairs formatted like fractions
 */
const getChromosomeFractions = (geneGroup: GeneGroup): ReactJSXElement[] => {
  const geneGroupNames: { [geneName: string]: string[] } = {};
  for (const geneName in geneGroup) {
    const alleles = geneGroup[geneName];
    geneGroupNames[geneName] = [
      alleles.length > 0 ? alleles[0].name : '+',
      alleles.length > 1 ? alleles[1].name : '+',
    ];
  }

  return Object.keys(geneGroupNames).map((geneName) => (
    <Box key={geneName} className={styles.chromosomeFraction}>
      <div className={styles.fractionAllele}>{geneGroupNames[geneName][0]}</div>
      <div>
        <hr className={styles.fractionBar} />
      </div>
      <div className={styles.fractionAllele}>{geneGroupNames[geneName][1]}</div>
    </Box>
  ));
};

export default CrossNodeElement;
