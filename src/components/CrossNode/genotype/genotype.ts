/**
 * Genotype is a transformed data format from the props of a CrossNode
 * that better models how genotypes are displayed hierarchically
 * (chromosome -> gene -> allele)
 */

import CrossNode from 'models/frontend/CrossNode/CrossNode';
import Mutation from 'models/frontend/Mutation';
import { Allele } from 'models/frontend/Allele/Allele';
import { Gene } from 'models/frontend/Gene/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';

export const WILD_ALLELE = new Allele({
  name: '+',
  // implied any mutation
});

// Genetic identity formatted for display
export type Genotype = Map<Chromosome | undefined, Mutations>;

// Alleles of Genes are paired, but "alleles of variations" are not
export type Mutations = Map<Mutation, Allele[]>;

// Data format transformation to get hierarchical map: chromosome -> gene/variation -> alleles
export const getGenotype = (crossNode: CrossNode): Genotype => {
  const genotype: Genotype = new Map<Chromosome | undefined, Mutations>();

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
    if (!genotype.has(mutation.chromosome)) {
      genotype.set(mutation.chromosome, new Map<Mutation, Allele[]>());
    }
    const mutations = genotype.get(mutation.chromosome);
    mutations?.set(mutation, []);
  }
}

/**
 * Populates genotype with alleles indexed by associated mutations in map.
 */
function fillWithAlleles(genotype: Genotype, allelesToAdd: Allele[]): void {
  allelesToAdd.forEach((allele) => {
    const mutation: Mutation =
      allele.gene ?? allele.variation ?? recoverFromUnspecifiedMutation(allele);

    const mutations =
      genotype.get(mutation.chromosome) ??
      recoverFromUnplannedChromosome(
        genotype,
        mutation.chromosome,
        allele,
        mutation
      );

    const alleles: Allele[] = mutations.get(mutation) ?? [];
    alleles.push(allele); // Guaranteed by recovery
  });
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

/**
 * If an allele has a mutation on a chromosome, but that chromosome was not included
 * in the list to display.
 */
function recoverFromUnplannedChromosome(
  genotype: Genotype,
  chromosome: Chromosome | undefined,
  allele: Allele,
  mutation: Mutation
): Mutations {
  console.error(
    `The allele "${allele.name}" exists on a chromosome or extrachromosomal array 
     not referenced in list of Genes or VariationInfos.
     The chromosome "${chromosome}" has been added for this node, 
     but it will not necessarily be displayed in other nodes.
     Remaining alleles may not show this error because the unplanned chromosome is being added.`
  );

  const mutations = new Map<Mutation, Allele[]>();
  mutations.set(mutation, []);
  genotype.set(chromosome, mutations);
  return mutations;
}

/**
 * If the allele doesn't have a mutation at all
 */
function recoverFromUnspecifiedMutation(allele: Allele): Mutation {
  console.error(
    `The allele ${allele.name} has no associated gene or variation. 
     This violates a consistency expectation. A dummy variation on undefined chromosome
     is being assigned.`
  );

  const mutation = new VariationInfo({
    name: `dummyVariation_${allele.name}`,
    chromosome: undefined,
    ploidy: 1,
  });
  allele.variation = mutation;
  return mutation;
}
