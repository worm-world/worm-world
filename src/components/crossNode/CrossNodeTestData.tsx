import { Sex } from '../../models/enums';
import { Location } from '../../models/frontend/Gene';

// Genes that we want to know in all nodes of a crossTree 
export const oneGene = [
  {
    name: 'gene1',
    chromosome: 'I',
    physLoc: new Location(0),
    geneticLoc: new Location(0),
  },
];

export const twoGenes = [
  {
    name: 'gene1',
    chromosome: 'I',
    physLoc: new Location(0),
    geneticLoc: new Location(0),
  },
  {
    name: 'gene2',
    chromosome: 'II',
    physLoc: new Location(0),
    geneticLoc: new Location(0),
  },
];

export const threeGenes = [
  {
    name: 'gene1',
    chromosome: 'I',
    physLoc: new Location(0),
    geneticLoc: new Location(0),
  },
  {
    name: 'gene2',
    chromosome: 'II',
    physLoc: new Location(0),
    geneticLoc: new Location(0),
  },
  {
    name: 'gene3',
    chromosome: 'X',
    physLoc: new Location(0),
    geneticLoc: new Location(0),
  },
];

export const wildCrossNode = {
  sex: Sex.Male,
  strain: {
    name: 'strain1',
    alleles: [],
    notes: '',
  },
  isSelected: false,
  genes: oneGene,
};

export const crossNodeOnTwoGenes = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'strain1',
    alleles: [
      {
        name: 'alleleA',
        geneName: 'gene1',
        contents: 'contentsOfAlleleA',
      },
      {
        name: 'alleleB',
        geneName: 'gene1',
        contents: 'contentsOfAlleleB',
      },
      {
        name: 'alleleC',
        geneName: 'gene2',
        contents: 'contentsOfAlleleC',
      },
    ],
    notes: '',
  },
  isSelected: false,
  genes: twoGenes,
};

export const crossNodeOnThreeGenes = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'strain2',
    alleles: [
      {
        name: 'alleleD',
        geneName: 'gene1',
        contents: 'contentsOfAlleleD',
      },
      {
        name: 'alleleE',
        geneName: 'gene1',
        contents: 'contentsOfAlleleE',
      },
      {
        name: 'alleleF',
        geneName: 'gene2',
        contents: 'contentsOfAlleleF',
      },
      {
        name: 'alleleF',
        geneName: 'gene3',
        contents: 'contentsOfAlleleG',
      },
      {
        name: 'alleleH',
        geneName: 'gene3',
        contents: 'contentsOfAlleleH',
      },
    ],
    notes: '',
  },
  isSelected: false,
  genes: threeGenes,
};
