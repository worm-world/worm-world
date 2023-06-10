import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import {
  StrainNodeModel,
  type IStrainNodeModel,
} from 'models/frontend/StrainNodeModel/StrainNodeModel';
import * as mockStrains from 'models/frontend/Strain/Strain.mock';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import { type MenuItem } from 'components/Menu/Menu';

export const maleWild = mockStrains.wild.toMaleModel();
export const hermWild = mockStrains.wild.toHermModel();
export const maleWildManyPairs = mockStrains.wildManyPairs.toMaleModel();
export const maleN2 = mockStrains.N2.toMaleModel();
export const maleMT2495 = mockStrains.MT2495.toMaleModel();
export const maleBT14 = mockStrains.BT14.toMaleModel();

export const getMenuItems = (model: IStrainNodeModel): MenuItem[] => {
  const canSelfCross = model.sex === Sex.Hermaphrodite;
  const selfOption: MenuItem = {
    icon: <SelfCrossIcon />,
    text: 'Self-cross',
    menuCallback: () => {
      model.strain
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

export const maleManyPairs = new StrainNodeModel({
  sex: Sex.Male,
  strain: new Strain({
    allelePairs: [
      mockAlleles.chrom1Gene1Allele1.toHomoPair(),
      mockAlleles.chrom2Gene1Allele1.toHomoPair(),
      mockAlleles.chrom2Gene2Allele1.toHomoPair(),
      mockAlleles.chromXGene1Allele1.toHomoPair(),
      mockAlleles.chromExVariation1Allele1.toEcaPair(),
    ],
  }),
  getMenuItems,
});

export const ed3HetMale = new StrainNodeModel({
  sex: Sex.Male,
  strain: new Strain({
    allelePairs: [mockAlleles.ed3.toTopHetPair()],
  }),
  getMenuItems,
});

export const ed3HetHerm = new Strain({
  allelePairs: [mockAlleles.ed3.toTopHetPair()],
}).toHermModel();

export const ed3HomoHerm = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [mockAlleles.ed3.toHomoPair()],
  }),
  getMenuItems,
});

export const e204WildMale = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [mockAlleles.e204.getWild().toHomoPair()],
  }),
  getMenuItems,
});

export const e204HomoHerm = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [mockAlleles.e204.toHomoPair()],
  }),
  getMenuItems,
});

export const e204HetMale = new StrainNodeModel({
  sex: Sex.Male,
  strain: new Strain({
    allelePairs: [mockAlleles.e204.toTopHetPair()],
  }),
  getMenuItems,
});

export const ox802HomoHerm = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [mockAlleles.ox802.toHomoPair()],
  }),
  getMenuItems,
});

export const e204HetOx802Het = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [
      mockAlleles.e204.toTopHetPair(),
      mockAlleles.ox802.toTopHetPair(),
    ],
  }),
  getMenuItems,
});

export const e204HomoOx802HetHerm = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [
      mockAlleles.e204.toHomoPair(),
      mockAlleles.ox802.toTopHetPair(),
    ],
  }),
  getMenuItems,
});

export const e204HomoOx802HomoHerm = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [
      mockAlleles.e204.toHomoPair(),
      mockAlleles.ox802.toHomoPair(),
    ],
  }),
  getMenuItems,
});

export const n765Homo = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [mockAlleles.n765.toHomoPair()],
  }),
  getMenuItems,
});

export const exStrainNode = new StrainNodeModel({
  sex: Sex.Hermaphrodite,
  strain: new Strain({
    allelePairs: [
      mockAlleles.oxEx12345.toEcaPair(),
      mockAlleles.oxEx2254.toEcaPair(),
    ],
  }),
  getMenuItems,
});
