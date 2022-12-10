import { Sex } from 'models/enums';
import Strain from 'models/frontend/Strain';
import { Gene } from 'models/frontend/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo';

export default interface CrossNode {
  sex: Sex;
  strain: Strain;
  parents: CrossNode[];
  isSelected: boolean;
  genes: Gene[];
  variations: VariationInfo[];
}
