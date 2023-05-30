import { Sex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';
import {
  Exclude,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer';
import { type AllelePair } from 'models/frontend/Strain/AllelePair';
import { type MenuItem } from 'components/Menu/Menu';

export interface iCrossNodeModel {
  sex: Sex;
  strain: Strain;
  isParent: boolean;
  isChild: boolean;
  probability?: number;
  getMenuItems?: (node: CrossNodeModel) => MenuItem[];
  toggleSex?: () => void;
  toggleHetPair?: (pair: AllelePair) => void;
}
export class CrossNodeModel implements iCrossNodeModel {
  sex: Sex;
  @Type(() => Strain)
  strain: Strain;

  isParent: boolean;
  isChild: boolean;
  probability?: number;

  @Exclude()
  getMenuItems?: (node: CrossNodeModel) => MenuItem[];

  @Exclude()
  toggleSex?: () => void;

  @Exclude()
  toggleHetPair?: (pair: AllelePair) => void;

  constructor(crossNodeModel: iCrossNodeModel) {
    if (crossNodeModel !== null && crossNodeModel !== undefined) {
      this.sex = crossNodeModel.sex;
      this.strain = crossNodeModel.strain;
      this.getMenuItems = crossNodeModel.getMenuItems;
      this.toggleSex = crossNodeModel.toggleSex;
      this.toggleHetPair = crossNodeModel.toggleHetPair;
      this.isParent = crossNodeModel.isParent;
      this.isChild = crossNodeModel.isChild;
      this.probability = crossNodeModel.probability;
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

  static fromJSON(json: string): CrossNodeModel {
    return [plainToInstance(CrossNodeModel, JSON.parse(json))].flat()[0];
  }
}
