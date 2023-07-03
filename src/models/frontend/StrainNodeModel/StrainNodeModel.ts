import {
  Exclude,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer';
import { type MenuItem } from 'components/Menu/Menu';
import { Sex } from 'models/enums';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';

export interface IStrainNodeModel {
  sex?: Sex;
  strain: Strain;
  isParent?: boolean;
  isChild?: boolean;
  probability?: number;
  getMenuItems?: (node: StrainNodeModel) => MenuItem[];
  toggleSex?: () => void;
  toggleHetPair?: (pair: AllelePair) => void;
}

export class StrainNodeModel implements IStrainNodeModel {
  sex: Sex;

  @Type(() => Strain)
  strain: Strain;

  isParent: boolean;
  isChild: boolean;
  probability?: number;

  @Exclude()
  getMenuItems?: (node: StrainNodeModel) => MenuItem[];

  @Exclude()
  toggleSex?: () => void;

  @Exclude()
  toggleHetPair?: (pair: AllelePair) => void;

  constructor(strainNodeModel: IStrainNodeModel) {
    if (strainNodeModel !== null && strainNodeModel !== undefined) {
      this.sex = strainNodeModel.sex ?? Sex.Male;
      this.strain = strainNodeModel.strain;
      this.getMenuItems = strainNodeModel.getMenuItems;
      this.toggleSex = strainNodeModel.toggleSex;
      this.toggleHetPair = strainNodeModel.toggleHetPair;
      this.isParent = strainNodeModel.isParent ?? false;
      this.isChild = strainNodeModel.isChild ?? false;
      this.probability = strainNodeModel.probability;
    } else {
      this.sex = Sex.Male;
      this.strain = new Strain({ allelePairs: [] });
      this.isParent = false;
      this.isChild = false;
    }
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): StrainNodeModel {
    return plainToInstance(
      StrainNodeModel,
      JSON.parse(json) as Record<string, unknown>
    );
  }
}
