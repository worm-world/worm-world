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
  n744,
  e128,
  oxIs363,
  hd43,
  e138,
  e1282,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain, type StrainOption } from 'models/frontend/Strain/Strain';

export const N2: Strain = new Strain({
  name: 'N2',
  description: 'wild isolate',
  allelePairs: [],
});

export const EG6207: Strain = new Strain({
  name: 'EG6207',
  description: 'Reference: WBPaper00059962',
  allelePairs: [ed3.toHomoPair()],
});

export const MT2495: Strain = new Strain({
  name: 'MT2495',
  allelePairs: [n744.toHomoPair()],
});

export const CB128: Strain = new Strain({
  name: 'CB128',
  description: 'Small dpy.',
  allelePairs: [e128.toHomoPair()],
});

export const TN64: Strain = new Strain({
  name: 'TN64',
  description:
    'Temperature sensitive. Dpy when grown at 15C. DpyRoller when grown at 25C. Heterozygotes are Rollers at any temperature.',
  allelePairs: [cn64.toHomoPair()],
});

export const EG5071: Strain = new Strain({
  name: 'EG5071',
  description:
    'oxIs363 [unc-122p::GFP + unc-119(+)]. Wild type. Very dim GFP expression in the coelomycytes. Only visible on compound microscope. Plasmid pBN04 inserted by MosSCI into cxTi10882 site.',
  allelePairs: [ed3.toHomoPair(), oxIs363.toHomoPair()],
});

export const BT14: Strain = new Strain({
  name: 'BT14',
  description:
    'Heterozygotes are WT and segregate WT, Steriles (hd43 homozygotes) and Dpy Uncs.',
  allelePairs: [hd43.toHetPair(), e138.toHomoPair(), e1282.toHetPair()],
});

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
      allelePairs: [new AllelePair({ top: e204, bot: e204.getWildCopy() })],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
      ],
    }),
    prob: 0.25,
  },
];

export const HomoWildCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [new AllelePair({ top: e204, bot: e204.getWildCopy() })],
    }),
    prob: 1.0,
  },
];

export const HomoHetCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: ox802.getWildCopy(), bot: ox802 }),
      ],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: ox802.getWildCopy(), bot: ox802 }),
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
        new AllelePair({ top: ox802.getWildCopy(), bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: ox802.getWildCopy(), bot: ox802 }),
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
        new AllelePair({ top: md299, bot: md299.getWildCopy() }),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({
          top: md299.getWildCopy(),
          bot: md299.getWildCopy(),
        }),
      ],
    }),
    prob: 0.0625,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({ top: md299, bot: md299 }),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({ top: md299, bot: md299.getWildCopy() }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({
          top: md299.getWildCopy(),
          bot: md299.getWildCopy(),
        }),
      ],
    }),
    prob: 0.125,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({ top: md299, bot: md299 }),
      ],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({ top: md299, bot: md299.getWildCopy() }),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({
          top: md299.getWildCopy(),
          bot: md299.getWildCopy(),
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
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
        }),
      ],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: ox802.getWildCopy(), bot: ox802 }),
      ],
    }),
    prob: 0.440015805,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
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
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: ox802, bot: ox802 }),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.001915805,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
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
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.029034195,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
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
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
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
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
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
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
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
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
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
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
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
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
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
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
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
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
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
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
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
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
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
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
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
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
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
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
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
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75 }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.000449375,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
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
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.121376645,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3.getWildCopy() }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204 }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({ top: e204, bot: e204.getWildCopy() }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ed3.getWildCopy(), bot: ed3.getWildCopy() }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: e53, bot: e53 }),
      ],
    }),
    prob: 0.03034416125,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
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
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
        }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({ top: oxTi75, bot: oxTi75.getWildCopy() }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
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
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75,
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75,
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
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
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
        }),
      ],
    }),
    prob: 0.001825,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
        }),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({
          top: cn64.getWildCopy(),
          bot: cn64.getWildCopy(),
        }),
        new AllelePair({ top: ox11000, bot: ox11000.getWildCopy() }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
        }),
      ],
    }),
    prob: 0.123175,
  },

  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({ top: ox802, bot: ox802.getWildCopy() }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
        }),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxTi75.getWildCopy(),
          bot: oxTi75.getWildCopy(),
        }),
        new AllelePair({ top: cn64, bot: cn64.getWildCopy() }),
        new AllelePair({ top: ox11000.getWildCopy(), bot: ox11000 }),
        new AllelePair({ top: e53.getWildCopy(), bot: e53 }),
        new AllelePair({
          top: e204.getWildCopy(),
          bot: e204.getWildCopy(),
        }),
        new AllelePair({
          top: ox802.getWildCopy(),
          bot: ox802.getWildCopy(),
        }),
      ],
    }),
    prob: 0.001825,
  },
];

export const EcaCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxEx2254,
          bot: oxEx2254.getWildCopy(),
          isEca: true,
        }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxEx219999,
          bot: oxEx219999.getWildCopy(),
          isEca: true,
        }),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        new AllelePair({
          top: oxEx219999,
          bot: oxEx219999.getWildCopy(),
          isEca: true,
        }),
        new AllelePair({
          top: oxEx2254,
          bot: oxEx2254.getWildCopy(),
          isEca: true,
        }),
      ],
    }),
    prob: 0.25,
  },
];

export const WildToWildCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [],
    }),
    prob: 1.0,
  },
];
