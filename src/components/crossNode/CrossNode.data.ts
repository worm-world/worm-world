import { Sex } from 'models/enums';
import { Gene, GeneLocation } from 'models/frontend/Gene';
import CrossNode from 'models/frontend/CrossNode';
import { Allele } from 'models/frontend/Allele';
import { VariationInfo } from 'models/frontend/VariationInfo';

// Genes
const gene1 = new Gene({
  name: 'gene1',
  chromosome: 'I',
  physLoc: new GeneLocation(0),
  geneticLoc: new GeneLocation(0),
});
const gene2a = new Gene({
  name: 'gene2a',
  chromosome: 'II',
  physLoc: new GeneLocation(0),
  geneticLoc: new GeneLocation(0),
});

const gene2b = new Gene({
  name: 'gene2b',
  chromosome: 'II',
  physLoc: new GeneLocation(0),
  geneticLoc: new GeneLocation(0),
});

const gene3 = new Gene({
  name: 'gene3',
  chromosome: 'III',
  physLoc: new GeneLocation(0),
  geneticLoc: new GeneLocation(0),
});

// Variations

const variation1 = new VariationInfo({
  name: 'gene3',
  physLoc: new GeneLocation(0),
  geneticLoc: new GeneLocation(0),
});

// CrossNodes
export const wildCrossNode: CrossNode = {
  sex: Sex.Male,
  strain: {
    name: 'wildStrain',
    alleles: [],
    notes: '',
  },
  isSelected: false,
  genes: [gene1],
  parents: [],
  variations: [],
};

export const crossNode1: CrossNode = {
  sex: Sex.Female,
  strain: {
    name: 'strain1',
    alleles: [
      new Allele({
        name: 'gene1_allele1',
        gene: gene1,
      }),
      new Allele({
        name: 'variation1_allele1',
        variationInfo: variation1,
      }),
    ],
    notes: '',
  },
  isSelected: false,
  genes: [gene1],
  variations: [variation1],
  parents: [],
};

export const crossNode2: CrossNode = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'strain2',
    alleles: [
      new Allele({
        name: 'gene1_allele1',
        gene: gene1,
      }),
      new Allele({
        name: 'gene1_allele2',
        gene: gene1,
      }),
      new Allele({
        name: 'gene2a_allele1',
        gene: gene2a,
      }),
      new Allele({
        name: 'gene2b_allele1',
        gene: gene2b,
      }),
      new Allele({
        name: 'gene2b_allele2',
        gene: gene2b,
      }),
      new Allele({
        name: 'gene3_allele1',
        gene: gene3,
      }),
    ],
    notes: '',
  },
  isSelected: false,
  genes: [gene1, gene2a, gene2b, gene3],
  parents: [],
  variations: [],
};

export const crossNode3: CrossNode = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'strain3',
    alleles: [
      new Allele({
        name: 'gene1_allele1',
        gene: gene1,
      }),
    ],
    notes: '',
  },
  isSelected: false,
  genes: [gene1],
  parents: [],
  variations: [],
};
