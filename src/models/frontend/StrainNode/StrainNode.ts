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

export interface IStrainNode {
  sex: Sex;
  strain: Strain;
  isParent: boolean;
  isChild: boolean;
  probability?: number;
  getMenuItems?: (node: StrainNode) => MenuItem[];
  toggleSex?: () => void;
  toggleHetPair?: (pair: AllelePair) => void;
}

export class StrainNode implements IStrainNode {
  sex: Sex;
  @Type(() => Strain)
  strain: Strain;

  isParent: boolean;
  isChild: boolean;
  probability?: number;

  @Exclude()
  getMenuItems?: (node: StrainNode) => MenuItem[];

  @Exclude()
  toggleSex?: () => void;

  @Exclude()
  toggleHetPair?: (pair: AllelePair) => void;

  constructor(strainNodeModel: IStrainNode) {
    if (strainNodeModel !== null && strainNodeModel !== undefined) {
      this.sex = strainNodeModel.sex;
      this.strain = strainNodeModel.strain;
      this.getMenuItems = strainNodeModel.getMenuItems;
      this.toggleSex = strainNodeModel.toggleSex;
      this.toggleHetPair = strainNodeModel.toggleHetPair;
      this.isParent = strainNodeModel.isParent;
      this.isChild = strainNodeModel.isChild;
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

  static fromJSON(json: string): StrainNode {
    return [plainToInstance(StrainNode, JSON.parse(json))].flat()[0];
  }
}
