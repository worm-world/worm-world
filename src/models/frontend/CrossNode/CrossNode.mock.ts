import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Allele, WildAllele } from '../Allele/Allele';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Gene } from 'models/frontend/Gene/Gene';

export const ed3HeteroMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: { name: '', notes: '', alleles: [mockAlleles.ed3] },
  genes: [new Gene({ sysName: 'M142.1', chromosome: 'III' })],
  variations: [],
  isSelected: false,
};

export const ed3HeteroHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: { name: '', notes: '', alleles: [mockAlleles.ed3] },
  genes: [new Gene({ sysName: 'M142.1', chromosome: 'III' })],
  variations: [],
  isSelected: false,
};

export const ed3HomoHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: { name: '', notes: '', alleles: [mockAlleles.ed3, mockAlleles.ed3] },
  genes: [new Gene({ sysName: 'M142.1', chromosome: 'III' })],
  variations: [],
  isSelected: false,
};

export const empty: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({ name: 'empty', allelePairs: [] }),
  isSelected: false,
};

export const emptyMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: new Strain({ name: 'empty', notes: '', allelePairs: [] }),
  isSelected: false,
};

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
};

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
};

export const smallMutated: CrossNodeModel = {
  sex: Sex.Hermaphrodite,

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
};

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
};

export const monoid: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'monoid',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chromEcaVariation1Allele1,
        isECA: true,
      }), // one copy
    ],
    notes: '',
  }),
  isSelected: false,
};

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
};
