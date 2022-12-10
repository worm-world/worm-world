import { Sex } from 'models/enums';
import Strain from 'models/frontend/Strain';
import { Gene } from 'models/frontend/Gene';

export default interface CrossNode {
  sex: Sex;
  strain: Strain;
  parents: CrossNode[];
  isSelected: boolean;
  genes: Gene[];
<<<<<<< HEAD
=======
  variations: VariationInfo[];
>>>>>>> 000e91a (fix: addressed issues from merge request review)
}
