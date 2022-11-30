import { Sex } from 'models/enums';
import Strain from 'models/frontend/Strain';
import Gene from 'models/frontend/Gene';

export default interface CrossNode {
  sex: Sex;
  strain: Strain;
  parents?: CrossNode[];
  isSelected: boolean;
  genes: Gene[];
}

export interface crossNodePair {
  leftCrossNode: CrossNode | null;
  rightCrossNode: CrossNode | null;
  children?: CrossNode[];
}
