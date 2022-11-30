<<<<<<< HEAD
import { Allele } from 'models/frontend/Allele';

export default interface Strain {
  name: String;
=======
import { Allele } from './Allele';

export default interface Strain {
  name: String;
  // alleles: AlleleExpression[]
>>>>>>> 812ceb0 (feat: the CrossNode component with storybook stories)
  alleles: Allele[];
  notes: String;
}
