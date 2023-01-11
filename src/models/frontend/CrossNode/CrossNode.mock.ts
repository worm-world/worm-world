import Strain from 'models/frontend/Strain';
import { Sex } from 'models/enums';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import * as mockGenes from 'models/frontend/Gene/Gene.mock';
import * as mockVariations from 'models/frontend/VariationInfo/VariationInfo.mock';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Allele } from '../Allele/Allele';

// Empty Cross Node ///////////////////////////////////////////////////////////

export const empty: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: { name: 'empty', notes: '', alleles: [] },
  genes: [],
  variations: [],
  isSelected: false,
  parents: [],
};

// Wild Cross Node ///////////////////////////////////////////////////////////

export const wild: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: { name: 'wild', notes: '', alleles: [] },
  genes: [
    mockGenes.chrom1Gene1,
    mockGenes.chrom2Gene1,
    mockGenes.chrom2Gene2,
    mockGenes.chrom3Gene1,
  ],
  variations: [mockVariations.chromEcaVariation1],
  isSelected: false,
  parents: [],
};

// Mutated Cross Node  //////////////////////////////////////////////////////////

const mutatedStrain: Strain = {
  name: 'mutated',
  alleles: [
    mockAlleles.chrom1Gene1Allele1,
    mockAlleles.chrom2Gene1Allele1,
    mockAlleles.chrom2Gene1Allele2,
    mockAlleles.chrom2Gene2Allele1,
    mockAlleles.chromXGene1Allele1,
    mockAlleles.chromEcaVariation1Allele1,
    mockAlleles.chromUnknownVariation1Allele1,
  ],
  notes: '',
};

export const mutated: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: mutatedStrain,
  genes: [
    mockGenes.chrom1Gene1,
    mockGenes.chrom2Gene1,
    mockGenes.chrom2Gene2,
    mockGenes.chrom3Gene1,
    mockGenes.chromXGene1,
  ],
  variations: [
    mockVariations.chromEcaVariation1,
    mockVariations.chromUnknownVariation1,
  ],
  isSelected: false,
  parents: [],
};

// Bad Mutation Lists  //////////////////////////////////////////////////////////

export const badMutationLists: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'referencingGene',
    alleles: [
      mockAlleles.chrom1Gene1Allele1,
      mockAlleles.chromEcaVariation1Allele1,
    ],
    notes: '',
  },
  // No mutations--genes or variations--below
  genes: [],
  variations: [],
  isSelected: false,
  parents: [],
};

// Cross Node Bad Allele //////////////////////////////////////////////////////////////////////////////////

export const badAllele: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'badStrain',
    alleles: [
      new Allele({
        name: 'badAllele',
        // The gene or variation (exactly one required) is missing--violated constraint
        // This also means chromosome hasn't been implicitly determined by field in mutation
      }),
    ],
    notes: '',
  },
  genes: [mockGenes.chrom1Gene1],
  variations: [],
  isSelected: false,
  parents: [],
};

// Cross Node Monoid (No Fraction) //////////////////////////////////////////////////////////////////////////////////

export const monoid: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'monoid',
    alleles: [
      mockAlleles.chromEcaVariation1Allele1, // one copy
    ],
    notes: '',
  },
  genes: [],
  variations: [mockVariations.chromEcaVariation1],
  isSelected: false,
  parents: [],
};

// Cross Node Diploid (Fraction) //////////////////////////////////////////////////////////////////////////////////

export const diploid: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: {
    name: 'diploid',
    alleles: [mockAlleles.chrom1Gene1Allele1],
    notes: '',
  },
  genes: [mockGenes.chrom1Gene1],
  variations: [],
  isSelected: false,
  parents: [],
};
