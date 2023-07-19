import * as alleles from 'models/frontend/Allele/Allele.mock';
import { Strain, type StrainOption } from 'models/frontend/Strain/Strain';

export const emptyWild = new Strain({
  allelePairs: [],
});

export const wildManyPairs = new Strain({
  allelePairs: [
    alleles.hd43.toTopHet(),
    alleles.e138.toHomo(),
    alleles.e1282.toTopHet(),
  ],
});

export const ed3Het = new Strain({
  allelePairs: [alleles.ed3.toTopHet()],
});

export const ed3Homo = new Strain({
  allelePairs: [alleles.ed3.toHomo()],
});

export const e204Wild = new Strain({
  allelePairs: [alleles.e204.toWild().toHomo()],
});

export const e204Homo = new Strain({
  allelePairs: [alleles.e204.toHomo()],
});

export const e204Het = new Strain({
  allelePairs: [alleles.e204.toTopHet()],
});

export const ox802Homo = new Strain({
  allelePairs: [alleles.ox802.toHomo()],
});

export const e204HetOx802Het = new Strain({
  allelePairs: [alleles.e204.toTopHet(), alleles.ox802.toTopHet()],
});

export const e204HomoOx802Het = new Strain({
  allelePairs: [alleles.e204.toHomo(), alleles.ox802.toTopHet()],
});

export const e204HomoOx802Homo = new Strain({
  allelePairs: [alleles.e204.toHomo(), alleles.ox802.toHomo()],
});

export const n765Homo = new Strain({
  allelePairs: [alleles.n765.toHomo()],
});

export const N2: Strain = new Strain({
  name: 'N2',
  description: 'wild isolate',
  allelePairs: [],
});

export const EG6207: Strain = new Strain({
  name: 'EG6207',
  description: 'Reference: WBPaper00059962',
  allelePairs: [alleles.ed3.toHomo()],
});

export const MT2495: Strain = new Strain({
  name: 'MT2495',
  allelePairs: [alleles.n744.toHomo()],
});

export const CB128: Strain = new Strain({
  name: 'CB128',
  description: 'Small dpy.',
  allelePairs: [alleles.e128.toHomo()],
});

export const TN64: Strain = new Strain({
  name: 'TN64',
  description:
    'Temperature sensitive. Dpy when grown at 15C. DpyRoller when grown at 25C. Heterozygotes are Rollers at any temperature.',
  allelePairs: [alleles.cn64.toHomo()],
});

export const EG5071: Strain = new Strain({
  name: 'EG5071',
  description:
    'alleles.oxIs363 [unc-122p::GFP + unc-119(+)]. Wild type. Very dim GFP expression in the coelomycytes. Only visible on compound microscope. Plasmid pBN04 inserted by MosSCI into cxTi10882 site.',
  allelePairs: [alleles.ed3.toHomo(), alleles.oxIs363.toHomo()],
});

export const BT14: Strain = new Strain({
  name: 'BT14',
  description:
    'Heterozygotes are WT and segregate WT, Steriles (alleles.hd43 homozygotes) and Dpy Uncs.',
  allelePairs: [
    alleles.hd43.toTopHet(),
    alleles.e138.toHomo(),
    alleles.e1282.toTopHet(),
  ],
});

export const homozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo()],
    }),
    prob: 1.0,
  },
];

export const heterozygousCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toTopHet()],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toWild().toHomo()],
    }),
    prob: 0.25,
  },
];

export const homoWildCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toTopHet()],
    }),
    prob: 1.0,
  },
];

export const homoHetCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toTopHet(), alleles.ox802.toBotHet()],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ox802.toBotHet()],
    }),
    prob: 0.5,
  },
];

export const homoHetSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo(), alleles.ox802.toBotHet()],
    }),
    prob: 0.5,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo(), alleles.ox802.toHomo()],
    }),
    prob: 0.25,
  },
];

export const difChromSimpleSelfCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [alleles.ed3.toTopHet(), alleles.md299.toTopHet()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ed3.toHomo(), alleles.md299.toTopHet()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ed3.toTopHet(), alleles.md299.toHomo()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ed3.toTopHet()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.md299.toTopHet()],
    }),
    prob: 0.125,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ed3.toHomo(), alleles.md299.toHomo()],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ed3.toHomo()],
    }),
    prob: 0.0625,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.md299.toHomo()],
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
      allelePairs: [alleles.e204.toTopHet(), alleles.ox802.toBotHet()],
    }),
    prob: 0.440015805,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo()],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ox802.toHomo()],
    }),
    prob: 0.2200079025,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo(), alleles.ox802.toTopHet()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toTopHet()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toTopHet(), alleles.ox802.toHomo()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ox802.toTopHet()],
    }),
    prob: 0.029034195,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toTopHet(), alleles.ox802.toTopHet()],
    }),
    prob: 0.001915805,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo(), alleles.ox802.toHomo()],
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
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ed3.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.121376645,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.ed3.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ed3.toHomo(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ed3.toTopHet(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ed3.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ed3.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.0606883225,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.ed3.toHomo(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.ed3.toTopHet(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ed3.toHomo(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.ed3.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ed3.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.e204.toWild().toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ed3.toHomo(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ed3.toTopHet(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ed3.toTopHet(),
        alleles.e204.toWild().toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toTopHet(), alleles.e53.toHomo()],
    }),
    prob: 0.03034416125,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.ed3.toHomo(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.ed3.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ed3.toHomo(),
        alleles.e204.toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ed3.toHomo(),
        alleles.e204.toWild().toHomo(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toHomo(), alleles.e53.toHomo()],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.e204.toWild().toHomo(), alleles.e53.toHomo()],
    }),
    prob: 0.015172080625,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toHomo(),
        alleles.cn64.toTopHet(),
        alleles.ed3.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toHomo(),
        alleles.ed3.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.ed3.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.cn64.toBotHet(),
        alleles.ed3.toTopHet(),
        alleles.e204.toTopHet(),
        alleles.e53.toHomo(),
      ],
    }),
    prob: 0.001798355,
  },
];

export const intermediateCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ox11000.toTopHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ox11000.toTopHet(),

        alleles.e53.toBotHet(),
        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ox11000.toTopHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toTopHet(),
        alleles.ox11000.toTopHet(),
        alleles.e53.toBotHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ox11000.toTopHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ox11000.toTopHet(),
        alleles.e53.toBotHet(),

        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.ox11000.toTopHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
      ],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.ox11000.toTopHet(), alleles.e53.toBotHet()],
    }),
    prob: 0.123175,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),

        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),

        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),

        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),

        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.oxTi75.toTopHet(),

        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.cn64.toTopHet(),
        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.cn64.toTopHet(),
        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),

        alleles.ox802.toTopHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.cn64.toTopHet(),
        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),
        alleles.e204.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
  {
    strain: new Strain({
      allelePairs: [
        alleles.cn64.toTopHet(),
        alleles.ox11000.toBotHet(),
        alleles.e53.toBotHet(),
      ],
    }),
    prob: 0.001825,
  },
];

export const ecaCross: StrainOption[] = [
  {
    strain: new Strain({
      allelePairs: [alleles.oxEx219999.toTopHet(), alleles.oxEx2254.toTopHet()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.oxEx219999.toTopHet()],
    }),
    prob: 0.25,
  },
  {
    strain: new Strain({
      allelePairs: [alleles.oxEx2254.toTopHet()],
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
