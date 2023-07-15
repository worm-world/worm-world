import {
  Exclude,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer';
import { type MenuItem } from 'components/Menu/Menu';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';

export interface IStrainData {
  strain: Strain;
  isParent?: boolean;
  isChild?: boolean;
  probability?: number;
  getMenuItems?: (node: StrainData) => MenuItem[];
  toggleSex?: () => void;
  toggleHetPair?: (pair: AllelePair) => void;
}

export class StrainData implements IStrainData {
  @Type(() => Strain)
  strain: Strain;

  isParent: boolean;
  isChild: boolean;
  probability?: number;

  @Exclude()
  getMenuItems?: (node: StrainData) => MenuItem[];

  @Exclude()
  toggleSex?: () => void;

  @Exclude()
  toggleHetPair?: (pair: AllelePair) => void;

  constructor(StrainData: IStrainData) {
    if (StrainData !== null && StrainData !== undefined) {
      this.strain = StrainData.strain;
      this.getMenuItems = StrainData.getMenuItems;
      this.toggleSex = StrainData.toggleSex;
      this.toggleHetPair = StrainData.toggleHetPair;
      this.isParent = StrainData.isParent ?? false;
      this.isChild = StrainData.isChild ?? false;
      this.probability = StrainData.probability;
    } else {
      this.strain = new Strain({ allelePairs: [] });
      this.isParent = false;
      this.isChild = false;
    }
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): StrainData {
    return plainToInstance(
      StrainData,
      JSON.parse(json) as Record<string, unknown>
    );
  }
}
