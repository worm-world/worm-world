import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import {
  CrossNodeModel,
  type iCrossNodeModel,
} from 'models/frontend/CrossNode/CrossNode';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { Allele } from '../Allele/Allele';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { type MenuItem } from 'components/Menu/Menu';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';

export const getMenuItems = (node: iCrossNodeModel): MenuItem[] => {
  const canSelfCross = node.sex === Sex.Hermaphrodite;
  const selfOption: MenuItem = {
    icon: <SelfCrossIcon />,
    text: 'Self cross',
    menuCallback: () => {
      const strains = node.strain.selfCross();
      const strainOutput = strains
        .map(
          (strain, idx) =>
            `Strain: ${idx} -- Prob: ${
              strain.prob
            }\n${strain.strain.toString()}`
        )
        .join('\n\n');
      alert(strainOutput);
    },
  };
  const crossOption: MenuItem = {
    icon: <CrossIcon />,
    text: 'Cross',
    menuCallback: () => {
      alert('not yet implemented');
    },
  };
  const exportOption: MenuItem = {
    icon: <ScheduleIcon />,
    text: 'Schedule',
    menuCallback: () => {
      alert('not yet implemented');
    },
  };

  const items = [crossOption, exportOption];
  if (canSelfCross) items.unshift(selfOption);

  return items;
};

// Empty Cross Node ///////////////////////////////////////////////////////////

export const empty = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({ name: 'empty', allelePairs: [] }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const emptyMale = new CrossNodeModel({
  sex: Sex.Male,
  strain: new Strain({ name: 'empty', description: '', allelePairs: [] }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const wild = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'wild',
    description: '',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.oxTi302.getWildCopy(),
        bot: mockAlleles.oxTi302.getWildCopy(),
      }), // chrom i
      new AllelePair({
        top: mockAlleles.ed3.getWildCopy(),
        bot: mockAlleles.ed3.getWildCopy(),
      }), // chrom iii
      new AllelePair({
        top: mockAlleles.e1282.getWildCopy(),
        bot: mockAlleles.e1282.getWildCopy(),
      }), // chrom iv
      new AllelePair({
        top: mockAlleles.e53.getWildCopy(),
        bot: mockAlleles.e53.getWildCopy(),
      }), // chrom iv
      new AllelePair({
        top: mockAlleles.chromExVariation1Allele1.getWildCopy(),
        bot: mockAlleles.chromExVariation1Allele1.getWildCopy(),
        isECA: true,
      }), // eca
    ],
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

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
      top: mockAlleles.chromExVariation1Allele1,
      bot: mockAlleles.chromExVariation1Allele1,
      isECA: true,
    }),
    new AllelePair({
      top: mockAlleles.chromUnknownVariation1Allele1,
      bot: mockAlleles.chromUnknownVariation1Allele1,
    }),
  ],
  description: '',
});

export const mutated = new CrossNodeModel({
  sex: Sex.Male,
  strain: mutatedStrain,
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const smallMutated = new CrossNodeModel({
  sex: Sex.Hermaphrodite,

  strain: new Strain({
    name: 'strain1',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chrom1Gene2Allele1,
        bot: mockAlleles.chrom1Gene2Allele1,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const badMutationLists = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'referencingGene',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chrom1Gene1Allele1,
        bot: mockAlleles.chrom1Gene1Allele1,
      }),

      new AllelePair({
        top: mockAlleles.chromExVariation1Allele1,
        bot: mockAlleles.chromExVariation1Allele1,
        isECA: true,
      }),
    ],

    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const badAllele = new CrossNodeModel({
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
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const monoid = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'monoid',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chromExVariation1Allele1,
        bot: mockAlleles.chromExVariation1Allele1,
        isECA: true,
      }), // one copy
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const diploid = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'diploid',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.chrom1Gene1Allele1,
        bot: mockAlleles.chrom1Gene1Allele1,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const ed3HetMale = new CrossNodeModel({
  sex: Sex.Male,
  strain: new Strain({
    name: 'ed3Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ed3,
        bot: mockAlleles.ed3.getWildCopy(),
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const ed3HetHerm = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'ed3Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ed3,
        bot: mockAlleles.ed3.getWildCopy(),
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
});

export const ed3HomoHerm = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'ed3Hetero',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ed3,
        bot: mockAlleles.ed3,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const e204WildMale = new CrossNodeModel({
  sex: Sex.Male,
  strain: new Strain({
    name: 'e204Wild',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204.getWildCopy(),
        bot: mockAlleles.e204.getWildCopy(),
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const e204HomoHerm = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'e204Homo',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: mockAlleles.e204,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const e204HetMale = new CrossNodeModel({
  sex: Sex.Male,
  strain: new Strain({
    name: 'e204Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: mockAlleles.e204.getWildCopy(),
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const ox802HomoHerm = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'ox802Homo',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.ox802,
        bot: mockAlleles.ox802,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const e204HetOx802Het = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'e204HetOx802Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: mockAlleles.e204.getWildCopy(),
      }),
      new AllelePair({
        top: mockAlleles.ox802.getWildCopy(),
        bot: mockAlleles.ox802,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const e204HomoOx802HetHerm = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'e204HomoOx802Het',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.e204,
        bot: mockAlleles.e204,
      }),
      new AllelePair({
        top: mockAlleles.ox802.getWildCopy(),
        bot: mockAlleles.ox802,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const e204HomoOx802HomoHerm = new CrossNodeModel({
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
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const n765Homo = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'n765Homo',
    allelePairs: [
      new AllelePair({ top: mockAlleles.n765, bot: mockAlleles.n765 }),
    ],
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});

export const ecaCrossNode = new CrossNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    name: 'ecaCrossNode',
    allelePairs: [
      new AllelePair({
        top: mockAlleles.oxEx12345,
        bot: mockAlleles.oxEx12345.getWildCopy(),
        isECA: true,
      }),
      new AllelePair({
        top: mockAlleles.oxEx12345,
        bot: mockAlleles.oxEx12345.getWildCopy(),
        isECA: true,
      }),
      new AllelePair({
        top: mockAlleles.oxEx2254,
        bot: mockAlleles.oxEx2254.getWildCopy(),
        isECA: true,
      }),
    ],
    description: '',
  }),
  isParent: false,
  isChild: false,
  getMenuItems,
});
