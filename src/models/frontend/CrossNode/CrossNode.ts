import { Sex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';
import { MenuItem } from 'components/CrossNodeMenu/CrossNodeMenu';

export default interface CrossNode {
  sex: Sex;
  strain: Strain;
  isSelected: boolean;
  getMenuItems?: (node: CrossNode) => MenuItem[];
}
