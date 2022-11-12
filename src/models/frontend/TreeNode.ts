import { Sex } from '../enums';
import Strain from './Strain';

export default interface TreeNode {
  name: String;
  sex: Sex;
  cross: Strain;
  crossPartner: Strain | null;
  parentTree: TreeNode | null;
  children: TreeNode[];
  lastEdited: Date;
}
