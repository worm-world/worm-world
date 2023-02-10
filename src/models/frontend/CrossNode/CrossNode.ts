import { Sex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';
import {
  Exclude,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer';
import { MenuItem } from 'components/Menu/Menu';

export interface iCrossNodeModel {
  sex: Sex;
  strain: Strain;
  probability?: number;
  getMenuItems?: (node: CrossNodeModel) => MenuItem[];
  toggleSex?: () => void;
}
export class CrossNodeModel implements iCrossNodeModel {
  sex: Sex;
  @Type(() => Strain)
  strain: Strain;

  isParent: boolean;
  probability?: number;

  @Exclude()
  getMenuItems?: (node: CrossNodeModel) => MenuItem[];

  @Exclude()
  toggleSex?: () => void;

  constructor(crossNodeModel: iCrossNodeModel) {
    if (crossNodeModel !== null && crossNodeModel !== undefined) {
      this.sex = crossNodeModel.sex;
      this.strain = crossNodeModel.strain;
      this.getMenuItems = crossNodeModel.getMenuItems;
      this.toggleSex = crossNodeModel.toggleSex;
      this.isParent = this.toggleSex === undefined;
    } else {
      this.sex = Sex.Male;
      this.strain = new Strain({ allelePairs: [] });
      this.isParent = false;
    }
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): CrossNodeModel {
    return [plainToInstance(CrossNodeModel, JSON.parse(json))].flat()[0];
  }
}
