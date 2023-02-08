import { Sex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';
import { MenuItem } from 'components/CrossNodeMenu/CrossNodeMenu';
import {
  Exclude,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer';

export interface iCrossNodeModel {
  sex: Sex;
  strain: Strain;
  getMenuItems?: (node: iCrossNodeModel) => MenuItem[];
}
export class CrossNodeModel implements iCrossNodeModel {
  sex: Sex;
  @Type(() => Strain)
  strain: Strain;

  probability?: number;

  @Exclude()
  getMenuItems?: (node: iCrossNodeModel) => MenuItem[];

  @Exclude()
  toggleSex?: () => void;

  constructor(crossNodeModel: iCrossNodeModel) {
    if (crossNodeModel !== null && crossNodeModel !== undefined) {
      this.sex = crossNodeModel.sex;
      this.strain = crossNodeModel.strain;
      this.getMenuItems = crossNodeModel.getMenuItems;
    } else {
      this.sex = Sex.Male;
      this.strain = new Strain({ allelePairs: [] });
    }
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): CrossNodeModel {
    return [plainToInstance(CrossNodeModel, JSON.parse(json))].flat()[0];
  }
}
