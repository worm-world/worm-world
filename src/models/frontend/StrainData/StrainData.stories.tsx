import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import {
  StrainData,
  type IStrainData,
} from 'models/frontend/StrainData/StrainData';
import * as mockStrains from 'models/frontend/Strain/Strain.mock';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import { type MenuItem } from 'components/Menu/Menu';

export const maleWild = mockStrains.emptyWild.toMale().toData();
export const hermWild = mockStrains.emptyWild.toData();
export const maleWildManyPairs = mockStrains.wildManyPairs.toMale().toData();
export const maleN2 = mockStrains.N2.toMale().toData();
export const maleMT2495 = mockStrains.MT2495.toMale().toData();
export const maleBT14 = mockStrains.BT14.toMale().toData();

export const getMenuItems = (data: IStrainData): MenuItem[] => {
  const canSelfCross = data.strain.sex === Sex.Hermaphrodite;
  const selfOption: MenuItem = {
    icon: <SelfCrossIcon />,
    text: 'Self-cross',
    menuCallback: () => {
      data.strain
        .selfCross()
        .then((strains) => {
          const strainOutput = strains
            .map(
              (strain, idx) =>
                `Strain: ${idx} -- Prob: ${strain.prob}\n${strain.strain.genotype}`
            )
            .join('\n\n');
          alert(strainOutput);
        })
        .catch(console.error);
    },
  };

  const crossOption: MenuItem = {
    icon: <CrossIcon />,
    text: 'Cross',
    menuCallback: () => {},
  };

  const exportOption: MenuItem = {
    icon: <ScheduleIcon />,
    text: 'Schedule',
    menuCallback: () => {},
  };

  const items = [crossOption, exportOption];
  if (canSelfCross) items.unshift(selfOption);

  return items;
};

export const maleManyPairs = new StrainData({
  strain: new Strain({
    allelePairs: [
      mockAlleles.chrom1Gene1Allele1.toHomo(),
      mockAlleles.chrom2Gene1Allele1.toHomo(),
      mockAlleles.chrom2Gene2Allele1.toHomo(),
      mockAlleles.chromXGene1Allele1.toHomo(),
      mockAlleles.chromExVariation1Allele1.toTopHet(),
    ],
    sex: Sex.Male
  }),
});

export const ed3HetMale = new StrainData({
  strain: new Strain({
    allelePairs: [mockAlleles.ed3.toTopHet()],
    sex: Sex.Male,
  }),
});

export const ed3HetHerm = new Strain({
  allelePairs: [mockAlleles.ed3.toTopHet()],
}).toData();

export const ed3HomoHerm = new StrainData({
  strain: new Strain({
    allelePairs: [mockAlleles.ed3.toHomo()],
    sex: Sex.Hermaphrodite,
  }),
});

export const e204WildMale = new StrainData({
  strain: new Strain({
    allelePairs: [mockAlleles.e204.toWild().toHomo()],
    sex: Sex.Hermaphrodite,
  }),
});

export const e204HomoHerm = new StrainData({
  strain: new Strain({
    allelePairs: [mockAlleles.e204.toHomo()],
    sex: Sex.Hermaphrodite,
  }),
});

export const e204HetMale = new StrainData({
  strain: new Strain({
    allelePairs: [mockAlleles.e204.toTopHet()],
    sex: Sex.Male,
  }),
});

export const ox802HomoHerm = new StrainData({
  strain: new Strain({
    allelePairs: [mockAlleles.ox802.toHomo()],
    sex: Sex.Hermaphrodite,
  }),
});

export const e204HetOx802Het = new StrainData({
  strain: new Strain({
    allelePairs: [
      mockAlleles.e204.toTopHet(),
      mockAlleles.ox802.toTopHet(),
    ],
    sex: Sex.Hermaphrodite,
  }),
});

export const e204HomoOx802HetHerm = new StrainData({
  strain: new Strain({
    allelePairs: [
      mockAlleles.e204.toHomo(),
      mockAlleles.ox802.toTopHet(),
    ],
    sex: Sex.Hermaphrodite,
  }),
});

export const e204HomoOx802HomoHerm = new StrainData({
  strain: new Strain({
    allelePairs: [
      mockAlleles.e204.toHomo(),
      mockAlleles.ox802.toHomo(),
    ],
    sex: Sex.Hermaphrodite,
  }),
});

export const n765Homo = new StrainData({
  strain: new Strain({
    allelePairs: [mockAlleles.n765.toHomo()],
    sex: Sex.Hermaphrodite,
  }),
});

export const exStrainNode = new StrainData({
  strain: new Strain({
    allelePairs: [
      mockAlleles.oxEx12345.toTopHet(),
      mockAlleles.oxEx2254.toTopHet(),
    ],
    sex: Sex.Hermaphrodite,
  }),
});
