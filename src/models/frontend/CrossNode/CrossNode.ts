import { Sex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';

export default interface CrossNode {
  sex: Sex;
  strain: Strain;
  parents: CrossNode[];
  isSelected: boolean;
}
