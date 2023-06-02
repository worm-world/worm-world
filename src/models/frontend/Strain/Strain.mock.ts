import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Strain, type StrainOption } from 'models/frontend/Strain/Strain';

export const wild = new Strain({
  allelePairs: [],
});

export const wildManyPairs = new Strain({
  allelePairs: [
    mockAlleles.oxTi302.getWild().toHomoPair(), // chrom i
    mockAlleles.ed3.getWild().toHomoPair(), // chrom iii
    mockAlleles.e1282.getWild().toHomoPair(), // chrom iv
    mockAlleles.e53.getWild().toHomoPair(), // chrom iv
    mockAlleles.chromExVariation1Allele1.getWild().toEcaPair(), // eca
  ],
});

export const N2: Strain = new Strain({
  name: 'N2',
  description: 'wild isolate',
  allelePairs: [],
});

export const EG6207: Strain = new Strain({
  name: 'EG6207',
  description: 'Reference: WBPaper00059962',
  allelePairs: [mockAlleles.ed3.toHomoPair()],
});

export const MT2495: Strain = new Strain({
  name: 'MT2495',
  allelePairs: [mockAlleles.n744.toHomoPair()],
});

export const CB128: Strain = new Strain({
  name: 'CB128',
  description: 'Small dpy.',
  allelePairs: [mockAlleles.e128.toHomoPair()],
});

export const TN64: Strain = new Strain({
  name: 'TN64',
  description:
    'Temperature sensitive. Dpy when grown at 15C. DpyRoller when grown at 25C. Heterozygotes are Rollers at any temperature.',
  allelePairs: [mockAlleles.cn64.toHomoPair()],
});

export const EG5071: Strain = new Strain({
  name: 'EG5071',
  description:
    'mockAlleles.oxIs363 [unc-122p::GFP + unc-119(+)]. Wild type. Very dim GFP expression in the coelomycytes. Only visible on compound microscope. Plasmid pBN04 inserted by MosSCI into cxTi10882 site.',
  allelePairs: [mockAlleles.ed3.toHomoPair(), mockAlleles.oxIs363.toHomoPair()],
});

export const BT14: Strain = new Strain({
  name: 'BT14',
  description:
    'Heterozygotes are WT and segregate WT, Steriles (mockAlleles.hd43 homozygotes) and Dpy Uncs.',
  allelePairs: [
    mockAlleles.hd43.toTopHetPair(),
    mockAlleles.e138.toHomoPair(),
    mockAlleles.e1282.toTopHetPair(),
  ],
});

export const homozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomoPair()],
    }),
    prob: 1.0,
  },
];

export const heterozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomoPair()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHetPair()],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.getWild().toHomoPair()],
    }),
    prob: 0.25,
  },
];

export const homoWildCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHetPair()],
    }),
    prob: 1.0,
  },
];

export const homoHetCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.ox802.toBotHetPair(),
      ],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.toBotHetPair(),
      ],
    }),
    prob: 0.5,
  },
];

export const homoHetSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toHomoPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toHomoPair(),
        mockAlleles.ox802.toBotHetPair(),
      ],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toHomoPair(),
        mockAlleles.ox802.toHomoPair(),
      ],
    }),
    prob: 0.25,
  },
];

export const difChromSimpleSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.md299.toHomoPair(),
      ],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.md299.toTopHetPair(),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.md299.getWild().toHomoPair(),
      ],
    }),
    prob: 0.0625,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.md299.toHomoPair(),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.md299.toTopHetPair(),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.md299.getWild().toHomoPair(),
      ],
    }),
    prob: 0.125,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.md299.toHomoPair(),
      ],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.md299.toTopHetPair(),
      ],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.md299.getWild().toHomoPair(),
      ],
    }),
    prob: 0.0625,
  },
];

export const intermediateSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toHomoPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toHomoPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.ox802.toBotHetPair(),
      ],
    }),
    prob: 0.440015805,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toHomoPair(),
        mockAlleles.ox802.toHomoPair(),
      ],
    }),
    prob: 0.0009579025,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.ox802.toHomoPair(),
      ],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.001915805,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.toHomoPair(),
      ],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.029034195,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.0009579025,
  },
];

export const partialAdvancedSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.015172080625,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.000449375,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.000449375,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.000449375,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.00089875,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.000449375,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.121376645,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.toTopHetPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ed3.getWild().toHomoPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.03034416125,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toHomoPair(),
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.e204.toHomoPair(),
        mockAlleles.e53.toHomoPair(),
      ],
    }),
    prob: 0.00044958875,
  },
];

export const intermediateCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.123175,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHetPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.001825,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.getWild().toHomoPair(),
        mockAlleles.ox11000.toTopHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.123175,
  },

  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.toTopHetPair(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.toBotHetPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.getWild().toHomoPair(),
        mockAlleles.cn64.toTopHetPair(),
        mockAlleles.ox11000.toBotHetPair(),
        mockAlleles.e53.toBotHetPair(),
        mockAlleles.e204.getWild().toHomoPair(),
        mockAlleles.ox802.getWild().toHomoPair(),
      ],
    }),
    prob: 0.001825,
  },
];

export const ecaCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.oxEx2254.toEcaPair()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.oxEx219999.toEcaPair()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxEx219999.toEcaPair(),
        mockAlleles.oxEx2254.toEcaPair(),
      ],
    }),
    prob: 0.25,
  },
];

export const wildToWildCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [],
    }),
    prob: 1.0,
  },
];
