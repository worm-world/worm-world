import { WildAllele, WILD_ALLELE } from 'models/frontend/Allele/Allele';
import { e204, ed3, md299, ox802 } from 'models/frontend/Allele/Allele.mock';
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

export const SelfCross2: StrainOption[] = [
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
