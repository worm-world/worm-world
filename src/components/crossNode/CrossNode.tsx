import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import styles from './CrossNode.module.css';
import { Box, Typography, Button } from '@mui/material';
import CrossNode from 'models/frontend/CrossNode';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Allele } from 'models/frontend/Allele';
import { getSexIcon, Sex } from 'models/enums';
import { Locus } from 'models/frontend/Locus';
import { Gene } from 'models/frontend/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo';

// Used as "chromosome name" when not given
// (e.g., for extrachromosomal arrays)
const exChrom = 'ex-chrom';

type ChromosomeName = string;
type LocusName = string;
type AlleleName = string;

type Genotype = Map<ChromosomeName, AllelesAtLocus>;
type AllelesAtLocus = Map<Locus, Allele[]>;
type AllelesAtLocusNames = Map<LocusName, AlleleName[]>;

// Data format transformation to get hierarchical map: chromosome -> gene/variation -> alleles
function getGenotype(crossNode: CrossNode): Genotype {
  const genotype: Genotype = new Map<ChromosomeName, AllelesAtLocus>();

  const genes = crossNode.genes ?? [];
  const variations = crossNode.variations ?? [];
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
  const loci = (genes as Locus[]).concat(variations as Locus[]);
  for (const locus of loci) {
    const chromosomeName = locus.chromosome ?? exChrom;
    if (!genotype.has(chromosomeName)) {
      genotype.set(chromosomeName, new Map<Locus, Allele[]>());
    }
    const allelesAtLocus = genotype.get(chromosomeName);
    (allelesAtLocus as AllelesAtLocus).set(locus, []);
  }
}

function fillGenotypeWithAlleles(genotype: Genotype, alleles: Allele[]): void {
  for (const allele of alleles) {
    const locus = allele.gene ?? allele.variationInfo;
    if (locus === undefined) {
      throw Error(
        `The locus ${locus} does not have an associated gene or variation.`
      );
    }

    const chromosome = locus?.chromosome ?? exChrom;
    const allelesAtLocus = genotype.get(chromosome);
    if (allelesAtLocus === undefined) {
      throw Error(
        `The allele ${allele.name} exists on a chromosome (or exChrom) not referenced in list of Genes or VariationInfos.`
      );
    }

    const alleleList = allelesAtLocus.get(locus as Locus);
    alleleList?.push(allele);
  }
}

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

const getCrossNodeHeader = (sex: Sex): ReactJSXElement => {
  return (
    <>
      <Typography sx={{ 'font-size': '1.2em' }} className={styles.sex}>
        {getSexIcon(sex)}
      </Typography>
      <Button>
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
            <label className={styles.chromosomeLabel}>{chromosomeName}</label>
            <Box className={styles.chromosomeFractionBox}>
              {getFractionsForChromosome(
                genotype.get(chromosomeName) ?? new Map()
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
  AllelesAtLocus: AllelesAtLocus
): ReactJSXElement[] => {
  const allelesAtLocusNames: AllelesAtLocusNames = new Map<
    LocusName,
    AlleleName[]
  >();
  for (const locus of AllelesAtLocus.keys()) {
    const alleles = AllelesAtLocus.get(locus) ?? [];
    allelesAtLocusNames.set(locus.name, [
      alleles?.length > 0 ? alleles[0].name : '+',
      alleles?.length > 1 ? alleles[1].name : '+',
    ]);
  }

  // console.log(AllelesAtLocusNames)

  return Array.from(allelesAtLocusNames.keys()).map((locusName) => (
    <Box key={locusName} className={styles.chromosomeFraction}>
      <div className={styles.fractionAllele}>
        {allelesAtLocusNames.get(locusName)?.at(0)}
      </div>
      <div>
        <hr className={styles.fractionBar} />
      </div>
      <div className={styles.fractionAllele}>
        {allelesAtLocusNames.get(locusName)?.at(1)}
      </div>
    </Box>
  ));
};

export default CrossNodeElement;
