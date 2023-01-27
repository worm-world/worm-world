import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Allele, WildAllele } from '../Allele/Allele';
import { AllelePair } from 'models/frontend/Strain/AllelePair';

// Empty Cross Node ///////////////////////////////////////////////////////////

export const empty: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({ name: 'empty', allelePairs: [] }),
  isSelected: false,
  parents: [],
};

export const emptyMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: new Strain({ name: 'empty', notes: '', allelePairs: [] }),
  isSelected: false,
  parents: [],
};

// Wild Cross Node ///////////////////////////////////////////////////////////

export const wild: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'wild',
    notes: '',
    allelePairs: [
      new AllelePair({ top: new WildAllele(mockAlleles.oxTi302) }), // chrom i
      new AllelePair({ top: new WildAllele(mockAlleles.ed3) }), // chrom iii
      new AllelePair({ top: new WildAllele(mockAlleles.e1282) }), // chrom iv
      new AllelePair({ top: new WildAllele(mockAlleles.e53) }), // chrom iv
      new AllelePair({
        top: new WildAllele(mockAlleles.chromEcaVariation1Allele1),
        isECA: true,
      }), // eca
    ],
  }),
  isSelected: false,
  parents: [],
};

// Mutated Cross Node  //////////////////////////////////////////////////////////

const mutatedStrain: Strain = new Strain({
  name: 'mutated',
  allelePairs: [
    new AllelePair({
      top: mockAlleles.chrom1Gene1Allele1,
      bot: mockAlleles.chrom1Gene1Allele1,
    }),
    new AllelePair({
      top: mockAlleles.chrom2Gene1Allele1,
      bot: mockAlleles.chrom2Gene1Allele1,
    }),
    new AllelePair({
      top: mockAlleles.chrom2Gene1Allele2,
      bot: mockAlleles.chrom2Gene1Allele2,
    }),
    new AllelePair({
      top: mockAlleles.chrom2Gene2Allele1,
      bot: mockAlleles.chrom2Gene2Allele1,
    }),
    new AllelePair({
      top: mockAlleles.chromXGene1Allele1,
      bot: mockAlleles.chromXGene1Allele1,
    }),
    new AllelePair({
      top: mockAlleles.chromEcaVariation1Allele1,
      bot: mockAlleles.chromEcaVariation1Allele1,
    }),
    new AllelePair({
      top: mockAlleles.chromUnknownVariation1Allele1,
      bot: mockAlleles.chromUnknownVariation1Allele1,
    }),
  ],
  notes: '',
});

export const mutated: CrossNodeModel = {
  sex: Sex.Male,
  strain: mutatedStrain,
  isSelected: false,
  parents: [],
};

// Small mutated cross node //////////////////////////////////
export const smallMutated: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  parents: [],
  isSelected: false,
  strain: new Strain({
    name: 'strain1',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chrom1Gene2Allele1,
        bot: mockAlleles.chrom1Gene2Allele1,
      }),
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
      new AllelePair({
        top: mockAlleles.chrom1Gene1Allele1,
        bot: mockAlleles.chrom1Gene1Allele1,
      }),

      new AllelePair({
        top: mockAlleles.chromEcaVariation1Allele1,
        bot: mockAlleles.chromEcaVariation1Allele1,
      }),
    ],
    notes: '',
  }),
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
      new AllelePair({
        top: new Allele({
          name: 'badAllele',
        }),
        bot: new Allele({
          name: 'badAllele',
        }),
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  parents: [],
};

// Cross Node Monoid (No Fraction) //////////////////////////////////////////////////////////////////////////////////

export const monoid: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'monoid',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chromEcaVariation1Allele1,
        isECA: true,
      }), // one co}py
    ],
    notes: '',
  }),
  isSelected: false,
  parents: [],
};

// Cross Node Diploid (Fraction) //////////////////////////////////////////////////////////////////////////////////

export const diploid: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'diploid',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chrom1Gene1Allele1,
        bot: mockAlleles.chrom1Gene1Allele1,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  parents: [],
};
