import { Sex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';
import { MenuItem } from 'components/CrossNodeMenu/CrossNodeMenu';

export interface CrossNodeModel {
  sex: Sex;
  strain: Strain;
  getMenuItems?: (node: CrossNodeModel) => MenuItem[];
}
