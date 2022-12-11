import styles from 'components/crossNode/CrossNode.module.css';
import { Box, Typography, Button } from '@mui/material';
import CrossNode from 'models/frontend/CrossNode';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Allele } from 'models/frontend/Allele';
import { getSexIcon, Sex } from 'models/enums';
import { Gene } from 'models/frontend/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

const UNKNOWN_CHROM = '?';

type Mutation = Gene & VariationInfo; // Relative to wild type

type ChromosomeName = string;
type MutationName = string;
type AlleleName = string;

type Genotype = Map<ChromosomeName, AllelesOfMutation>;
type AllelesOfMutation = Map<Mutation, Allele[]>;
type AllelesOfMutationName = Map<MutationName, AlleleName[]>;

const CrossNodeElement = (props: CrossNode): ReactJSXElement => {
  const genotype = getGenotype(props);

  return (
    <Box
      sx={props.isSelected ? { border: '1px solid blue' } : {}}
      className={styles.crossNode}
    >
      <Box className={styles.crossNodeHeader}>
        {getCrossNodeHeader(props.sex)}
      </Box>
      <Box className={styles.crossNodeBody}>{getCrossNodeBody(genotype)}</Box>
    </Box>
  );
};

// Data format transformation to get hierarchical map: chromosome -> gene/variation -> alleles
function getGenotype(crossNode: CrossNode): Genotype {
  const genotype: Genotype = new Map<ChromosomeName, AllelesOfMutation>();

  const genes = crossNode.genes;
  const variations = crossNode.variations;
  fillGenotypeWithChromosomes(genotype, genes, variations);

  const alleles = crossNode.strain.alleles;
  fillGenotypeWithAlleles(genotype, alleles);

  return genotype;
}

// Include all chromosomes from provided loci; to display (as mutant or wild)
function fillGenotypeWithChromosomes(
  genotype: Genotype,
  genes: Gene[],
  variations: VariationInfo[]
): void {
  const loci = (genes as Mutation[]).concat(variations as Mutation[]);
  for (const mutation of loci) {
    const chromosomeName = mutation.chromosome ?? UNKNOWN_CHROM;
    if (!genotype.has(chromosomeName)) {
      genotype.set(chromosomeName, new Map<Mutation, Allele[]>());
    }
    const allelesAtMutation = genotype.get(chromosomeName);
    (allelesAtMutation as AllelesOfMutation).set(mutation, []);
  }
}

function fillGenotypeWithAlleles(genotype: Genotype, alleles: Allele[]): void {
  for (const allele of alleles) {
    let mutation = allele.gene ?? allele.variationInfo;
    if (mutation === undefined) {
      console.error(`The allele ${allele.name} has no associated gene or variation info. 
      This violates a consistency expectation. A dummy variation is being assigned.`);
      // Arbitrarily choose variation info for allele's mutation (instead of gene)
      mutation = new VariationInfo({
        name: `dummy_variation_${allele.name}`,
        chromosome: UNKNOWN_CHROM,
      });
      allele.variationInfo = mutation;
    }

    const chromosome = mutation.chromosome ?? UNKNOWN_CHROM;
    let allelesOfMutation = genotype.get(chromosome);
    if (allelesOfMutation === undefined) {
      console.error(
        `The allele ${allele.name} exists on a chromosome or extrachromosomal array 
         not referenced in list of Genes or VariationInfos.
         A chromosome has been added for this node, 
         but it will not necessarily be displayed in other nodes.`
      );
      allelesOfMutation = new Map<Mutation, Allele[]>();
      allelesOfMutation.set(mutation as Mutation, []);
      genotype.set(chromosome, allelesOfMutation);
    }

    const alleleList = allelesOfMutation.get(mutation as Mutation);
    alleleList?.push(allele);
  }
}

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

const getCrossNodeBody = (genotype: Genotype): ReactJSXElement => {
  return (
    <>
      {Array.from(genotype.keys()).map((chromosomeName) => {
        return (
          <Box key={chromosomeName} className={styles.chromosomeBox}>
            <Typography className={styles.chromosomeLabel}>
              {chromosomeName}
            </Typography>
            <Box className={styles.chromosomeFractionBox}>
              {getFractionsForChromosome(
                genotype.get(chromosomeName) ?? new Map<Mutation, Allele[]>()
              )}
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
  allelesOfMutation: AllelesOfMutation
): ReactJSXElement[] => {
  const allelesOfMutationNames: AllelesOfMutationName = new Map<
    MutationName,
    AlleleName[]
  >();
  for (const mutation of allelesOfMutation.keys()) {
    const alleles = allelesOfMutation.get(mutation) ?? [];
    allelesOfMutationNames.set(mutation.name, [
      alleles.length > 0 ? alleles[0].name : '+',
      alleles.length > 1 ? alleles[1].name : '+',
    ]);
  }

  return Array.from(allelesOfMutationNames.keys()).map((mutationName) => (
    <Box key={mutationName} className={styles.chromosomeFraction}>
      <div className={styles.fractionAllele}>
        {allelesOfMutationNames.get(mutationName)?.at(0)}
      </div>
      <div>
        <hr className={styles.fractionBar} />
      </div>
      <div className={styles.fractionAllele}>
        {allelesOfMutationNames.get(mutationName)?.at(1)}
      </div>
    </Box>
  ));
};

export default CrossNodeElement;
