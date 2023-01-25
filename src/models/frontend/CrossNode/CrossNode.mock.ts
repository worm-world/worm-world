import { AllelePair, Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import * as mockGenes from 'models/frontend/Gene/Gene.mock';
import * as mockVariations from 'models/frontend/VariationInfo/VariationInfo.mock';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Allele } from '../Allele/Allele';
import { chrom1Gene1 } from 'models/frontend/Gene/Gene.mock';

// Empty Cross Node ///////////////////////////////////////////////////////////

export const empty: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({ name: 'empty', allelePairs: [] }),
  genes: [],
  variations: [],
  isSelected: false,
  parents: [],
};

export const emptyMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: new Strain({ name: 'empty', notes: '', allelePairs: [] }),
  genes: [],
  variations: [],
  isSelected: false,
  parents: [],
};

// Wild Cross Node ///////////////////////////////////////////////////////////

export const wild: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({ name: 'wild', notes: '', allelePairs: [] }),
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

const mutatedStrain: Strain = new Strain({
  name: 'mutated',
  allelePairs: [
    new AllelePair(
      mockAlleles.chrom1Gene1Allele1,
      mockAlleles.chrom1Gene1Allele1
    ),
    new AllelePair(
      mockAlleles.chrom2Gene1Allele1,
      mockAlleles.chrom2Gene1Allele1
    ),
    new AllelePair(
      mockAlleles.chrom2Gene1Allele2,
      mockAlleles.chrom2Gene1Allele2
    ),
    new AllelePair(
      mockAlleles.chrom2Gene2Allele1,
      mockAlleles.chrom2Gene2Allele1
    ),
    new AllelePair(
      mockAlleles.chromXGene1Allele1,
      mockAlleles.chromXGene1Allele1
    ),
    new AllelePair(
      mockAlleles.chromEcaVariation1Allele1,
      mockAlleles.chromEcaVariation1Allele1
    ),
    new AllelePair(
      mockAlleles.chromUnknownVariation1Allele1,
      mockAlleles.chromUnknownVariation1Allele1
    ),
  ],
  notes: '',
});

export const mutated: CrossNodeModel = {
  sex: Sex.Male,
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
    mockVariations.chrom1Variation1,
  ],
  isSelected: false,
  parents: [],
};

// Small mutated cross node //////////////////////////////////
export const smallMutated: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  parents: [],
  isSelected: false,
  genes: [chrom1Gene1],
  variations: [],
  strain: new Strain({
    name: 'strain1',
    allelePairs: [
      new AllelePair(
        mockAlleles.chrom1Gene2Allele1,
        mockAlleles.chrom1Gene2Allele1
      ),
    ],
    notes: '',
  }),
};

// Bad Mutation Lists  //////////////////////////////////////////////////////////

export const badMutationLists: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'referencingGene',
    allelePairs: [
      new AllelePair(
        mockAlleles.chrom1Gene1Allele1,
        mockAlleles.chrom1Gene1Allele1
      ),

      new AllelePair(
        mockAlleles.chromEcaVariation1Allele1,
        mockAlleles.chromEcaVariation1Allele1
      ),
    ],
    notes: '',
  }),
  // No mutations--genes or variations--below
  genes: [],
  variations: [],
  isSelected: false,
  parents: [],
};

// Cross Node Bad Allele //////////////////////////////////////////////////////////////////////////////////

export const badAllele: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'badStrain',
    allelePairs: [
      // The gene or variation (exactly one required) is missing--violated constraint
      // This also means chromosome hasn't been implicitly determined by field in mutation
      new AllelePair(
        new Allele({
          name: 'badAllele',
        }),
        new Allele({
          name: 'badAllele',
        })
      ),
    ],
    notes: '',
  }),
  genes: [mockGenes.chrom1Gene1],
  variations: [],
  isSelected: false,
  parents: [],
};

// Cross Node Monoid (No Fraction) //////////////////////////////////////////////////////////////////////////////////

export const monoid: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'monoid',
    allelePairs: [
      new AllelePair(
        mockAlleles.chromEcaVariation1Allele1,
        mockAlleles.chromEcaVariation1Allele1
      ), // one copy
    ],
    notes: '',
  }),
  genes: [],
  variations: [mockVariations.chromEcaVariation1],
  isSelected: false,
  parents: [],
};

// Cross Node Diploid (Fraction) //////////////////////////////////////////////////////////////////////////////////

export const diploid: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'diploid',
    allelePairs: [
      new AllelePair(
        mockAlleles.chrom1Gene1Allele1,
        mockAlleles.chrom1Gene1Allele1
      ),
    ],
    notes: '',
  }),
  genes: [mockGenes.chrom1Gene1],
  variations: [],
  isSelected: false,
  parents: [],
};
