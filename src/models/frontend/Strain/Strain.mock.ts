import { WildAllele, WILD_ALLELE } from 'models/frontend/Allele/Allele';
import { e204, ox802 } from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain, StrainOption } from 'models/frontend/Strain/Strain';

export const HomozygousCross: StrainOption[] = [
  {
    strain: new Strain({ allelePairs: [new AllelePair(e204, e204)] }),
    prob: 1.0,
  },
];

export const HeterozygousCross: StrainOption[] = [
  {
    strain: new Strain({ allelePairs: [new AllelePair(e204, e204)] }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [new AllelePair(e204, new WildAllele())],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [new AllelePair(new WildAllele(), new WildAllele())],
    }),
    prob: 0.25,
  },
];

export const HomoWildCross: StrainOption[] = [
  {
    strain: new Strain({ allelePairs: [new AllelePair(e204, WILD_ALLELE)] }),
    prob: 1.0,
  },
];

export const HomoHetCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, WILD_ALLELE),
        new AllelePair(WILD_ALLELE, ox802),
      ],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(WILD_ALLELE, WILD_ALLELE),
        new AllelePair(WILD_ALLELE, ox802),
      ],
    }),
    prob: 0.5,
  },
];

export const HomoHetSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, e204),
        new AllelePair(WILD_ALLELE, WILD_ALLELE),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, e204),
        new AllelePair(WILD_ALLELE, ox802),
      ],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [new AllelePair(e204, e204), new AllelePair(ox802, ox802)],
    }),
    prob: 0.25,
  },
];

export const SelfCross2: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, e204),
        new AllelePair(new WildAllele(), new WildAllele()),
      ],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, e204),
        new AllelePair(ox802, new WildAllele()),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(new WildAllele(), ox802),
      ],
    }),
    prob: 0.440015805,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(new WildAllele(), new WildAllele()),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [new AllelePair(e204, e204), new AllelePair(ox802, ox802)],
    }),
    prob: 0.0009579025,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(ox802, ox802),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(ox802, new WildAllele()),
      ],
    }),
    prob: 0.001915805,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), new WildAllele()),
        new AllelePair(ox802, ox802),
      ],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), new WildAllele()),
        new AllelePair(ox802, new WildAllele()),
      ],
    }),
    prob: 0.029034195,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), new WildAllele()),
        new AllelePair(new WildAllele(), new WildAllele()),
      ],
    }),
    prob: 0.0009579025,
  },
];
