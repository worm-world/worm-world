import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Strain, type StrainOption } from 'models/frontend/Strain/Strain';

export const emptyWild = new Strain({
  allelePairs: [],
});

export const wildManyPairs = new Strain({
  allelePairs: [
    mockAlleles.hd43.toTopHet(),
    mockAlleles.e138.toHomo(),
    mockAlleles.e1282.toTopHet(),
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
  allelePairs: [mockAlleles.ed3.toHomo()],
});

export const MT2495: Strain = new Strain({
  name: 'MT2495',
  allelePairs: [mockAlleles.n744.toHomo()],
});

export const CB128: Strain = new Strain({
  name: 'CB128',
  description: 'Small dpy.',
  allelePairs: [mockAlleles.e128.toHomo()],
});

export const TN64: Strain = new Strain({
  name: 'TN64',
  description:
    'Temperature sensitive. Dpy when grown at 15C. DpyRoller when grown at 25C. Heterozygotes are Rollers at any temperature.',
  allelePairs: [mockAlleles.cn64.toHomo()],
});

export const EG5071: Strain = new Strain({
  name: 'EG5071',
  description:
    'mockAlleles.oxIs363 [unc-122p::GFP + unc-119(+)]. Wild type. Very dim GFP expression in the coelomycytes. Only visible on compound microscope. Plasmid pBN04 inserted by MosSCI into cxTi10882 site.',
  allelePairs: [mockAlleles.ed3.toHomo(), mockAlleles.oxIs363.toHomo()],
});

export const BT14: Strain = new Strain({
  name: 'BT14',
  description:
    'Heterozygotes are WT and segregate WT, Steriles (mockAlleles.hd43 homozygotes) and Dpy Uncs.',
  allelePairs: [
    mockAlleles.hd43.toTopHet(),
    mockAlleles.e138.toHomo(),
    mockAlleles.e1282.toTopHet(),
  ],
});

export const homozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo()],
    }),
    prob: 1.0,
  },
];

export const heterozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet()],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toWild().toHomo()],
    }),
    prob: 0.25,
  },
];

export const homoWildCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet()],
    }),
    prob: 1.0,
  },
];

export const homoHetCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet(), mockAlleles.ox802.toBotHet()],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ox802.toBotHet()],
    }),
    prob: 0.5,
  },
];

export const homoHetSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo(), mockAlleles.ox802.toBotHet()],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo(), mockAlleles.ox802.toHomo()],
    }),
    prob: 0.25,
  },
];

export const difChromSimpleSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ed3.toTopHet(), mockAlleles.md299.toTopHet()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ed3.toHomo(), mockAlleles.md299.toTopHet()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ed3.toTopHet(), mockAlleles.md299.toHomo()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ed3.toTopHet()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.md299.toTopHet()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ed3.toHomo(), mockAlleles.md299.toHomo()],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ed3.toHomo()],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.md299.toHomo()],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [],
    }),
    prob: 0.0625,
  },
];

export const intermediateSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet(), mockAlleles.ox802.toBotHet()],
    }),
    prob: 0.440015805,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo()],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ox802.toHomo()],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo(), mockAlleles.ox802.toTopHet()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet(), mockAlleles.ox802.toHomo()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ox802.toTopHet()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet(), mockAlleles.ox802.toTopHet()],
    }),
    prob: 0.001915805,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo(), mockAlleles.ox802.toHomo()],
    }),
    prob: 0.0009579025,
  },
  {
    strain: new Strain({
      allelePairs: [],
    }),
    prob: 0.0009579025,
  },
];

export const partialAdvancedSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.121376645,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ed3.toHomo(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.ed3.toHomo(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ed3.toHomo(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ed3.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.e204.toWild().toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toHomo(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toWild().toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toTopHet(), mockAlleles.e53.toHomo()],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.ed3.toHomo(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.ed3.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toHomo(),
        mockAlleles.e204.toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ed3.toHomo(),
        mockAlleles.e204.toWild().toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.e204.toHomo(), mockAlleles.e53.toHomo()],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.e204.toWild().toHomo(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toHomo(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toHomo(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.cn64.toBotHet(),
        mockAlleles.ed3.toTopHet(),
        mockAlleles.e204.toTopHet(),
        mockAlleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
];

export const intermediateCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toTopHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toTopHet(),

        mockAlleles.e53.toBotHet(),
        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toTopHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toTopHet(),
        mockAlleles.e53.toBotHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ox11000.toTopHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ox11000.toTopHet(),
        mockAlleles.e53.toBotHet(),

        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.ox11000.toTopHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.ox11000.toTopHet(), mockAlleles.e53.toBotHet()],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),

        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),

        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),

        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),

        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxTi75.toTopHet(),

        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),

        mockAlleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),
        mockAlleles.e204.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.cn64.toTopHet(),
        mockAlleles.ox11000.toBotHet(),
        mockAlleles.e53.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
];

export const ecaCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        mockAlleles.oxEx219999.toTopHet(),
        mockAlleles.oxEx2254.toTopHet(),
      ],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.oxEx219999.toTopHet()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [mockAlleles.oxEx2254.toTopHet()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [],
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
