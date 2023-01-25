import { WildAllele } from 'models/frontend/Allele/Allele';
import { e204, ox802 } from 'models/frontend/Allele/Allele.mock';
import {
  AllelePair,
  Strain,
  StrainOption,
} from 'models/frontend/Strain/Strain';

export const HomozygousCross: StrainOption = {
  strain: new Strain({ allelePairs: [new AllelePair(e204, e204)] }),
  prob: 1.0,
};

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

export const SelfCross2: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [new AllelePair(e204, e204), new AllelePair(ox802, ox802)],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, e204),
        new AllelePair(ox802, new WildAllele()),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(ox802, ox802),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(ox802, new WildAllele()),
      ],
    }),
    prob: 0.03,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, e204),
        new AllelePair(new WildAllele(), ox802),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, e204),
        new AllelePair(new WildAllele(), new WildAllele()),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(new WildAllele(), ox802),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(e204, new WildAllele()),
        new AllelePair(new WildAllele(), new WildAllele()),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), e204),
        new AllelePair(ox802, ox802),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), e204),
        new AllelePair(ox802, new WildAllele()),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), new WildAllele()),
        new AllelePair(ox802, ox802),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), new WildAllele()),
        new AllelePair(ox802, new WildAllele()),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), e204),
        new AllelePair(new WildAllele(), ox802),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), e204),
        new AllelePair(new WildAllele(), new WildAllele()),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), new WildAllele()),
        new AllelePair(new WildAllele(), ox802),
      ],
    }),
    prob: 0.03,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair(new WildAllele(), new WildAllele()),
        new AllelePair(new WildAllele(), new WildAllele()),
      ],
    }),
    prob: 0.03,
  },
];
