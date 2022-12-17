/**
 * Genotype is a transformed data format from the props of a CrossNode
 * that better models how genotypes are displayed hierarchically
 * (chromosome -> gene -> allele)
 */

import CrossNode from 'models/frontend/CrossNode/CrossNode';
import { Allele } from 'models/frontend/Allele/Allele';
import { Gene } from 'models/frontend/Gene/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import Mutation, { Chromosome, UNKNOWN_CHROM } from 'models/frontend/Mutation';

export const WILD_ALLELE = new Allele({
  name: '+',
});

// Genetic identity formatted for display
export type Genotype = Map<Chromosome, Mutations>;

// Alleles of Genes are paired, but "alleles of variations" are not
export type Mutations = Map<Mutation, Allele[]>;

// Data format transformation to get hierarchical map: chromosome -> gene/variation -> alleles
const getGenotype = (crossNode: CrossNode): Genotype => {
  const genotype: Genotype = new Map<Chromosome, Mutations>();

  const genes = crossNode.genes;
  const variations = crossNode.variations;
  fillWithChromosomes(genotype, genes, variations);

  const alleles = crossNode.strain.alleles;
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
  const loci = (genes as Mutation[]).concat(variations as Mutation[]);
  for (const mutation of loci) {
    const chromosome = mutation.chromosome ?? UNKNOWN_CHROM;
    if (!genotype.has(chromosome)) {
      genotype.set(chromosome, new Map<Mutation, Allele[]>());
    }

    // Guaranteed to have chromosome by above
    const mutations = genotype.get(chromosome);
    (mutations as Mutations).set(mutation, []);
  }
}

/**
 * Populates genotype with alleles indexed by associated mutations in map.
 */
function fillWithAlleles(genotype: Genotype, alleles: Allele[]): void {
  for (const allele of alleles) {
    let mutation = (allele.gene ?? allele.variation) as Mutation;
    if (mutation === undefined) {
      mutation = recoverFromUnspecifiedMutation(allele);
    }

    const chromosome = mutation.chromosome ?? UNKNOWN_CHROM;
    let mutations = genotype.get(chromosome);
    if (mutations === undefined) {
      mutations = recoverFromUnplannedChromosome(genotype, chromosome, allele);
    }

    const alleles = mutations.get(mutation);
    (alleles as Allele[]).push(allele); // Guaranteed by recovery
  }
}

/**
 * Fills any remaining gene sections with wild alleles
 */
const fillWithWildAlleles = (genotype: Genotype): void => {
  for (const mutations of genotype.values()) {
    for (const [mutation, alleles] of mutations.entries()) {
      while (alleles.length < mutation.ploidy) {
        alleles.push(WILD_ALLELE);
      }
    }
  }
};

function recoverFromUnplannedChromosome(
  genotype: Genotype,
  chromosome: Chromosome,
  allele: Allele
): Mutations {
  console.error(
    `The allele ${allele.name} exists on a chromosome or extrachromosomal array 
     not referenced in list of Genes or VariationInfos.
     A chromosome has been added for this node, 
     but it will not necessarily be displayed in other nodes.
     Future alleles may not show this error because the unplanned chromosome is being added`
  );

  const mutations = new Map<Mutation, Allele[]>();
  genotype.set(chromosome, mutations);
  return mutations;
}

function recoverFromUnspecifiedMutation(allele: Allele): Mutation {
  console.error(
    `The allele ${allele.name} has no associated gene or variation. 
     This violates a consistency expectation. A dummy variation is being assigned`
  );

  // Arbitrarily choose variation info for allele's mutation (instead of gene)
  const mutation = new VariationInfo({
    name: `dummy_variation_${allele.name}`,
    chromosome: UNKNOWN_CHROM,
    ploidy: 1,
  });
  allele.variation = mutation;
  return mutation;
}

export default getGenotype;
