import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Allele, WILD_ALLELE, WildAllele } from '../Allele/Allele';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { getMenuItems } from 'components/CrossNodeMenu/CrossNodeMenu';

// Empty Cross Node ///////////////////////////////////////////////////////////

export const empty: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({ name: 'empty', allelePairs: [] }),
  isSelected: false,
  getMenuItems,
};

export const emptyMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: new Strain({ name: 'empty', notes: '', allelePairs: [] }),
  isSelected: false,
  getMenuItems,
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
  getMenuItems,
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
  getMenuItems,
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
  getMenuItems,
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
  getMenuItems,
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
  getMenuItems,
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
  getMenuItems,
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
  getMenuItems,
};

export const ed3HetMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: new Strain({
    name: 'ed3Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ed3,
        bot: WILD_ALLELE,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const ed3HetHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'ed3Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ed3,
        bot: WILD_ALLELE,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
};

export const ed3HomoHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'ed3Hetero',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ed3,
        bot: mockAlleles.ed3,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const e204WildMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: new Strain({
    name: 'e204Wild',
    allelePairs: [
      new AllelePair({
        top: new WildAllele(mockAlleles.e204),
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const e204HomoHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'e204Homo',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: mockAlleles.e204,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const e204HetMale: CrossNodeModel = {
  sex: Sex.Male,
  strain: new Strain({
    name: 'e204Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: WILD_ALLELE,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const ox802HomoHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'ox802Homo',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ox802,
        bot: mockAlleles.ox802,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const e204HetOx802Het: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'e204HetOx802Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: WILD_ALLELE,
      }),
      new AllelePair({
        top: WILD_ALLELE,
        bot: mockAlleles.ox802,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const e204HomoOx802HetHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'e204HomoOx802Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: mockAlleles.e204,
      }),
      new AllelePair({
        top: WILD_ALLELE,
        bot: mockAlleles.ox802,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};

export const e204HomoOx802HomoHerm: CrossNodeModel = {
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'e204HomoOx802Homo',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: mockAlleles.e204,
      }),
      new AllelePair({
        top: mockAlleles.ox802,
        bot: mockAlleles.ox802,
      }),
    ],
    notes: '',
  }),
  isSelected: false,
  getMenuItems,
};
