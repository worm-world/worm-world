/**
 * Genotype is a transformed data format from the props of a CrossNode
 * that better models how genotypes are displayed hierarchically
 * (chromosome -> gene -> allele)
 */

import CrossNode from 'models/frontend/CrossNode/CrossNode';
import { Allele, WildAllele } from 'models/frontend/Allele/Allele';
import { Gene } from 'models/frontend/Gene/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';

type SysGeneName = string;
type VariationName = string;

type GeneMap = Map<SysGeneName, Allele[]>;
type VariationMap = Map<VariationName, Allele[]>;

// Genetic identity formatted for display
export interface Genotype {
  genes: Map<Chromosome | undefined, GeneMap>;
  variations: Map<Chromosome | undefined, VariationMap>;
}

// Data format transformation to get hierarchical map: chromosome -> gene/variation -> alleles
export const getGenotype = (crossNode: CrossNode): Genotype => {
  const genotype: Genotype = {
    genes: new Map<Chromosome | undefined, GeneMap>(),
    variations: new Map<Chromosome | undefined, VariationMap>(),
  };

  const genes = crossNode.genes;
  const variations = crossNode.variations;
  fillWithChromosomes(genotype, genes, variations);

  const alleles = crossNode.strain.allelePairs;
  fillWithAlleles(genotype, alleles);
  fillWithWildAlleles(genotype);

  return genotype;
};

/**
 * Chromosomes implicitly specified in list of genes and list of alleles (collectively 'mutations').
 * These determine which fractions appear--not which are '+' or have allele names
 */
function fillWithChromosomes(
  genotype: Genotype,
  genes: Gene[],
  variations: VariationInfo[]
): void {
  for (const gene of genes) {
    if (!genotype.genes.has(gene.chromosome)) {
      genotype.genes.set(gene.chromosome, new Map<SysGeneName, Allele[]>());
    }
    const geneMap = genotype.genes.get(gene.chromosome);
    geneMap?.set(gene.sysName, []);
  }

  for (const variation of variations) {
    if (!genotype.variations.has(variation.chromosome)) {
      genotype.variations.set(
        variation.chromosome,
        new Map<VariationName, Allele[]>()
      );
      const variationMap = genotype.variations.get(variation.chromosome);
      variationMap?.set(variation.name, []);
    }
  }
}

/**
 * Populates genotype with alleles indexed by associated mutations in map.
 */
function fillWithAlleles(genotype: Genotype, allelesToAdd: Allele[]): void {
  allelesToAdd.forEach((allele) => {
    if (allele.gene !== undefined) {
      const gene: Gene = allele.gene;
      const geneMap =
        genotype.genes.get(gene.chromosome) ??
        recoverFromUnplannedChromosomeOfGene(genotype, gene, allele);
      const alleles: Allele[] = geneMap.get(gene.sysName) ?? [];
      alleles.push(allele);
    } else if (allele.variation !== undefined) {
      const variation: VariationInfo = allele.variation;
      const variations: VariationMap =
        genotype.variations.get(variation.chromosome) ??
        recoverFromUnplannedChromosomeOfVariation(genotype, variation, allele);
      const alleles: Allele[] = variations.get(variation.name) ?? [];
      alleles.push(allele);
    } else {
      recoverFromUnspecifiedMutation(genotype, allele);
    }
  });
}

/**
 * Fills any remaining gene sections with wild alleles
 */
const fillWithWildAlleles = (genotype: Genotype): void => {
  for (const geneMap of genotype.genes.values()) {
    for (const [, alleles] of geneMap.entries()) {
      while (alleles.length < 2) {
        alleles.push(new WildAllele());
      }
    }
  }

  for (const [chromosome, variationMap] of genotype.variations.entries()) {
    for (const [, alleles] of variationMap.entries()) {
      if (chromosome !== undefined && chromosome !== 'Ex') {
        while (alleles.length < 2) {
          alleles.push(new WildAllele());
        }
      } else {
        while (alleles.length < 1) {
          alleles.push(new WildAllele());
        }
      }
    }
  }
};

function recoverFromUnplannedChromosomeOfGene(
  genotype: Genotype,
  gene: Gene,
  allele: Allele
): GeneMap {
  console.error(
    `The allele "${allele.name}" exists on a chromosome or extrachromosomal array 
     not referenced in list of Genes to display.
     The chromosome "${gene.chromosome}" has been added for this node, 
     but it will not necessarily be displayed in other nodes.
     Remaining alleles may not show this error because the unplanned chromosome is being added.`
  );

  const geneMap = new Map<SysGeneName, Allele[]>();
  geneMap.set(gene.sysName, []);

  genotype.genes.set(gene.chromosome, geneMap);
  return geneMap;
}

function recoverFromUnplannedChromosomeOfVariation(
  genotype: Genotype,
  variation: VariationInfo,
  allele: Allele
): GeneMap {
  console.error(
    `The allele "${allele.name}" exists on a chromosome or extrachromosomal array 
     not referenced in list VariationInfos to display.
     The chromosome "${variation.chromosome}" has been added for this node, 
     but it will not necessarily be displayed in other nodes.
     Remaining alleles may not show this error because the unplanned chromosome is being added.`
  );

  const variationMap = new Map<VariationName, Allele[]>();
  variationMap.set(variation.name, []);

  genotype.variations.set(variation.chromosome, variationMap);
  return variationMap;
}

/**
 * If the allele doesn't have a mutation at all
 */
function recoverFromUnspecifiedMutation(
  genotype: Genotype,
  allele: Allele
): void {
  console.error(
    `The allele ${allele.name} has no associated gene or variation. 
     This violates a consistency expectation. A dummy variation on unknown chromosome
     is being assigned.`
  );

  const variation = new VariationInfo({
    name: `dummyVariation${allele.name}`,
    chromosome: undefined,
  });
  genotype.variations.get(variation.chromosome) ??
    recoverFromUnplannedChromosomeOfVariation(genotype, variation, allele);
  genotype.variations
    ?.get(variation.chromosome)
    ?.get(variation.name)
    ?.push(allele);
}
