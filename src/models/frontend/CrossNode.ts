import { Sex } from 'models/enums';
import Strain from 'models/frontend/Strain';
import { Gene } from 'models/frontend/Gene';
import { VariationInfo } from './VariationInfo';

export default interface CrossNode {
  sex: Sex;
  strain: Strain;
  parents?: CrossNode[];
  isSelected: boolean;
  genes?: Gene[];
  variations?: VariationInfo[];
}

export interface crossNodePair {
  leftCrossNode: CrossNode | null;
  rightCrossNode: CrossNode | null;
  children?: CrossNode[];
}
