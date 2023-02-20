import { WildAllele, WILD_ALLELE } from 'models/frontend/Allele/Allele';
import {
  cn64,
  e204,
  e53,
  ed3,
  md299,
  ox11000,
  ox802,
  oxTi75,
  oxEx2254,
  oxEx219999,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain, StrainOption } from 'models/frontend/Strain/Strain';

export const HomozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [new AllelePair({ top: e204, bot: e204 })],
    }),
    prob: 1.0,
  },
];

export const HeterozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [new AllelePair({ top: e204, bot: e204 })],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [new AllelePair({ top: e204, bot: WILD_ALLELE })],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
      ],
    }),
    prob: 0.25,
  },
];

export const HomoWildCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [new AllelePair({ top: e204, bot: WILD_ALLELE })],
    }),
    prob: 1.0,
  },
];

export const HomoHetCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: WILD_ALLELE }),
        new AllelePair({ top: WILD_ALLELE, bot: ox802 }),
      ],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: WILD_ALLELE, bot: ox802 }),
      ],
    }),
    prob: 0.5,
  },
];

export const HomoHetSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: WILD_ALLELE, bot: ox802 }),
      ],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: ox802, bot: ox802 }),
      ],
    }),
    prob: 0.25,
  },
];

export const DifChromSimpleSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: md299, bot: md299 }),
      ],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: md299, bot: WILD_ALLELE }),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({
          top: new WildAllele(md299),
          bot: new WildAllele(md299),
        }),
      ],
    }),
    prob: 0.0625,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: WILD_ALLELE }),
        new AllelePair({ top: md299, bot: md299 }),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: WILD_ALLELE }),
        new AllelePair({ top: md299, bot: WILD_ALLELE }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: WILD_ALLELE }),
        new AllelePair({
          top: new WildAllele(md299),
          bot: new WildAllele(md299),
        }),
      ],
    }),
    prob: 0.125,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: md299, bot: md299 }),
      ],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: md299, bot: WILD_ALLELE }),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({
          top: new WildAllele(md299),
          bot: new WildAllele(md299),
        }),
      ],
    }),
    prob: 0.0625,
  },
];

export const ItermediateSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: ox802, bot: WILD_ALLELE }),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: WILD_ALLELE }),
        new AllelePair({ top: WILD_ALLELE, bot: ox802 }),
      ],
    }),
    prob: 0.440015805,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: WILD_ALLELE }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: ox802, bot: ox802 }),
      ],
    }),
    prob: 0.0009579025,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: WILD_ALLELE }),
        new AllelePair({ top: ox802, bot: ox802 }),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: WILD_ALLELE }),
        new AllelePair({ top: ox802, bot: WILD_ALLELE }),
      ],
    }),
    prob: 0.001915805,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: ox802, bot: ox802 }),
      ],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: ox802, bot: WILD_ALLELE }),
      ],
    }),
    prob: 0.029034195,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.0009579025,
  },
];

export const PartialAdvancedSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.015172080625,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.000449375,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.000449375,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.000449375,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.000449375,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.121376645,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ed3, bot: new WildAllele(ed3) }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({ top: e204, bot: new WildAllele(e204) }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ed3), bot: new WildAllele(ed3) }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: cn64 }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.00044958875,
  },
];

export const IntermediateCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.123175,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75,
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75,
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75,
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75,
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.001825,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({
          top: new WildAllele(cn64),
          bot: new WildAllele(cn64),
        }),
        new AllelePair({ top: ox11000, bot: new WildAllele(ox11000) }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.123175,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({ top: new WildAllele(e204), bot: e204 }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxTi75),
          bot: new WildAllele(oxTi75),
        }),
        new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
        new AllelePair({ top: new WildAllele(ox11000), bot: ox11000 }),
        new AllelePair({ top: new WildAllele(e53), bot: e53 }),
        new AllelePair({
          top: new WildAllele(e204),
          bot: new WildAllele(e204),
        }),
        new AllelePair({
          top: new WildAllele(ox802),
          bot: new WildAllele(ox802),
        }),
      ],
    }),
    prob: 0.001825,
  },
];

export const EcaCross: StrainOption[] = [
  {
    // All three
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxEx2254,
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: oxEx2254,
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: oxEx219999,
          bot: new WildAllele(oxEx219999),
          isECA: true,
        }),
      ],
    }),
    prob: 0.125,
  },
  {
    // oxEx2254, oxEx219999
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxEx2254,
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: new WildAllele(oxEx2254),
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: oxEx219999,
          bot: new WildAllele(oxEx219999),
          isECA: true,
        }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      // Twice oxEx2254
      allelePairs: [
        new AllelePair({
          top: oxEx2254,
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: oxEx2254,
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: new WildAllele(oxEx219999),
          bot: new WildAllele(oxEx219999),
          isECA: true,
        }),
      ],
    }),
    prob: 0.125,
  },
  {
    // oxEx2254
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxEx2254,
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: new WildAllele(oxEx2254),
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: new WildAllele(oxEx219999),
          bot: new WildAllele(oxEx219999),
          isECA: true,
        }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      // oxEx219999
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxEx2254),
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: new WildAllele(oxEx2254),
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: oxEx219999,
          bot: new WildAllele(oxEx219999),
          isECA: true,
        }),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      // Wild
      allelePairs: [
        new AllelePair({
          top: new WildAllele(oxEx2254),
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: new WildAllele(oxEx2254),
          bot: new WildAllele(oxEx2254),
          isECA: true,
        }),
        new AllelePair({
          top: new WildAllele(oxEx219999),
          bot: new WildAllele(oxEx219999),
          isECA: true,
        }),
      ],
    }),
    prob: 0.125,
  },
];
